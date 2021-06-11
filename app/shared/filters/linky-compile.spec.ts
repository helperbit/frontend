import { LinkyCompilePipe } from './linky-compile';

describe('LinkyCompilePipe', () => {
	const pipe = new LinkyCompilePipe();

	it('should compile safe html correctly', async () => {
		expect(pipe.transform('ciao https://google.com'))
			.toBe('ciao <a href="https://google.com" target="_blank">https://google.com</a>');
	});
});
