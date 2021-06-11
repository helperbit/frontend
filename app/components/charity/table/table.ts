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

import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils';
import { BrowserHelperService } from '../../../services/browser-helper';
import { TranslateService } from '@ngx-translate/core';
import { TableDynamic } from '../../../shared/helpers/table-dynamic';
import { UserService, User } from '../../../models/user';
import { PaginationQuery } from '../../../models/common';
import { ActivatedRoute } from '@angular/router';


@Component({
	selector: 'charity-table-component',
	templateUrl: 'table.html',
	styleUrls: ['../../../sass/main/custom/tools-page-template.scss', 'table.scss']
})
export class CharityTableComponent implements OnInit {
	table: TableDynamic<User>;

	constructor(
		private route: ActivatedRoute,
		private userService: UserService,
		browserHelperService: BrowserHelperService,
		private translate: TranslateService,
		private utilsService: UtilsService,
	) {
		this.table = new TableDynamic(translate, utilsService, browserHelperService);
		this.table.results = [];

		this.table.addSortOptions(translate.instant('Organization Name'), 'fullname');
		this.table.addSortOptions(translate.instant('Country'), 'country');
		// this.table.addSortOptions(translate.instant('Type'), 'type');
		this.table.addSortOptions(translate.instant('Operators'), 'operators');
		this.table.addSortOptions(translate.instant('Donations Volume'), 'received');

		this.table.addColumn('fullname', translate.instant('Organization Name'), browserHelperService.currentResolution == 'sm' ? 30 : 25, {
			asc: {
				value: { sortBy: 'fullname', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'fullname' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'fullname', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'fullname' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'fullname', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'fullname'
			}
		});

		this.table.addColumn('country', translate.instant('Country'), 15, {
			asc: {
				value: { sortBy: 'country', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'country' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'country', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'country' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'country', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'country'
			}
		}, 'text-center');

		this.table.addColumn('type', translate.instant('Type'), 10, {
			asc: {
				show: () => false
			},
			desc: {
				show: () => false
			},
			ascDesc: {
				show: () => false
			}
		}, 'text-center text-capitalize');

		this.table.addColumn('tags', translate.instant('Tags'), 10, {
			asc: {
				show: () => false
			},
			desc: {
				show: () => false
			},
			ascDesc: {
				show: () => false
			}
		}, 'text-center hidden-sm');

		this.table.addColumn('operators', translate.instant('Operators'), browserHelperService.currentResolution == 'sm' ? 20 : 15, {
			asc: {
				value: { sortBy: 'operators', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'operators' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'operators', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'operators' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'operators', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'operators'
			}
		}, 'text-center');

		this.table.addColumn('received', translate.instant('Donations Volume'), browserHelperService.currentResolution == 'sm' ? 25 : 20, {
			asc: {
				value: { sortBy: 'received', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'received' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'received', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'received' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'received', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'received'
			}
		}, 'text-center');

		this.table.addVisualizationButton('grid', 'th-large', translate.instant('Grid visualization'), true);
		this.table.addVisualizationButton('table', 'th-list', translate.instant('Table visualization'));

		this.table.setScrollableAreas([
			{ visualizationButton: 'grid', id: 'visualizationGrid' },
			{ visualizationButton: 'table', id: 'visualizationTable' },
		]);

		this.table.setUpdateDataHandler(() => {
			return new Promise((resolve, reject) => {
				//SET QUERY
				const query: PaginationQuery = {
					page: this.table.pagination.currentPage - 1,
					sort: this.table.activeSort.sort,
					orderby: this.table.activeSort.sortBy,
					limit: this.table.pagination.resultPerPage
				};

				if (this.table.textFilter && this.table.textFilter.length > 0)
					query.name = this.table.textFilter;

				this.userService.listOrganizations(query).subscribe(data => {
					this.table.setDataResults(data.list, data.count);
					resolve();
				});
			});
		});
	}

	formatOperators(v) {
		if (v == '2-10') return 1;
		if (v == '10-50') return 2;
		if (v == '50-250') return 3;
		if (v == '250-1000') return 4;
		if (v == '1000-5000') return 5;
		if (v == '5000+') return 6;
		return 1;
	}

	ngOnInit() {
		this.utilsService.setMeta(
			this.translate.instant('Charities that accept bitcoin and crypto donations'),
			this.translate.instant('An updated list of verified and trusted non-profit organizations that accept bitcoin, litecoin, ethereum, dash and others cryptocurrencies donations')
		);

		this.table.setDefaultQuery('received', 'desc');
		this.table.setBaseQueryByParams(this.route.snapshot.queryParamMap);
		this.table.pagination.toRecalculate = true;
		this.table.updateData();
	}
}