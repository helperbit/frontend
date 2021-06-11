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
import { UtilsService } from "app/services/utils";
import { BrowserHelperService } from "app/services/browser-helper";
import { ParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

export class TableDynamic<T> extends Table<T> {
	constructor(translate: TranslateService, utilsService: UtilsService, browserHelperService: BrowserHelperService, multipleFilter: boolean = false) {
		super(translate, utilsService, browserHelperService, multipleFilter);
	}

	setPaginationOptions(): void {
		this.setPaginationOptionsInner(this.pagination.itemsCount);
	}

	setBaseQueryByParams(paramMap: ParamMap) {
		if(paramMap.has('page'))
			this.pagination.currentPage = parseInt(paramMap.get('page')) - 1;

		if(paramMap.has('orderby') || paramMap.has('sort')){
			const sort = this.sortOptions.filter(s => s.sortBy == paramMap.get('sort') && s.sort == 'asc');

			if (sort.length == 1) {
				this.activeSort = sort[0];
			}
		}
	}

	setDefaultQuery(orderBy, sortTo) {
		//SORT
		const sort = this.sortOptions.filter(s => s.sortBy == orderBy && s.sort == sortTo)[0];

		this.activeSort = sort;

		//LIMIT
		this.pagination = { ...this.pagination, ...{ resultPerPage: 12 } };
	}

	setDataResults(list: any[], count: number) {
		this.results = list;

		//to recalculate pages available
		this.pagination.itemsCount = count;

		while (count < (this.pagination.resultPerPage / 2) && this.pagination.resultPerPage > 12)
			this.pagination.resultPerPage /= 2;

		if (this.pagination.toRecalculate)
			this.setPaginationOptions();

		this.pagination = { ...this.pagination };
	}

	changePage(page: number): void {
		this.pagination.currentPage = page;
		this.pagination.toRecalculate = false;
		this.updateData();
	}
	//when result per page are changed
	limitResults($event?: any): void {
		setTimeout(() => {
			this.pagination.toRecalculate = false;
			this.updateData();
		}, 0);
	}

	//update the tags array values filter
	optionChange(option) {
		this.changeOption(option);
		this.pagination.toRecalculate = true;
		this.updateData();
	}

	//when text in search bar change
	filterByText() {
		this.pagination.toRecalculate = true;
		this.updateData();
	}

	//when an order element is clicked
	sortResults(sort?: any) {
		this.pagination.toRecalculate = false;

		if (typeof (sort) == 'object') {
			delete sort['$$hashKey'];
			this.activeSort = sort;
		}

		this.updateData();
	}

	updateData(): void {
		if (this.browserHelperService.currentResolution == 'xs')
			this.pagination.resultPerPage += this.pagination.resultPerPageDefault;

		this.updateDataHandler().then(() => { }).catch(() => { });
	}
}
