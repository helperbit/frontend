/* 
 *  Helperbit: a p2p donation platform (frontend)
 *  Copyright (C) 2016-2021  Davide Gessa (gessadavide@gmail.com)
 *  Copyright (C) 2016-2021  Helperbit team
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

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
