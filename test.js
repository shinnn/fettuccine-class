'use strict';

const {createServer} = require('http');

const Fettuccine = require('.');
const test = require('tape');

let count = 0;

createServer(function(req, response) {
	if (req.method === 'POST') {
		req.once('data', data => {
			response.writeHead(200, {'Content-Type': 'application/json'});
			response.end(`{"data": ${data.toString()}}`, () =>	req.destroy());
		});
	} else if (req.method === 'DELETE') {
		response.writeHead(200, {
			'Content-Type': 'text/plain',
			[req.headers.key]: req.headers['user-agent']
		});
		response.end('{"status": "deleted"}', () =>	req.destroy());
	} else {
		response.writeHead(200, {'Content-Type': 'application/json'});
		response.end('[1]', () =>	req.destroy());
	}

	if (++count === 3) {
		this.close();
	}
}).listen(8124);

test('Fettuccine prototype methods', t => {
	t.plan(5);

	(async () => {
		t.equal(
			await (await new Fettuccine({}).get('http://localhost:8124')).text(),
			'[1]',
			'should send a request to the server.'
		);
	})();

	(async () => {
		t.deepEqual(
			await (await new Fettuccine({
				method: 'post',
				body: JSON.stringify([1, 2]),
				headers: {}
			}).fetch('http://localhost:8124')).json(),
			{data: [1, 2]},
			'should use constructor parameters as its default options.'
		);
	})();

	(async () => {
		const {body, headers} = await new Fettuccine({headers: {'User-agent': 'fettucine'}}).delete('/', {
			headers: {
				key: 'foo',
				'user-Agent': 'Fettucine'
			},
			baseUrl: 'http://localhost:8124'
		});

		for await (const chunk of body) {
			t.ok(
				chunk.equals(Buffer.from('{"status": "deleted"}')),
				'should contain per-method aliases.'
			);
		}

		t.equal(
			headers.get('foo'),
			'Fettucine',
			'should use the first argument of the method as prior options.'
		);
	})();

	(async () => {
		try {
			await new Fettuccine({}).delete('https://n/o/_/s/e/r/v/e/r', {method: 'put'});
		} catch ({code}) {
			t.equal(
				code,
				'ERR_OPTION_UNCONFIGURABLE',
				'should make `method` option unconfigurable if the method is not `request`.'
			);
		}
	})();
});
