import { UtilsService } from 'app/services/utils';
import { BrowserHelperService } from 'app/services/browser-helper';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsGroupOption } from '../components/buttons-group/buttons-group';

interface SortOption {
	label: string;
	sortBy: string;
	sort: 'asc' | 'desc';
	show: boolean;
};

export abstract class Table<T> {
	sortOptions: SortOption[];
	sortOptionsDesc: SortOption[];
	sortOptionsAsc: SortOption[];
	activeSort: {
		sort: string;
		sortBy: string;
	};

	filterOptions: {
		text: string;
		value: string;
		icon: any;
		active?: boolean;
		disabled?: boolean;
		notify?: string;
	}[];
	textFilter: any; //was string, but could be string or {}
	activeFilter: { oldValue: any; newValue: any };
	activeFilters: { oldValue: any[]; newValue: any[] };

	columnsList: string[];
	columns: {
		[th: string]: {
			label: string;
			class: string;
			style: any;
			sort: any;
		};
	};
	visualizationButtons: {
		options: ButtonsGroupOption[];
	}
	selectedVisualizationButton: string;

	scrollableAreas: { visualizationButton: string; id: string }[];

	pagination: {
		items: any[];
		itemsCount: number;
		totalPages: number;
		maxPages: number;
		currentPage: number;
		options: any[];
		resultPerPage: number;
		resultPerPageDefault: number;
		toRecalculate: boolean;
	};

	results: T[];

	updateDataHandler: (filter?: any) => Promise<any>;

	constructor(
		protected translate: TranslateService, 
		protected utilsService: UtilsService, 
		protected browserHelperService: BrowserHelperService, 
		protected multipleFilter: boolean = false
	) {
		this.results = [];
		this.sortOptions = [];
		this.sortOptionsDesc = [];
		this.sortOptionsAsc = [];
		this.filterOptions = [];
		this.textFilter = null;
		this.activeFilter = { oldValue: null, newValue: null };
		this.activeFilters = { oldValue: [], newValue: [] };

		this.columns = {};
		this.columnsList = [];

		this.visualizationButtons = {
			options: []
		};
		this.selectedVisualizationButton = null;

		this.scrollableAreas = [];

		this.pagination = {
			items: [],
			itemsCount: 0,
			totalPages: 0,
			maxPages: 4,
			currentPage: 0,
			options: [],
			resultPerPage: 12,
			resultPerPageDefault: 12,
			toRecalculate: false
		};

		this.pagination.currentPage = 1;
	}

	changeOption(option): void {
		if (this.multipleFilter) {
			if (option.active) {
				this.activeFilters.oldValue = this.activeFilters.newValue;
				this.activeFilters.newValue.push(option.value);
			}
			else {
				this.activeFilters.oldValue = this.activeFilters.newValue;
				const index = this.activeFilters.newValue.indexOf(option.value);
				this.activeFilters.newValue.splice(index, 1);
			}
		}
		else {
			this.activeFilter.oldValue = this.activeFilter.newValue;
			this.activeFilter.newValue = option.value;
		}
	}

	isOptionChanged(): boolean { return this.activeFilter.oldValue != this.activeFilter.newValue }

	addVisualizationButton(value, icon, tooltip, selected = false): void {
		this.visualizationButtons.options.push({
			value: value,
			icon: icon,
			tooltip: tooltip,
			tooltipPosition: 'bottom'
		});

		if (selected)
			this.selectedVisualizationButton = value;
	}

	addSortOptions(label: string, sortBy: string, active = false, dir: 'asc' | 'desc' | 'both' = 'both', show = true): void {
		const so = {
			label: label,
			sortBy: sortBy,
			show: show,
			sort: dir != 'both' ? dir : 'asc'
		};

		this.sortOptions.push(so);
		const sodesc = { ...so };

		if (dir == 'both') {
			sodesc.sort = 'desc';
			this.sortOptions.push(sodesc);
		}

		if (active)
			this.activeSort = sodesc;

		this.sortOptionsAsc = this.sortOptions.filter(s => s.sort == 'asc');
		this.sortOptionsDesc = this.sortOptions.filter(s => s.sort == 'desc');
	}

	addFilterOptions(text: string, value: string, icon: any, active: boolean = false, disabled: boolean = false, notify: string = null): void {
		this.filterOptions.push({
			text: text,
			value: value,
			icon: icon,
			active: active,
			disabled: disabled,
			notify: notify
		});

		if (active)
			this.activeFilter.newValue = value;
	}

	addColumn(name: string, label: string, width: number, sort: any, sclass: string = 'display-flex-grow-1 text-center'): void {
		this.columns[name] = {
			label: label,
			class: sclass,
			style: { 'width': width + '%' },
			sort: sort
		};
		this.columnsList.push(name);
	}

	setUpdateDataHandler(sh: (filter: any) => Promise<any>): void {
		this.updateDataHandler = sh;
	}

	setScrollableAreas(scrollableAreas: { visualizationButton: string; id: string }[]): void {
		this.scrollableAreas = scrollableAreas;
	}

	// private goTop(): void {
	// 	if (this.scrollableAreas.length == 0 || this.browserHelperService.currentResolution == 'xs') return;

	// 	const obj: { visualizationButton: string; id: string } = this.scrollableAreas.filter(obj => obj.visualizationButton == this.selectedVisualizationButton)[0];

	// 	// this.utilsService.onDomIsRendered('#' + obj.id)
	// 	// 	.then(function(element) {
	// 	$('#' + obj.id).scrollTop(0);
	// 	// });
	// }

	protected setPaginationOptionsInner(count: number) {
		this.pagination.options = [];
		let current = 0;

		let tot = Math.ceil(count / this.pagination.resultPerPage);
		if (tot == 0) tot = 1;

		//calculate limits
		//add it when is less than max and when no more than 3 limits are added
		for (let n = 1; n <= tot && n < 4; n++) {
			current = this.pagination.resultPerPage * n;

			this.pagination.options.push({
				value: current,
				label: current.toString(),
				tooltip: this.translate.instant('Show') + ' ' + current + ' ' + this.translate.instant('results')
			});
		}
		this.pagination = { ...this.pagination };
	}
}
