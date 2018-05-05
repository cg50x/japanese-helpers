import { convertNumberToKanji } from './KanjiService';

describe('KanjiService', () => {
	describe('convertNumberToKanji', () => {
		it('0 returns "0"', () => {
			const input = 0;
			const expected = '0';
			
			const result = convertNumberToKanji(input);
			
			expect(result).toBe(expected);
		});
	});
});
