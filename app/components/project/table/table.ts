import { TranslateService } from '@ngx-translate/core';
import { BrowserHelperService } from '../../../services/browser-helper';
import { UtilsService } from '../../../services/utils';
import { TableDynamic } from '../../../shared/helpers/table-dynamic';
import { ProjectService, Project } from '../../../models/project';
import { ProgressBarConfig } from '../../../shared/components/progress-bar/progress-bar';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'project-table-component',
	templateUrl: 'table.html',
	styleUrls: ['../../../sass/main/custom/tools-page-template.scss', 'table.scss']
})
export class ProjectTableComponent implements OnInit {
	table: TableDynamic<Project>;

	constructor(
		private route: ActivatedRoute,
		translate: TranslateService, 
		browserHelperService: BrowserHelperService, 
		utilsService: UtilsService, 
		private projectService: ProjectService
	) {
		this.table = new TableDynamic(translate, utilsService, browserHelperService, true);
		this.table.results = [];

		this.table.addSortOptions(translate.instant('Project Title'), 'title');
		this.table.addSortOptions(translate.instant('Organization'), 'owner');
		this.table.addSortOptions(translate.instant('Start'), 'start');
		this.table.addSortOptions(translate.instant('Donation Received'), 'received');
		this.table.addSortOptions(translate.instant('Total Supporters'), 'receiveddonations');

		const tags = utilsService.tags();

		for (const key in tags)
			this.table.addFilterOptions(tags[key].name, key, tags[key])

		this.table.addColumn('title', translate.instant('Project Title'), browserHelperService.currentResolution == 'sm' ? 27.5 : 24, {
			asc: {
				value: { sortBy: 'title', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'title' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'title', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'title' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'title', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'title'
			}
		});

		this.table.addColumn('owner', translate.instant('Organization'), browserHelperService.currentResolution == 'sm' ? 17.5 : 14, {
			asc: {
				value: { sortBy: 'owner', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'owner' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'owner', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'owner' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'owner', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'owner'
			}
		}, 'text-center');

		this.table.addColumn('countries', translate.instant('Countries'), 14, {
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

		this.table.addColumn('start', translate.instant('Start'), 14, {
			asc: {
				value: { sortBy: 'start', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'start' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'start', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'start' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'start', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'start'
			}
		}, 'text-center hidden-sm');

		this.table.addColumn('donations', translate.instant('Donations'), browserHelperService.currentResolution == 'sm' ? 30 : 17.5, {
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

		this.table.addColumn('supporters', translate.instant('Supporters'), 9, {
			asc: {
				value: { sortBy: 'receiveddonations', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'receiveddonations' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'receiveddonations', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'receiveddonations' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'receiveddonations', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'receiveddonations'
			}
		}, 'text-center hidden-sm');

		this.table.addColumn('gotoproject', '', browserHelperService.currentResolution == 'sm' ? 25 : 12.5, {
			asc: {
				show: () => false
			},
			desc: {
				show: () => false
			},
			ascDesc: {
				show: () => false
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
				const query: {
					page: number;
					sort: string;
					orderby: string;
					limit: number;
					title?: string;
					tags?: string[];
				} = {
					page: this.table.pagination.currentPage - 1,
					sort: this.table.activeSort.sort,
					orderby: this.table.activeSort.sortBy,
					limit: this.table.pagination.resultPerPage
				};

				if (this.table.textFilter && this.table.textFilter.length > 0)
					query.title = this.table.textFilter;

				if (this.table.activeFilters.newValue.length > 0)
					query.tags = this.table.activeFilters.newValue;

				this.projectService.getList(query).subscribe(data => {
					data.list.forEach((project: Project & { progressBarConfig: ProgressBarConfig }) => {
						project.progressBarConfig = this.projectService.createProgressBarConfig(project)
					});

					this.table.setDataResults(data.list, data.count);
					resolve();
				});
			});
		});
	}

	ngOnInit() {
		this.table.setDefaultQuery('start', 'desc');
		this.table.setBaseQueryByParams(this.route.snapshot.queryParamMap);
		this.table.pagination.toRecalculate = true;
		this.table.updateData();
	}
}