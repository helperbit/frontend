import { SeourlPipe } from "./seourl";
import { UtilsService } from 'app/services/utils';

class MockUtilsService {
	getSString(data: object | string) {
		if (typeof(data) == 'string')
			return data;
		return data['en'];
	}

	getCountryOfISO(iso: string) {
		return iso;
	}
}

describe('SeourlPipe', () => {
	const pipe = new SeourlPipe(new MockUtilsService as UtilsService);

	it('should convert project to seourl', async () => {
		expect(pipe.transform(({ _id: '1234', title: { en: 'ciao mondo'} } as any), 'project'))
			.toBe('/project/1234/ciao-mondo');
	});

	it('should convert event to seourl', async () => {
		expect(pipe.transform(({ _id: '1234', type: 'earthquake', affectedcountries: ['ITA'] } as any), 'event'))
			.toBe('/event/1234/earthquake-in-ita');
	});

	it('should convert event to seourl with sub', async () => {
		expect(pipe.transform(({ _id: '1234', type: 'earthquake', affectedcountries: ['ITA'] } as any), 'event', '/donate'))
			.toBe('/event/1234/earthquake-in-ita/donate');
	});
});
