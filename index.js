'use strict';

const {create, CACHE_DIR, MINIMUM_REQUIRED_NPM_VERSION} = require('wise-fetch');

const fetchSymbol = Symbol('fetchSymbol');

class Fettuccine {
	constructor(...args) {
		const wiseFetch = create(...args);

		Object.defineProperties(this, {
			[fetchSymbol]: {
				value: wiseFetch
			},
			options: {
				value: wiseFetch.options,
				enumerable: true
			}
		});
	}

	fetch(...args) {
		return this[fetchSymbol](...args);
	}
}

for (const method of [
	'delete',
	'get',
	'patch',
	'post',
	'put',
	'head'
]) {
	const perMethodSymbol = Symbol(method);

	Fettuccine.prototype[method] = async function(...args0) {
		Object.defineProperty(this, perMethodSymbol, {
			value: this[fetchSymbol].create({
				method,
				frozenOptions: new Set([...this[fetchSymbol].options.frozenOptions || [], 'method'])
			})
		});

		const instance = this;

		Fettuccine.prototype[method] = async function(...args1) {
			return instance[perMethodSymbol](...args1);
		};

		return this[perMethodSymbol](...args0);
	};
}

Object.defineProperties(Fettuccine, {
	CACHE_DIR: {
		value: CACHE_DIR,
		enumerable: true
	},
	MINIMUM_REQUIRED_NPM_VERSION: {
		value: MINIMUM_REQUIRED_NPM_VERSION,
		enumerable: true
	}
});

module.exports = Fettuccine;
