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

import * as $ from 'jquery';
import { TableStatic } from '../../../shared/helpers/table-static';
import { ModalsConfig } from '../../../shared/components/modal/oldModal/modal';
import { TranslateService } from '@ngx-translate/core';
import { StatsService, TopAmbassador } from '../../../models/stats';
import { getSessionStorage } from '../../../shared/helpers/utils';
import { BrowserHelperService } from '../../../services/browser-helper';
import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'app/services/utils';
import { timeEntriesData } from '../stats.utils';

@Component({
	selector: 'top-ambassadors-component',
	templateUrl: 'top-ambassadors.html',
	styleUrls: ['../../../sass/main/custom/tools-page-template.scss', 'top-ambassadors.scss']
})
export class TopAmbassadorsComponent implements OnInit {
	table: TableStatic<TopAmbassador>;
	lang: string;
	modals: ModalsConfig;
	isBannerOpen: boolean;

	constructor(
		statsService: StatsService,
		translate: TranslateService,
		utilsService: UtilsService,
		browserHelperService: BrowserHelperService
	) {
		this.lang = translate.currentLang;
		// this.modals = {
		// 	merchandaising: {
		// 		id: 'merchandaisingModal',
		// 		modalClass: 'modal-lg',
		// 		hideCloseButton: true,
		// 		title: translate.instant('Amazing prizes!')
		// 	}
		// };
		this.isBannerOpen = true;

		this.table = new TableStatic(translate, utilsService, browserHelperService);

		this.table.addSortOptions(translate.instant('Username'), 'user');
		this.table.addSortOptions(translate.instant('Invited friends'), 'count', true);

		const timeEntries = timeEntriesData(translate);

		for (const key in timeEntries)
			this.table.addFilterOptions(timeEntries[key].name, key, timeEntries[key], key == 'ever');

		this.table.addColumn('user', translate.instant('Username'), 50, {
			asc: {
				value: { sortBy: 'user', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'user' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'user', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'user' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'user', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'user'
			}
		});
		this.table.addColumn('count', translate.instant('Invited Friends'), 50, {
			asc: {
				value: { sortBy: 'count', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'count' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'count', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'count' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'count', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'count'
			}
		});

		this.table.addVisualizationButton('grid', 'th-large', translate.instant('Grid visualization'), true);
		this.table.addVisualizationButton('table', 'th-list', translate.instant('Table visualization'));

		this.table.setScrollableAreas([
			{ visualizationButton: 'grid', id: 'visualizationGrid' },
			{ visualizationButton: 'table', id: 'visualizationTable' },
		]);

		this.table.setFilterByTextHandler((ambassadors, text) => {
			if (text && text.length > 0)
				return ambassadors.filter(ambassador => ambassador.user.toLowerCase().search(text.toLowerCase()) != -1);
			else
				return ambassadors;
		});

		this.table.setSortHandler((ambassadors, sort) => {
			switch (sort.sortBy) {
				case 'user': {
					if (sort.sort == 'asc')
						ambassadors.sort((a1, a2) => a1.user.localeCompare(a2.user));
					else
						ambassadors.sort((a1, a2) => -a1.user.localeCompare(a2.user));
					break;
				}
				case 'count': {
					if (sort.sort == 'asc')
						ambassadors.sort((a1, a2) => a1.count - a2.count);
					else
						ambassadors.sort((a1, a2) => -(a1.count - a2.count));
					break;
				}
			}

			return ambassadors;
		});

		this.table.setUpdateDataHandler(filter => {
			return new Promise((resolve, reject) => {
				statsService.getTopAmbassadors(filter).subscribe(topambassadors => {
					return resolve(topambassadors);
				}, reject);
			});
		});
	}

	ngOnInit() {
		const sessionStorage = getSessionStorage();
		this.table.updateData({ newHttpRequest: true });

		if (!sessionStorage.getItem('topAmbassadorMerchandaisingModal')) {
			sessionStorage.setItem('topAmbassadorMerchandaisingModal', 'true');

			$('#' + this.modals.merchandaising.id).ready(() => {
				setTimeout(() => { $('#' + this.modals.merchandaising.id).modal('show'); }, 0);
			});
		}
	}
}