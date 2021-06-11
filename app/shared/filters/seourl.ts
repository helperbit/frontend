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

import { UtilsService } from "../../services/utils";
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'seourl' })
export class SeourlPipe implements PipeTransform {
	constructor(private utilsService: UtilsService) { }

	transform(ob: any, type: 'event' | 'project', sub?: string) {
		const toSeo = (text: string): string => text.replace(/[^\w\s]/gi, '').replace(/_/g, '').replace(/ /g, '-').toLowerCase();

		if (ob === null || ob === undefined) return '';
		else {
			switch (type) {
				case 'event':
					return '/event/' + ob._id + '/'
						+ this.utilsService.getSString(ob.type) + '-in-'
						+ toSeo(this.utilsService.getCountryOfISO(ob.affectedcountries[0]))
						+ (sub || '');
				case 'project':
					return '/project/' + ob._id + '/'
						+ toSeo(this.utilsService.getSString(ob.title))
						+ (sub || '');
			}
		}
	}
}