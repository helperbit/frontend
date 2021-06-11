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

import { OrdinalPipe } from './ordinal';

describe('OrdinalPipe', () => {
	const pipe = new OrdinalPipe();

	it('should transform 1 to 1st', async () => {
		expect(pipe.transform(1)).toBe('1st');
	});

	it('should transform 12 to 12th', async () => {
		expect(pipe.transform(12)).toBe('12th');
	});

	it('should transform 22 to 22nd', async () => {
		expect(pipe.transform(22)).toBe('22nd');
	});

	it('should transform 33 to 33rd', async () => {
		expect(pipe.transform(33)).toBe('33rd');
	});

	it('should transform 3198 to 3198th', async () => {
		expect(pipe.transform(3198)).toBe('3198th');
	});
});
