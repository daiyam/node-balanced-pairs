[@daiyam/balanced-pairs](https://github.com/daiyam/node-balanced-pairs)
=======================================================================

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@daiyam/balanced-pairs.svg?colorB=green)](https://www.npmjs.com/package/@daiyam/balanced-pairs)
[![License](https://img.shields.io/badge/donate-ko--fi-green)](https://ko-fi.com/daiyam)
[![License](https://img.shields.io/badge/donate-liberapay-green)](https://liberapay.com/daiyam/donate)
[![License](https://img.shields.io/badge/donate-paypal-green)](https://paypal.me/daiyam99)

Find your brackets and quotes in pairs

Getting Started
---------------

With [node](http://nodejs.org) previously installed:

	npm install @daiyam/balanced-pairs

```typescript
import { matchPair } from '@daiyam/balanced-pairs';

const JSON_WITH_COMMENTS_CONFIG = {
	pairs: {
		blocks: [
			['{', '}'],
			['[', ']'],
		],
		strings: [
			['"', '"', '\\"', '\\\\'],
			['\'', '\'', '\'', '\\\\'],
			['`', '`', '`', '\\\\'],
		],
	},
	comments: {
		lines: [
			'//',
		],
		blocks: [
			['/*', '*/'],
		],
	},
};

/*
 * @param {string} text - The JSON string
 * @param {number} index - The index of the first character of the pair
 * @return {number} The index of the last character of the pair
*/
function matchPairPerIndex(text: string, index: number): number {
    return matchPair(text, index, JSON_WITH_COMMENTS_CONFIG);
}

/*
 * @param {string | string[]} text - The JSON string
 * @param {line: number, column: number} position - The position of first character of the pair
 * @return {line: number, column: number} The position of the last character of the pair
*/
function matchPairPerPosition(text: string | string[], position: {line: number, column: number}): {line: number, column: number} {
    return matchPair(text, position, JSON_WITH_COMMENTS_CONFIG);
}
```

## Donations

Support this project by becoming a financial contributor.

<table>
	<tr>
		<td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_kofi.png" alt="Ko-fi" width="80px" height="80px"></td>
		<td><a href="https://ko-fi.com/daiyam" target="_blank">ko-fi.com/daiyam</a></td>
	</tr>
	<tr>
		<td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_liberapay.png" alt="Liberapay" width="80px" height="80px"></td>
		<td><a href="https://liberapay.com/daiyam/donate" target="_blank">liberapay.com/daiyam/donate</a></td>
	</tr>
	<tr>
		<td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_paypal.png" alt="PayPal" width="80px" height="80px"></td>
		<td><a href="https://paypal.me/daiyam99" target="_blank">paypal.me/daiyam99</a></td>
	</tr>
</table>

License
-------

Copyright &copy; 2021-present Baptiste Augrain

Licensed under the [MIT license](https://opensource.org/licenses/MIT).
