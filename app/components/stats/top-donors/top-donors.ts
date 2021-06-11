import { TableStatic } from '../../../shared/helpers/table-static';
import { TranslateService } from '@ngx-translate/core';
import { ModalsConfig } from '../../../shared/components/modal/oldModal/modal';
import { StatsService, TopDonor } from '../../../models/stats';
import { UtilsService } from '../../../services/utils';
import { BrowserHelperService } from '../../../services/browser-helper';
import { Component, OnInit } from '@angular/core';
import { timeEntriesData } from '../stats.utils';

@Component({
	selector: 'top-donors-component',
	templateUrl: 'top-donors.html',
	styleUrls: ['../../../sass/main/custom/tools-page-template.scss', 'top-donors.scss']
})
export class TopDonorsComponent implements OnInit {
	table: TableStatic<TopDonor>;
	modals: ModalsConfig;
	isBannerOpen: boolean;

	constructor(
		statsService: StatsService,
		translate: TranslateService,
		utilsService: UtilsService,
		browserHelperService: BrowserHelperService,
	) {
		this.modals = {
			merchandaising: {
				id: 'merchandaisingModal',
				modalClass: 'modal-lg',
				hideCloseButton: true,
				title: translate.instant('Amazing prizes!')
			}
		};
		this.isBannerOpen = true;

		this.table = new TableStatic(translate, utilsService, browserHelperService);

		this.table.addSortOptions(translate.instant('Donor'), 'user');
		this.table.addSortOptions(translate.instant('Country'), 'country');
		this.table.addSortOptions(translate.instant('Donations'), 'n');
		this.table.addSortOptions(translate.instant('Volume'), 'volume', true);

		const timeEntries = timeEntriesData(translate);

		for (const key in timeEntries)
			this.table.addFilterOptions(timeEntries[key].name, key, timeEntries[key], key == 'ever');

		this.table.addColumn('user', translate.instant('Donor'), 25, {
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

		this.table.addColumn('country', translate.instant('Country'), 25, {
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
		});

		this.table.addColumn('n', translate.instant('Donations'), 25, {
			asc: {
				value: { sortBy: 'n', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'n' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'n', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'n' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'n', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'n'
			}
		});

		this.table.addColumn('volume', translate.instant('Donations Volume'), 25, {
			asc: {
				value: { sortBy: 'volume', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'volume' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'volume', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'volume' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'volume', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'volume'
			}
		});

		this.table.addVisualizationButton('grid', 'th-large', translate.instant('Grid visualization'), true);
		this.table.addVisualizationButton('table', 'th-list', translate.instant('Table visualization'));

		this.table.setScrollableAreas([
			{ visualizationButton: 'grid', id: 'visualizationGrid' },
			{ visualizationButton: 'table', id: 'visualizationTable' },
		]);

		this.table.setUpdateDataHandler(filter => {
			return new Promise((resolve, reject) => {
				statsService.getTopDonors(filter).subscribe(topdonors => {
					return resolve(topdonors);
				}, reject);
			});
		});

		this.table.setFilterByTextHandler((donors, text) => {
			if (text && text.length > 0)
				return donors.filter(donor => donor.user && donor.user.toLowerCase().search(text.toLowerCase()) != -1);
			else
				return donors;
		});

		this.table.setSortHandler((donors, sort) => {
			switch (sort.sortBy) {
				case 'user': {
					if (sort.sort == 'asc')
						donors.sort((a1, a2) => a1.user ? a1.user.localeCompare(a2.user) : -1);
					else
						donors.sort((a1, a2) => a1.user ? -a1.user.localeCompare(a2.user) : -1);

					break;
				}
				case 'country': {
					if (sort.sort == 'asc')
						donors.sort((a1, a2) => a1.country ? a1.country.localeCompare(a2.country) : -1);
					else
						donors.sort((a1, a2) => a1.country ? -a1.country.localeCompare(a2.country) : -1);

					break;
				}
				case 'n': {
					if (sort.sort == 'asc')
						donors.sort((a1, a2) => a1.n - a2.n);
					else
						donors.sort((a1, a2) => -(a1.n - a2.n));

					break;
				}
				case 'volume': {
					if (sort.sort == 'asc')
						donors.sort((a1, a2) => a1.volume - a2.volume);
					else
						donors.sort((a1, a2) => -(a1.volume - a2.volume));

					break;
				}
			}

			return donors;
		});
	}

	ngOnInit() {
		this.table.updateData({ newHttpRequest: true });
	}
}
