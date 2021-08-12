import { Config, toWorkingConfig } from './config';
import { Pair } from './types/pair';
import { Position } from './types/position';
import { IndexScanner } from './scanners';
import { PositionScanner } from './scanners/position';
import { LineTransformer } from './types/line-transformer';

function matchPair(position: number, text: string, config: Config): number | null;
function matchPair(position: Position, text: string | string[], config: Config, transform?: LineTransformer): Position | null;
function matchPair(position: number | Position, text: string | string[], config: Config, transform?: LineTransformer): number | Position | null {
	const useIndex = typeof position === 'number';
	const scanner = useIndex ? new IndexScanner(position as number, Array.isArray(text) ? text.join('\n') : text) : new PositionScanner(position as Position, text, transform);

	if(scanner.isEOF()) {
		return null;
	}

	const cfg = toWorkingConfig(config);

	let pair = scanner.matchOpen(cfg.pairs);
	if(!pair) {
		return null;
	}

	scanner.advance();

	const stack: Pair[] = [];
	let newPair: Pair | null;

	while(!scanner.isEOF()) {
		if(pair.isBlock) {
			scanner.skipComments(cfg.comments);

			if(scanner.isEOF()) {
				return null;
			}
		}

		if(scanner.skipEscape(pair)) {
			continue;
		}
		else if(scanner.matchClose(pair)) {
			if(stack.length === 0) {
				if(useIndex) {
					return (scanner as IndexScanner).index();
				}
				else {
					return (scanner as PositionScanner).position();
				}
			}
			else {
				pair = stack.pop()!;
			}
		}
		else if((newPair = scanner.matchOpen(cfg.pairs))) {
			stack.push(pair);

			pair = newPair;
		}

		scanner.advance();
	}

	return null;
}

export {
	Config,
	Position,
	matchPair,
};
