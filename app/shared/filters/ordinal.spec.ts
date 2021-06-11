import { OrdinalPipe } from './ordinal';

describe('OrdinalPipe', () => {
	const pipe = new OrdinalPipe();

	it('should transform 1 to 1st', async () => {
		expect(pipe.transform(1)).toBe('1st');
	});

	it('should transform 12 to 12th', async () => {
		expect(pipe.transform(12)).toBe('12th');
	});

	it('should transform 22 to 22nd', async () => {
		expect(pipe.transform(22)).toBe('22nd');
	});

	it('should transform 33 to 33rd', async () => {
		expect(pipe.transform(33)).toBe('33rd');
	});

	it('should transform 3198 to 3198th', async () => {
		expect(pipe.transform(3198)).toBe('3198th');
	});
});
