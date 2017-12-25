'use strict';

const {createServer} = require('http');

const Fettuccine = require('.');
const test = require('tape');

let count = 0;

createServer(function(req, response) {
	if (req.method === 'POST') {
		req.once('data', data => {
			response.writeHead(200, {'Content-Type': 'application/json'});
			response.end(`{"data": ${data.toString()}}`);
		});
	} else if (req.method === 'DELETE') {
		response.writeHead(200, {
			'Content-Type': 'text/plain',
			[req.headers.key]: req.headers['user-agent']
		});
		response.end('{"status": "deleted"}');
	} else {
		response.writeHead(200, {'Content-Type': 'application/json'});
		response.end('[1]');
	}

	if (++count === 3) {
		this.close();
	}
}).listen(8124);

test('Fettuccine()', t => {
	t.plan(5);

	new Fettuccine().get('http://localhost:8124').then(response => {
		t.equal(response.body, '[1]', 'should send a request to the server.');
	}).catch(t.fail);

	new Fettuccine({
		method: 'post',
		body: [1, 2],
		headers: {},
		json: true
	}).get('http://localhost:8124').then(response => {
		t.deepEqual(response.body, {data: [1, 2]}, 'should use constructor parameters as its default options.');
	}).catch(t.fail);

	new Fettuccine({headers: {'User-agent': 'fettucine'}}).delete('', {
		headers: {
			key: 'foo',
			'user-Agent': 'Fettucine'
		},
		json: false,
		baseUrl: 'http://localhost:8124'
	}).then(({body, headers}) => {
		t.equal(body, '{"status": "deleted"}', 'should have alias methods.');
		t.equal(
			headers.foo,
			'Fettucine',
			'should use the first argument of the method as prior options.'
		);
	}).catch(t.fail);

	new Fettuccine().patch('https://n/o/_/s/e/r/v/e/r').then(t.fail, ({syscall}) => {
		t.equal(syscall, 'getaddrinfo', 'should be rejected when the request fails.');
	}).catch(t.fail);
});

test('Method argument validation', async t => {
	try {
		await new Fettuccine().head(['1', true]);
	} catch ({message}) {
		t.equal(
			message,
			'[ \'1\', true ] is not a string. Expected a URI.',
			'should be rejected when the URL is not a string.'
		);
	}

	try {
		await new Fettuccine().delete('');
	} catch ({message}) {
		t.equal(
			message,
			'Expected a URI but received an empty string.',
			'should be rejected when it takes an empty string URL and `baseUrl` is not defined.'
		);
	}

	try {
		await new Fettuccine().get('https://exmaple.com/%%');
	} catch (err) {
		t.ok(
			err instanceof URIError,
			'should be rejected when it takes an RFC 3986 incompatible URI.'
		);
	}

	t.end();
});
