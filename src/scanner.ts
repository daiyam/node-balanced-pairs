import { Pair } from './pair';
import { Position } from './position';

export class Scanner {
	private _column = 1;
	private readonly _data: string;
	private _eof = false;
	private _index = 0;
	private readonly _length: number;
	private _line = 1;

	constructor(text: string, position: Position) { // {{{
		this._data = text;
		this._length = text.length;

		this.moveToPosition(position);
	} // }}}

	public advance(): void { // {{{
		const c = this._data.charCodeAt(this._index);
		++this._index;

		if(this._index >= this._length) {
			this._eof = true;
		}
		else if(c === 13 && this._index + 1 < this._length && this._data.charCodeAt(this._index + 1) === 10) {
			++this._index;
			++this._line;
			this._column = 1;
		}
		else if(c === 10 || c === 13) {
			++this._line;
			this._column = 1;
		}
		else {
			++this._column;
		}
	} // }}}

	public isEOF(): boolean { // {{{
		return this._eof;
	} // }}}

	public matchOpen(pairs: Record<string, Pair>): Pair | null { // {{{
		const c = this._data[this._index];

		if(pairs[c]) {
			return pairs[c];
		}
		else {
			return null;
		}
	} // }}}

	public matchClose(pair: Pair): boolean { // {{{
		const c = this._data[this._index];

		return c === pair.close;
	} // }}}

	public position(): Position { // {{{
		return {
			line: this._line,
			column: this._column,
		};
	} // }}}

	public skipEscape(pair: Pair): boolean { // {{{
		if(this._index + 2 >= this._length) {
			return false;
		}

		const escape = pair.escape[this._data[this._index]];

		if(escape?.includes(this._data[this._index + 1])) {
			this._index += 2;
			this._column += 2;

			return true;
		}
		else {
			return false;
		}
	} // }}}

	private moveToPosition({ line, column }: Position): void { // {{{
		if(line > this._line) {
			this.skipNewLine(() => false, () => this._line === line);
		}

		if(line === this._line) {
			this.skipNewLine(() => this._column === column, () => true);
		}

		if(this._index >= this._length) {
			this._eof = true;
		}
	} // }}}

	private skipNewLine(newColumn: () => boolean, newLine: () => boolean): void { // {{{
		let index = this._index - 1;
		let c: number;

		while(++index < this._length) {
			c = this._data.charCodeAt(index);

			if(c === 13 && this._data.charCodeAt(index + 1) === 10) {
				this._line++;
				this._column = 1;

				++index;

				if(newLine()) {
					++index;

					break;
				}
			}
			else if(c === 10 || c === 13) {
				this._line++;
				this._column = 1;

				if(newLine()) {
					++index;

					break;
				}
			}
			else if(newColumn()) {
				break;
			}
			else {
				++this._column;
			}
		}

		this._index = index;
	} // }}}
}
