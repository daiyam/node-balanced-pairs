import { Pair } from './types/pair';

export interface Config {
	pairs: {
		blocks: string[][];
		strings: string[][];
	};
	comments?: {
		blocks: string[][];
		lines: string[];
	};
}

export interface WorkingConfig {
	pairs: Record<string, Pair>;
	comments: CommentsConfig;
}

export interface CommentsConfig {
	blocks: Array<{
		open: string[];
		close: string[];
	}>;
	lines: string[][];
}

export function toWorkingConfig(config: Config): WorkingConfig {
	const pairs = {};
	toPair(config.pairs.blocks, true, pairs);
	toPair(config.pairs.strings, false, pairs);

	if(config.comments) {
		const lines = config.comments.lines.map((comment) => comment.split(''));
		const blocks = config.comments.blocks.map(([open, close]) => ({
			open: open.split(''),
			close: close.split(''),
		}));

		return {
			pairs,
			comments: {
				blocks,
				lines,
			},
		};
	}
	else {
		return {
			pairs,
			comments: {
				blocks: [],
				lines: [],
			},
		};
	}
}

function toPair(config: string[][], isBlock: boolean, pairs: Record<string, Pair>) {
	for(const strings of config) {
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
			isBlock,
		};
	}
}
