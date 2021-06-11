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

import { EventEmitter, Output, Component, Input } from '@angular/core';
import { TableDynamic } from 'app/shared/helpers/table-dynamic';
import { Observable } from 'rxjs';
import { distinctUntilChanged,debounceTime,map } from 'rxjs/operators';

const countryDict = require('../../../../assets/data/country.json');

@Component({
	selector: 'country-filter',
	templateUrl: 'country-filter.html',
	styleUrls: ['country-filter.scss']
})
export class CountryFilterComponent {
	@Input() table: TableDynamic<any>;
	@Output() change: EventEmitter<number> = new EventEmitter();

	countryFilter = '';

	constructor() { }


	formatter(r: { label: string; value: string }) {
		return r.label;
	}

	do(evn) {
		if(!evn) {
			this.table.textFilter = null;
			this.countryFilter = '';
			this.table.updateData();
		} else {
			this.table.textFilter = evn.item;
			this.table.filterByText();
		}
	}

	search(text$: Observable<string>) {
		const autocompleteCountries: { label: string; value: string }[] = [];
		for (const countryKey in countryDict) {
			autocompleteCountries.push({ label: countryDict[countryKey], value: countryKey });
		}

		return text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map(term => term.length < 2 ? []
				: autocompleteCountries.filter(v => v.label.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
		)
	}
}
