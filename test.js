'use strict';

const {createServer} = require('http');
const {resolve} = require('path');

const clearModules = require('clear-module').all;
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

test('Fettuccine prototype methods', t => {
	t.plan(5);

	(async () => {
		t.equal(
			(await new Fettuccine().get('http://localhost:8124')).body,
			'[1]',
			'should send a request to the server.'
		);
	})();

	(async () => {
		t.deepEqual(
			(await new Fettuccine({
				method: 'post',
				body: [1, 2],
				headers: {},
				json: true
			}).get('http://localhost:8124')).body,
			{data: [1, 2]},
			'should use constructor parameters as its default options.'
		);
	})();

	(async () => {
		const {body, headers} = await new Fettuccine({headers: {'User-agent': 'fettucine'}}).delete('', {
			headers: {
				key: 'foo',
				'user-Agent': 'Fettucine'
			},
			json: false,
			baseUrl: 'http://localhost:8124'
		});

		t.deepEqual(body, '{"status": "deleted"}', 'should contain per-method aliases.');

		t.equal(
			headers.foo,
			'Fettucine',
			'should use the first argument of the method as prior options.'
		);
	})();

	(async () => {
		try {
			await new Fettuccine({
				headers: {
					'Accept-Language': 'en-US,en;q=0.5'
				}
			}).patch('https://n/o/_/s/e/r/v/e/r');
		} catch ({syscall}) {
			t.equal(syscall, 'getaddrinfo', 'should be rejected when the request fails.');
		}
	})();
});

test('Method argument validation', async t => {
	try {
		await new Fettuccine().head(['1', true]);
	} catch ({message}) {
		t.equal(
			message,
			'Expected a URI but got a non-string value [ \'1\', true ] (array).',
			'should be rejected when the URL is not a string.'
		);
	}

	try {
		await new Fettuccine().delete('');
	} catch ({message}) {
		t.equal(
			message,
			'Expected a URI but received \'\' (empty string).',
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

test('Fettucine#get() with no globally installed npm CLI', async t => {
	clearModules();

	process.env.PATH = resolve('/none', 'exists');
	delete process.env.npm_execpath;

	const FetticineUnloadable = require('.');
	const fettucine = new FetticineUnloadable();

	try {
		await fettucine.get('https://exmaple.org');
	} catch ({code}) {
		t.equal(code, 'MODULE_NOT_FOUND', 'should fail.');
	}

	t.end();
});

