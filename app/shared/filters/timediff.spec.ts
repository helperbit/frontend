import { TimediffPipe } from './timediff';

describe('TimediffPipe', () => {
	const pipe = new TimediffPipe();

	it('should return a timediff in the future', async () => {
		expect(pipe.transform(new Date(2100, 12, 13))).toContain('in over');
	});

	it('should return a timediff in the past', async () => {
		expect(pipe.transform(new Date(2000, 12, 13))).toContain('ago');
	});
});
