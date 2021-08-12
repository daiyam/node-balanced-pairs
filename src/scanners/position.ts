import { Pair } from '../types/pair';
import { Position } from '../types/position';
import { Scanner } from '../scanner';
import { LineTransformer } from '../types/line-transformer';

export class PositionScanner extends Scanner {
	private _column = 1;
	private readonly _data: string[];
	private readonly _length: number;
	private _line = 1;
	private readonly _transform?: LineTransformer;

	constructor(position: Position, text: string | string[], transform?: LineTransformer) { // {{{
		super();

		if(typeof text === 'string') {
			this._data = text.split(/\r?\n/);
		}
		else {
			this._data = transform ? [...text] : text;
		}

		this._length = this._data.length;
		this._line = position.line - 1;
		this._column = position.column - 1;
		this._transform = transform;

		if(this._line >= this._length) {
			this._eof = true;
		}
		else {
			if(this._transform) {
				const length = this._data[this._line].length;

				this._data[this._line] = this._transform(this._data[this._line]);

				this._column -= length - this._data[this._line].length;
			}

			if(this._column >= this._data[this._line].length) {
				this.advanceNextLine();
			}
		}
	} // }}}

	public advance(steps = 1): void { // {{{
		this._column += steps;

		if(this._column >= this._data[this._line].length) {
			this.advanceNextLine();
		}
	} // }}}

	public skipEscape(pair: Pair): boolean { // {{{
		const line = this._data[this._line];

		if(this._column + 2 >= line.length) {
			return false;
		}

		const escape = pair.escape[line[this._column]];

		if(escape?.includes(line[this._column + 1])) {
			this._column += 2;

			return true;
		}
		else {
			return false;
		}
	} // }}}

	public position(): Position { // {{{
		return {
			line: this._line + 1,
			column: this._column + 1,
		};
	} // }}}

	protected advanceNextLine(): void { // {{{
		++this._line;
		this._column = 0;

		if(this._line >= this._length) {
			this._eof = true;
		}
		else if(this._transform) {
			this._data[this._line] = this._transform(this._data[this._line]);
		}
	} // }}}

	protected char(): string { // {{{
		return this._data[this._line][this._column];
	} // }}}

	protected matchString(comment: string[]): boolean { // {{{
		const line = this._data[this._line];

		if(this._column + comment.length >= line.length) {
			return false;
		}

		for(const [i, c] of comment.entries()) {
			if(line[this._column + i] !== c) {
				return false;
			}
		}

		return true;
	} // }}}

	protected skipWhitespaces(): void { // {{{
		let match = /^\s+/.exec(this._data[this._line].slice(this._column));
		while(match) {
			this.advance(match[0].length);

			match = this.isEOF() ? null : /^\s+/.exec(this._data[this._line].slice(this._column));
		}
	} // }}}
}
