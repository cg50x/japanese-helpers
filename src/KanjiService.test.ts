import { convertNumberToKanji, kanjiNumberMap } from './KanjiService';

describe('KanjiService', () => {
	describe('convertNumberToKanji', () => {
		it('returns "ぜろ" when given 0', () => {
			const input = 0;
			const expected = 'ぜろ';
			
			const result = convertNumberToKanji(input);
			
			expect(result).toBe(expected);
		});
		it('works with numbers between 1 and 10', () => {
			const tests = [
				{input: 1, expected: '一'},
				{input: 2, expected: '二'},
				{input: 3, expected: '三'},
				{input: 4, expected: '四'},
				{input: 5, expected: '五'},
				{input: 6, expected: '六'},
				{input: 7, expected: '七'},
				{input: 8, expected: '八'},
				{input: 9, expected: '九'},
				{input: 10, expected: '十'}
			];
			
			tests.forEach((test) => {
				const result = convertNumberToKanji(test.input);
				expect(result).toBe(test.expected);
			});
		});
		it('works with numbers between 10 and 99', () => {
			const tests = [
				{input: 11, expected: '十一'},
				{input: 22, expected: '二十二'},
				{input: 33, expected: '三十三'},
				{input: 44, expected: '四十四'},
				{input: 55, expected: '五十五'},
				{input: 66, expected: '六十六'},
				{input: 77, expected: '七十七'},
				{input: 88, expected: '八十八'},
				{input: 99, expected: '九十九'},
				
			];
			
			tests.forEach((test) => {
				const result = convertNumberToKanji(test.input);
				expect(result).toBe(test.expected);
			});
		});
		it('works with numbers between 100 and 999', () => {
			const tests = [
				{input: 100, expected: '百'}
				{input: 101, expected: '百一'},
				{input: 123, expected: '百二十三'},
				{input: 202, expected: '二百二'},
				{input: 333, expected: '三百三十三'},
				{input: 999, expected: '九百九十九'},
			];
			
			tests.forEach((test) => {
				const result = convertNumberToKanji(test.input);
				expect(result).toBe(test.expected);
			});
		});
		it('works with numbers between 1000 and 9,999', () => {
			const tests = [
				{input: 1000, expected: '千'}
				{input: 1001, expected: '千一'},
				{input: 1234, expected: '千二百三十四'},
				{input: 5678, expected: '五千六百七十八'},
				{input: 8421, expected: '八千四百二十一'},
				{input: 9999, expected: '九千九百九十九'},
			];
			
			tests.forEach((test) => {
				const result = convertNumberToKanji(test.input);
				expect(result).toBe(test.expected);
			});
		});
		it('works with numbers between 10,000 and 9,999,999', () => {
			const tests = [
				{input: 10000, expected: '一万'}
				{input: 10001, expected: '一万一'},
				{input: 123456, expected: '十二万三千四百五十六'},
				{input: 1234567, expected: '百二十三万四千五百六十七'},
				{input: 9282928, expected: '九百二十八万二千九百二十八'},
				{input: 9999999, expected: '九百九十九万九千九百九十九'},
			];
			
			tests.forEach((test) => {
				const result = convertNumberToKanji(test.input);
				expect(result).toBe(test.expected);
			});
		});
	});
});
