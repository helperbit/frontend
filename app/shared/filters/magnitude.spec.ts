import { MagnitudePipe } from './magnitude';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslateService } from '../helpers/mocks';


describe('MagnitudePipe', () => {
	const pipe = new MagnitudePipe(new MockTranslateService() as any);

	it('should return valid value for earthquake', async () => {
		expect(pipe.transform(7, 'earthquake'))
			.toBe('7 Richter');
		expect(pipe.transform(8, 'earthquake'))
			.toBe('8 Richter');
		expect(pipe.transform(9, 'earthquake'))
			.toBe('9 Richter');
	});


	it('should return valid value for flood', async () => {
		expect(pipe.transform(7, 'flood'))
			.toBe('Strong Flood');
		expect(pipe.transform(8.5, 'flood'))
			.toBe('Very Strong Flood');
		expect(pipe.transform(9, 'flood'))
			.toBe('Extreme Flood');
		expect(pipe.transform(1, 'flood'))
			.toBe('Flood');
	});

	it('should return valid value for wildfire', async () => {
		expect(pipe.transform(7, 'wildfire'))
			.toBe('Wildfire');
		expect(pipe.transform(8.5, 'wildfire'))
			.toBe('Widespread Wildfire');
		expect(pipe.transform(9.5, 'wildfire'))
			.toBe('Very Widespread Wildfire');
		expect(pipe.transform(4, 'wildfire'))
			.toBe('Wildfire');
	});

	it('should return valid value for unknown type', async () => {
		expect(pipe.transform(7, 'nonzo'))
			.toBe('7');
	});
});
