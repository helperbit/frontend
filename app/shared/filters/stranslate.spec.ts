import { StranslatePipe } from "./stranslate";
import { UtilsService } from 'app/services/utils';

class MockUtilsService {
	getSString(data: object | string) {
		if (typeof(data) == 'string')
			return data;
		return data['en'];
	}
}

describe('StranslatePipe', () => {
	const pipe = new StranslatePipe((new MockUtilsService() as UtilsService));

	it('should return the correct string from object', async () => {
		expect(pipe.transform({ en: 'ciao mondo' }))
			.toBe('ciao mondo');
	});

	it('should return the correct string from string', async () => {
		expect(pipe.transform('ciao mondo'))
			.toBe('ciao mondo');
	});
});
