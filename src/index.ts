import { Pair } from './pair';
import { Position } from './position';
import { Scanner } from './scanner';

function match(position: Position, text: string, options: string[][]): Position | null {
	const scanner = new Scanner(text, position);

	if(scanner.isEOF()) {
		return null;
	}

	const pairs: Record<string, Pair> = {};
	for(const strings of options) {
		const escape: Record<string, string[]> = {};

		for(const string of strings.slice(2)) {
			if(escape[string[0]]) {
				escape[string[0]].push(string.slice(1));
			}
			else {
				escape[string[0]] = [string.slice(1)];
			}
		}

		pairs[strings[0]] = {
			close: strings[1],
			escape,
		};
	}

	let pair = scanner.matchOpen(pairs);
	if(!pair) {
		return null;
	}

	scanner.advance();

	const stack: Pair[] = [];
	let newPair: Pair | null;

	while(!scanner.isEOF()) {
		if(scanner.skipEscape(pair)) {
			continue;
		}
		else if(scanner.matchClose(pair)) {
			if(stack.length === 0) {
				return scanner.position();
			}
			else {
				pair = stack.pop()!;
			}
		}
		else if((newPair = scanner.matchOpen(pairs))) {
			stack.push(pair);

			pair = newPair;
		}

		scanner.advance();
	}

	return null;
}

export {
	Position,
	match,
};
