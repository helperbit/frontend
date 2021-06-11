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

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'textLimit' })
export class TextLimitPipe implements PipeTransform {
	constructor() { }

	transform(text: string, limit: number) {
		if(typeof(text) == 'undefined' || !text)
			return '';
		else if(text.length <= limit)
			return text;
		else {
			const arr = [' ', ',', '.', '!', '?', ':', ';', '_', '-', '+', '*', '/'];

			if(arr.indexOf(text.charAt(limit+1))>-1)
				return text.slice(0, limit+1)+'...';
			else {
				let i = limit;
				while(arr.indexOf(text.charAt(i))==-1 && i>=0)
					i--;

				if(i==0)
					return text.slice(0, limit);
				else
					return (text.charAt(i) == ' ') ? text.slice(0, i)+'...' : text.slice(0, i+1)+'...';
			}
		}
	}
}