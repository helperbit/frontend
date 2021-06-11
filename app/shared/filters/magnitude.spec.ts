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
