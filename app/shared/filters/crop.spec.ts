import { CropPipe } from './crop';

describe('CropPipe', () => {
	const pipe = new CropPipe();

	it('should crop the string \'ciao\'', async () => {
		expect(pipe.transform('ciao', 2)).toBe('ci...');
	});
});
