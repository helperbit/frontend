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
