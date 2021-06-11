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

import { newlineToBr, getMimeTypesFromExtensions, formatUrl } from "./utils";

describe('Utils Helper - newlineToBr', () => {
	it('should convert newline to br', () => {
		expect(newlineToBr('ciao\nmondo')).toBe('ciao<br>mondo');
	});
	it('should convert undefined to empty string', () => {
		expect(newlineToBr(undefined)).toBe('');
	});
});

describe('Utils Helper - getMimeTypesFromExtensions', () => {
	it('should convert extension to mimetype', () => {
		expect(getMimeTypesFromExtensions(['png'])).toEqual(['image/png']);
	});
});

describe('Utils Helper - formatUrl', () => {
	it('should format url', () => {
		expect(formatUrl('www.google.it')).toEqual('http://www.google.it');
		expect(formatUrl('https://www.google.it')).toEqual('https://www.google.it');
	});
});