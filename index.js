'use strict';

const {inspect, promisify} = require('util');

const inspectWithKind = require('inspect-with-kind');
const loadRequestFromNpmOrCwd = require('load-request-from-cwd-or-npm');

const DEFAULT_USER_AGENT = 'fettuccine (https://github.com/shinnn/fettuccine)';

class Fettuccine {
	constructor(baseOptions) {
		this.options = {
			gzip: true,
			...baseOptions
		};

		if (this.options.headers) {
			for (const key of Object.keys(this.options.headers)) {
				if (key.toLowerCase() !== 'user-agent') {
					continue;
				}

				this.options.headers['user-agent'] = DEFAULT_USER_AGENT;
			}
		} else {
			this.options.headers = {'user-agent': DEFAULT_USER_AGENT};
		}

		Object.defineProperty(this, 'load', {
			value: (async () => {
				try {
					const request = (await loadRequestFromNpmOrCwd()).defaults(this.options);
					return promisify(request);
				} catch (err) {
					Object.defineProperty(this, 'constructorError', {value: err});
				}

				return null;
			})()
		});
	}

	async get(url, options) {
		if (typeof url !== 'string') {
			throw new TypeError(`Expected a URI but got a non-string value ${inspectWithKind(url)}.`);
		}

		try {
			decodeURI(url);
		} catch (e) {
			throw new URIError(`Expected an RFC 3986 compatible URI, but received ${
				inspect(url)
			}. In short, RFC 3986 says that a URI must be a UTF-8 sequence. https://tools.ietf.org/html/rfc3986`);
		}

		if (!this.options.baseUrl && (options === null || typeof options !== 'object' || !options.baseUrl) && url === '') {
			throw new Error('Expected a URI but received \'\' (empty string).');
		}

		const promisifiedRequest = await this.load;

		if (this.constructorError) {
			throw this.constructorError;
		}

		return promisifiedRequest(url, options);
	}
}

for (const method of [
	'post',
	'put',
	'patch',
	'head',
	'delete'
]) {
	Fettuccine.prototype[method] = function(url, options) {
		return this.get(url, {...options, method});
	};
}

module.exports = Fettuccine;
