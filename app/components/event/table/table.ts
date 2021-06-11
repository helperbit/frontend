import { Component, OnInit } from '@angular/core';
import { isEmpty } from '../../../shared/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import { ArticleService } from '../../../services/article';
import { BrowserHelperService } from '../../../services/browser-helper';
import { TableDynamic } from '../../../shared/helpers/table-dynamic';
import { EventService, Event } from '../../../models/event';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'app/services/utils';
import AppSettings from 'app/app.settings';

interface EventTableParams {
	populated?: boolean;
	country?: string;
	page?: string;
	sort?: string;
	types?: string;
}

@Component({
	selector: 'event-table-component',
	templateUrl: 'table.html',
	styleUrls: ['../../../sass/main/custom/tools-page-template.scss', 'table.scss']
})
export class EventTableComponent implements OnInit {
	table: TableDynamic<Event>;

	constructor(
		private route: ActivatedRoute,
		private eventService: EventService,
		translate: TranslateService,
		articleService: ArticleService,
		browserHelperService: BrowserHelperService,
		utilsService: UtilsService,
	) {
		this.table = new TableDynamic(translate, utilsService, browserHelperService, true);

		this.table.addSortOptions(translate.instant('Magnitude'), 'earthquakes.magnitude');
		this.table.addSortOptions(translate.instant('Affected Population'), 'population.affected');
		this.table.addSortOptions(translate.instant('Donation'), 'donationsvolume');
		this.table.addSortOptions(translate.instant('Date'), 'earthquakes.date');

		const eventTypes = {
			'earthquake': {
				name: translate.instant('Earthquake'),
				iconId: 'earthquake',
				src: AppSettings.baseUrl + '/media/event-types/svg/earthquake.svg'
			},
			'flood': {
				name: translate.instant('Flood'),
				iconId: 'flooded-house',
				src: AppSettings.baseUrl + '/media/event-types/svg/flooded-house.svg'
			},
			'wildfire': {
				name: translate.instant('Wildfire'),
				iconId: 'forest-fire',
				src: AppSettings.baseUrl + '/media/event-types/svg/forest-fire.svg'
			},
			'tsunami': {
				name: translate.instant('Tsunami'),
				iconId: 'tsunami',
				src: AppSettings.baseUrl + '/media/event-types/svg/tsunami.svg'
			},
			'eruption': {
				name: translate.instant('Eruption'),
				iconId: 'volcano',
				src: AppSettings.baseUrl + '/media/event-types/svg/volcano.svg'
			},
			'slide': {
				name: translate.instant('Slide'),
				iconId: 'avalanche',
				src: AppSettings.baseUrl + '/media/event-types/svg/avalanche.svg'
			},
			'hurricane': {
				name: translate.instant('Hurricane'),
				iconId: 'tornado',
				src: AppSettings.baseUrl + '/media/event-types/svg/tornado.svg'
			},
			'drought': {
				name: translate.instant('Drought'),
				iconId: 'drought',
				src: AppSettings.baseUrl + '/media/event-types/svg/drought.svg'
			},
			'populated-events': {
				name: translate.instant('Populated Events'),
				iconId: 'user-experience',
				src: AppSettings.baseUrl + '/media/event-types/svg/user-experience.svg'
			}
		};

		for (const key in eventTypes)
			this.table.addFilterOptions(eventTypes[key].name, key, eventTypes[key],
				this.table.activeFilters.newValue.indexOf(key) != -1,
				key != 'earthquake' && key != 'flood' && key != 'populated-events',
				key == 'flood' ? 'beta' : null)

		this.table.addColumn('countries', translate.instant('Affected Countries'), browserHelperService.currentResolution == 'sm' ? 25 : 20, {
			asc: { show: () => false },
			desc: { show: () => false },
			ascDesc: { show: () => false }
		}, 'text-center');

		this.table.addColumn('magnitude', translate.instant('Magnitude'), browserHelperService.currentResolution == 'sm' ? 25 : 17.5, {
			asc: {
				value: { sortBy: 'earthquakes.magnitude', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'earthquakes.magnitude' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'earthquakes.magnitude', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'earthquakes.magnitude' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'earthquakes.magnitude', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'earthquakes.magnitude'
			}
		}, 'text-center');

		this.table.addColumn('population', translate.instant('Affected Population'), 20, {
			asc: {
				value: { sortBy: 'population.affected', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'population.affected' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'population.affected', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'population.affected' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'population.affected', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'population.affected'
			}
		}, 'text-center hidden-sm');

		this.table.addColumn('donation', translate.instant('Donation'), 17.5, {
			asc: {
				value: { sortBy: 'donationsvolume', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'donationsvolume' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'donationsvolume', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'donationsvolume' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'donationsvolume', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'donationsvolume'
			}
		}, 'text-center hidden-sm');

		this.table.addColumn('date', translate.instant('Date'), browserHelperService.currentResolution == 'sm' ? 25 : 12.5, {
			asc: {
				value: { sortBy: 'earthquakes.date', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'earthquakes.date' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'earthquakes.date', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'earthquakes.date' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'earthquakes.date', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'earthquakes.date'
			}
		}, 'text-center');

		this.table.addColumn('gotoevent', '', browserHelperService.currentResolution == 'sm' ? 25 : 12.5, {
			asc: { show: () => false },
			desc: { show: () => false },
			ascDesc: { show: () => false }
		}, 'text-center');

		this.table.addVisualizationButton('grid', 'th-large', translate.instant('Grid visualization'));
		this.table.addVisualizationButton('table', 'th-list', translate.instant('Table visualization'), true);

		this.table.setScrollableAreas([
			{ visualizationButton: 'grid', id: 'visualizationGrid' },
			{ visualizationButton: 'table', id: 'visualizationTable' },
		]);

		this.table.setUpdateDataHandler(() => {
			return new Promise((resolve, reject) => {
				//SET QUERY
				const query: {
					page: number;
					sort: string;
					orderby: string;
					limit: number;
					country?: string;
					types?: string[];
					populated?: boolean;
				} = {
					page: this.table.pagination.currentPage - 1,
					sort: this.table.activeSort.sort,
					orderby: this.table.activeSort.sortBy,
					limit: this.table.pagination.resultPerPage
				};

				if (!isEmpty(this.table.textFilter))
					query.country = this.table.textFilter.value;

				if (this.table.activeFilters.newValue.length > 0) {
					const populatedIndex = this.table.activeFilters.newValue.indexOf('populated-events');
					if (populatedIndex != -1)
						query.populated = true;

					const types = this.table.activeFilters.newValue.slice(0, populatedIndex).concat(this.table.activeFilters.newValue.slice(populatedIndex + 1, this.table.activeFilters.newValue.length));

					if (types.length > 0)
						query.types = types;
				}

				this.eventService.getList(query).subscribe(events => {
					this.table.results = events.list;

					const acodes = [];
					for (let i = 0; i < this.table.results.length; i++) {
						const item = this.table.results[i];

						const res = articleService.generateEventArticle(item);
						acodes.push(res.template);
						item.article = res;
					}

					//to recalculate pages available
					this.table.pagination.itemsCount = events.count;

					while (events.count < (this.table.pagination.resultPerPage / 2) && this.table.pagination.resultPerPage > 12)
						this.table.pagination.resultPerPage /= 2;

					if (this.table.pagination.toRecalculate) {
						this.table.pagination.toRecalculate = false;
						this.table.setPaginationOptions();
					}

					this.table.pagination = { ...this.table.pagination };
					resolve();
				});
			});
		});
	}

	//set first query default values
	private setDefaultQuery() {
		//SORT
		const sort = this.table.sortOptions.filter(s => s.sortBy == 'earthquakes.date' && s.sort == 'desc')[0];

		this.table.activeSort = sort;

		//LIMIT
		this.table.pagination = { ...this.table.pagination, ...{ resultPerPage: 12 } };
	}

	//TODO
	//set first query by parameters values
	private setQueryByParams() {
		if (this.route.snapshot.queryParamMap.has('page'))
			this.table.pagination.currentPage = parseInt(this.route.snapshot.queryParamMap.get('page')) - 1;

		if (this.route.snapshot.queryParamMap.has('orderby')) {
			const sort = this.table.sortOptions.filter(s => s.sortBy == this.route.snapshot.queryParamMap.get('sort') && s.sort == 'asc');

			if (sort.length == 1) {
				this.table.activeSort = sort[0];
			}
		}

		if (this.route.snapshot.queryParamMap.has('sort')) {
			const sort = this.table.sortOptions.filter(s => s.sortBy == this.route.snapshot.queryParamMap.get('sort') && s.sort == 'asc');

			if (sort.length == 1) {
				this.table.activeSort = sort[0];
			}
		}

		if (this.route.snapshot.queryParamMap.has('types')) {
			const eventTypes = this.route.snapshot.queryParamMap.get('types').split('|');

			eventTypes.forEach(type => {
				if (eventTypes[type])
					this.table.activeFilters.newValue.push(type);
			});
		}

		if (this.route.snapshot.queryParamMap.has('populated'))
			this.table.activeFilters.newValue.push('populated-events');

		// if (this.route.snapshot.queryParamMap.has('country')) {
		// 	const country = this.route.snapshot.queryParamMap.get('country');
		// 	if (countryDict[country] !== undefined)
		// 		this.table.textFilter = { label: countryDict[country], value: country };
		// }
	}

	ngOnInit() {
		this.setDefaultQuery();
		this.setQueryByParams();
		this.table.pagination.toRecalculate = true;
		this.table.updateData();
	}
}
