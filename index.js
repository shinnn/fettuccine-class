'use strict';

const util = require('util');

const loadRequestFromNpmOrCwd = require('load-request-from-cwd-or-npm');

const DEFAULT_USER_AGENT = 'fettuccine (https://github.com/shinnn/fettuccine)';
const loadRequest = loadRequestFromNpmOrCwd();

const userAgentHeaderRe = /^user-agent$/i;

function isUserAgentHeader(key) {
	return userAgentHeaderRe.test(key);
}

class Fettuccine {
	constructor(options) {
		this.options = Object.assign({gzip: true}, options);

		if (this.options.headers) {
			const hasUserAgent = Object.keys(this.options.headers).some(isUserAgentHeader);

			if (!hasUserAgent) {
				this.options.headers['user-agent'] = DEFAULT_USER_AGENT;
			}
		} else {
			this.options.headers = {'user-agent': DEFAULT_USER_AGENT};
		}

		this.request = loadRequest;
	}

	get(url, options) {
		if (typeof url !== 'string') {
			return Promise.reject(new TypeError(`${util.inspect(url)} is not a string. Expected a URI.`));
		}

		try {
			decodeURI(url);
		} catch (e) {
			return Promise.reject(new URIError(`Expected an RFC 3986 compatible URI, but received ${
				util.inspect(url)
			}. In short, RFC 3986 says that a URI must be a UTF-8 sequence. https://tools.ietf.org/html/rfc3986`));
		}

		options = Object.assign({}, this.options, options);
		options.headers = Object.assign({}, this.options.headers, options.headers);

		if (!options.baseUrl && url === '') {
			return Promise.reject(new Error('Expected a URI but received an empty string.'));
		}

		return this.request.then(function promisifyRequest(request) {
			return new Promise(function executor(resolve, reject) {
				request(url, options, function requestCallback(err, res) {
					if (err) {
						reject(err);
						return;
					}

					resolve(res);
				});
			});
		});
	}
}

[
	'post',
	'put',
	'patch',
	'head',
	'delete'
].forEach(method => {
	Fettuccine.prototype[method] = function(url, options) {
		return this.get(url, Object.assign({}, options, {method}));
	};
});

module.exports = Fettuccine;
