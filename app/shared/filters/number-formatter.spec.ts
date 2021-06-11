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

import { NumberFormatterPipe } from './number-formatter';

describe('NumberFormatterPipe', () => {
	const pipe = new NumberFormatterPipe();

	it('should transform 10000 in 10 000', async () => {
		expect(pipe.transform('10000')).toBe('10 000');
	});

	it('should transform 10000000 in 10 000 000', async () => {
		expect(pipe.transform('10000000')).toBe('10 000 000');
	});

	it('should transform 10000000.12 in 10 000 000.12', async () => {
		expect(pipe.transform('10000000.12')).toBe('10 000 000.12');
	});
});
