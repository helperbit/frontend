import { CountryPipe } from './country';
import { UtilsService } from 'app/services/utils';

class MockUtilsService {
	getCountryOfISO(isocode, what?: 'name' | 'string' | 'flag') {
		if (!what) what = 'name';

		switch (what) {
			case 'name': {
				if (typeof(isocode) == 'object')
					return isocode[0];
				else
					return isocode;
			}
			case 'string': return isocode;
			case 'flag': return isocode + '.png'
		}
	}
}

describe('CountryPipe', () => {
	const pipe = new CountryPipe(new MockUtilsService as UtilsService);

	it('should return name from array', () => {
		expect(pipe.transform(['ITA'], 'name')).toBe('ITA');
	});

	it('should return name', () => {
		expect(pipe.transform(['ITA'], 'name')).toBe('ITA');
	});

	it('should return string', () => {
		expect(pipe.transform('ITA', 'string')).toBe('ITA');
	});

	it('should return flag image', () => {
		expect(pipe.transform('ITA', 'flag')).toBe('ITA.png');
	});
});
