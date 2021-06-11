import { KeysPipe } from './ngForKeys';

describe('KeysPipe', () => {
	const pipe = new KeysPipe();

	it('should transform an object to keys', async () => {
		expect(pipe.transform({ciao: 'mondo', bingo: 'bongo'})).toEqual(['ciao', 'bingo']);
	});
});
