import { MediaPipe } from './media';

describe('MediaPipe', () => {
	const pipe = new MediaPipe();

	it('should return correct media thumb', async () => {
		expect(pipe.transform('123', 'media', 400))
			.toContain('/media/123/thumbnail/400');
	});

	it('should return correct media', async () => {
		expect(pipe.transform('123'))
			.toContain('/media/123');
	});
});
