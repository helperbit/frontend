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
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'magnitude' })
export class MagnitudePipe implements PipeTransform {
	constructor(private translate: TranslateService) { }

	transform(value: number, etype: string) {
		if (etype === undefined || etype == 'earthquake')
			return value + ' ' + this.translate.instant("Richter");
		else if (etype == 'flood') {
			if (value<=6.0) return this.translate.instant("Flood");
			else if (value>=6.0 && value<7.0) return this.translate.instant("Moderate Flood");
			else if (value>=7.0 && value<8.0) return this.translate.instant("Strong Flood");
			else if (value>=8.0 && value<9.0) return this.translate.instant("Very Strong Flood");
			else if (value>=9.0) return this.translate.instant("Extreme Flood");
		}
		else if (etype == 'wildfire') {
			if (value<=6.0) return this.translate.instant("Wildfire");
			else if (value>=6.0 && value<7.0) return this.translate.instant("Wildfire");
			else if (value>=7.0 && value<8.0) return this.translate.instant("Wildfire");
			else if (value>=8.0 && value<9.0) return this.translate.instant("Widespread Wildfire");
			else if (value>=9.0) return this.translate.instant("Very Widespread Wildfire");
		} 
		else return String(value);
	}
}