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
