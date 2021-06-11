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

import { Table } from "./table";
import { triggerDigest } from "app/shared/helpers/utils";
import { BrowserHelperService } from "app/services/browser-helper";
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from 'app/services/utils';

export class TableStatic<T> extends Table<T> {
	resultsFiltered: any[];
	resultsVisible: any[];

	filterByTextHandler: (results: any[], text: string) => any[];
	sortHandler: (results: any[], sort: { sort: string; sortBy: string }) => any[];

	constructor(translate: TranslateService, utilsService: UtilsService, browserHelperService: BrowserHelperService, multipleFilter: boolean = false) {
		super(translate, utilsService, browserHelperService, multipleFilter);

		this.resultsFiltered = [];
		this.resultsVisible = [];
	}

	setPaginationOptions(): void {
		this.setPaginationOptionsInner(this.resultsFiltered.length);
	}

	limitResults($event?: any): void {
		setTimeout(() => this.changePage(this.pagination.currentPage), 0);
	}

	changePage(page: number): void {
		this.pagination.currentPage = page;
		const from = (this.pagination.currentPage - 1) * this.pagination.resultPerPage;
		let to = from + this.pagination.resultPerPage;

		if (to > this.resultsFiltered.length - 1)
			to = this.resultsFiltered.length;

		this.resultsVisible = this.resultsFiltered.slice(from, to);
	}

	setFilterByTextHandler(fbt: (results: any[], text: string) => any[]): void {
		this.filterByTextHandler = fbt;
	}

	setSortHandler(sh: (results: any[], sort: { sort: string; sortBy: string }) => any[]): void {
		this.sortHandler = sh;
	}

	updateData(settings: any = {}): void {
		if (this.browserHelperService.currentResolution == 'xs')
			this.pagination.resultPerPage += this.pagination.resultPerPageDefault;

		const sort = (results: any[]): any => {
			if (settings.sort) {
				delete settings.sort['$$hashKey'];
				this.activeSort = settings.sort;
			}

			return this.sortHandler(results, this.activeSort);
		};

		const update = (results: any[]) => {
			let resultsFiltered = results;

			//2 - FILTER BY TEXT
			resultsFiltered = this.filterByTextHandler(resultsFiltered, this.textFilter);

			//3 - SORT
			resultsFiltered = sort(resultsFiltered);

			this.resultsFiltered = resultsFiltered;

			//to recalculate pages available
			this.pagination = { ...this.pagination, ...{ items: this.resultsFiltered } };

			//4 - PAGINATION
			this.setPaginationOptions();

			//5 - RESULT PER PAGE
			this.changePage(this.pagination.currentPage);

			triggerDigest();
		};

		if (!settings.newHttpRequest)
			this.activeFilter.oldValue = this.activeFilter.newValue;

		//devo filtrare i valori disponibili con i filtri impostati (temporale, testo, asc/desc)
		//i valori filtrati subiranno una paginazione e un limite di risultati per pagina

		if (this.filterOptions.length > 0 && this.isOptionChanged()) {
			//1 - FILTER BY TIME
			this.updateDataHandler(this.activeFilter.newValue).then((res) => {
				this.results = res;
				update(this.results);
			}).catch((res) => { });

			if (this.activeFilter.oldValue == null)
				this.activeFilter.oldValue = this.activeFilter.newValue;
		}
		else if (this.filterOptions.length == 0) {
			this.updateDataHandler().then(res => {
				this.results = res;
				update(this.results);
			}).catch((res) => { });
		}
		else {
			update(this.results);
		}
	}
}
