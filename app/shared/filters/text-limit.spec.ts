import { TextLimitPipe } from './text-limit';

describe('TextLimitPipe', () => {
	const pipe = new TextLimitPipe();

	it('should return a correct cropped string', async () => {
		expect(pipe.transform('ciao mondo marcio', 8)).toBe('ciao...');
	});
});
