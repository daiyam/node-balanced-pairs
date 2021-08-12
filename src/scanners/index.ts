import { Pair } from '../types/pair';
import { Scanner } from '../scanner';

export class IndexScanner extends Scanner {
	private readonly _data: string;
	private _index = 0;
	private readonly _length: number;

	constructor(position: number, text: string) { // {{{
		super();

		this._data = text;
		this._length = text.length;
		this._index = position;

		if(this._index > this._length) {
			this._eof = true;
		}
	} // }}}

	public advance(steps = 1): void { // {{{
		this._index += steps;

		if(this._index >= this._length) {
			this._eof = true;
		}
	} // }}}

	public index() { // {{{
		return this._index;
	} // }}}

	public skipEscape(pair: Pair): boolean { // {{{
		if(this._index + 2 >= this._length) {
			return false;
		}

		const escape = pair.escape[this._data[this._index]];

		if(escape?.includes(this._data[this._index + 1])) {
			this._index += 2;

			return true;
		}
		else {
			return false;
		}
	} // }}}

	protected advanceNextLine(): void { // {{{
		let c: number;
		while(++this._index < this._length) {
			c = this._data.charCodeAt(this._index);

			if(c === 10) {
				++this._index;
				break;
			}
			else if(c === 13) {
				++this._index;

				if(this._index < this._length && this._data.charCodeAt(this._index) === 10) {
					++this._index;
				}

				break;
			}
		}
	} // }}}

	protected char(): string { // {{{
		return this._data[this._index];
	} // }}}

	protected matchString(comment: string[]): boolean { // {{{
		if(this._index + comment.length >= this._length) {
			return false;
		}

		for(const [i, c] of comment.entries()) {
			if(this._data[this._index + i] !== c) {
				return false;
			}
		}

		return true;
	} // }}}

	protected skipWhitespaces(): void { // {{{
		let c: number;
		while(this._index + 1 < this._length) {
			c = this._data.charCodeAt(this._index + 1);

			if(c === 9 || c === 32) {
				++this._index;
			}
			else {
				break;
			}
		}
	} // }}}
}
