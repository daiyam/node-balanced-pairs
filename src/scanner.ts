import { CommentsConfig } from './config';
import { Pair } from './types/pair';

export abstract class Scanner {
	protected _eof = false;

	public isEOF(): boolean { // {{{
		return this._eof;
	} // }}}

	public matchOpen(pairs: Record<string, Pair>): Pair | null { // {{{
		const c = this.char();

		if(pairs[c]) {
			return pairs[c];
		}
		else {
			return null;
		}
	} // }}}

	public matchClose(pair: Pair): boolean { // {{{
		const c = this.char();

		return c === pair.close;
	} // }}}

	public skipComments(config: CommentsConfig): void { // {{{
		this.skipWhitespaces();

		while(this.skipComment(config)) {
			this.skipWhitespaces();
		}
	} // }}}

	protected skipComment(config: CommentsConfig): boolean { // {{{
		for(const comment of config.lines) {
			if(this.matchString(comment)) {
				this.advanceNextLine();

				return true;
			}
		}

		for(const comment of config.blocks) {
			if(this.matchString(comment.open)) {
				this.advance(comment.open.length);

				while(!this.isEOF()) {
					if(this.matchString(comment.close)) {
						this.advance(comment.close.length);

						return true;
					}

					this.advance();
				}
			}
		}

		return false;
	} // }}}

	public abstract advance(steps?: number): void;

	public abstract skipEscape(pair: Pair): boolean;

	protected abstract advanceNextLine(): void;

	protected abstract char(): string;

	protected abstract matchString(comment: string[]): boolean;

	protected abstract skipWhitespaces(): void;
}
