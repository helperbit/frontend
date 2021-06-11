import { CropUrlPipe } from './crop-url';

describe('CropUrl', () => {
	const pipe = new CropUrlPipe();

	it('should crop url removing get query', () => {
		expect(pipe.transform('https://ciao.it/sub/test?luca=gatto&micio=miao', 'url'))
			.toBe('https://ciao.it/sub/test');
	});

	it('should crop url getting query object', () => {
		expect(pipe.transform('https://ciao.it/sub/test?luca=gatto&micio=miao', 'query'))
			.toEqual({ luca: 'gatto', micio: 'miao' });
	});
});
