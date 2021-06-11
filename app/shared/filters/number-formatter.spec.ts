import { NumberFormatterPipe } from './number-formatter';

describe('NumberFormatterPipe', () => {
	const pipe = new NumberFormatterPipe();

	it('should transform 10000 in 10 000', async () => {
		expect(pipe.transform('10000')).toBe('10 000');
	});

	it('should transform 10000000 in 10 000 000', async () => {
		expect(pipe.transform('10000000')).toBe('10 000 000');
	});

	it('should transform 10000000.12 in 10 000 000.12', async () => {
		expect(pipe.transform('10000000.12')).toBe('10 000 000.12');
	});
});
