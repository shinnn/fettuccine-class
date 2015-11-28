'use strict';

const http = require('http');

const Fettuccine = require('.');
const test = require('tape');

const server = http.createServer(function(req, response) {
  if (req.method === 'POST') {
    req.once('data', data => {
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(`{"data": ${data.toString()}}`);
    });
  } else if (req.method === 'DELETE') {
    response.writeHead(200, {
      'Content-Type': 'text/plain',
      foo: req.headers['user-agent']
    });
    response.end('{"status": "deleted"}');
  } else {
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end('[1]');
  }

  if (++this.responded === 3) {
    this.close();
  }
}).listen(8124);

server.responded = 0;

test('Fettuccine()', t => {
  t.plan(7);

  new Fettuccine().get('http://localhost:8124').then(response => {
    t.strictEqual(response.body, '[1]', 'should send a request to the server.');
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
    headers: {'user-Agent': 'Fettucine'},
    json: false,
    baseUrl: 'http://localhost:8124'
  }).then(response => {
    t.strictEqual(response.body, '{"status": "deleted"}', 'should have alias methods.');
    t.strictEqual(
      response.headers.foo,
      'Fettucine',
      'should use the first argument of the method as prior options.'
    );
  }).catch(t.fail);

  new Fettuccine().patch('https://n/o/_/s/e/r/v/e/r').then(t.fail, err => {
    t.equal(err.syscall, 'getaddrinfo', 'should be rejected when the request fails.');
  }).catch(t.fail);

  new Fettuccine().head(true).then(t.fail, err => {
    t.equal(
      err.message,
      'true is not a string. Expected a URI.',
      'should be rejected when the URL is not a string.'
    );
  }).catch(t.fail);

  new Fettuccine().delete('').then(t.fail, err => {
    t.equal(
      err.message,
      'Expected a URI but received an empty string.',
      'should be rejected when it takes an empty string URL and `baseUrl` is not defined.'
    );
  }).catch(t.fail);
});
