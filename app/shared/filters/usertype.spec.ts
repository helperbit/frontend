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

import { UsertypePipe } from "./usertype";
import { TranslateService } from '@ngx-translate/core';
import { MockTranslateService } from '../helpers/mocks';


describe('UsertypePipe', () => {
	const pipe = new UsertypePipe(new MockTranslateService() as any);

	it('should return a valid type string', async () => {
		expect(pipe.transform('npo')).toBe('non-profit organization');
		expect(pipe.transform('npo', 'short')).toBe('npo');
		expect(pipe.transform('singleuser')).toBe('user');
		expect(pipe.transform({ username: 'mondingo', usertype: 'npo', subtype: 'none' })).toBe('non-profit organization');
		expect(pipe.transform({ username: 'mondingo', usertype: 'npo', subtype: 'none' }, 'short')).toBe('npo');
		expect(pipe.transform({ username: 'mondingo', usertype: 'singleuser', subtype: 'none' })).toBe('user');
	});
});
