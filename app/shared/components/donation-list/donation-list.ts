import { TranslateService } from '@ngx-translate/core';
import { BrowserHelperService } from '../../../services/browser-helper';
import { DonationService, Donation } from '../../../models/donation';
import { UserProjectList } from '../../../models/dashboard';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationReply } from 'app/models/common';
import { ActivatedRoute } from '@angular/router';

export type donationListColumnsType = 'donor' | 'donorSmall' | 'country' | 'countrySmall' | 'full' | 'custom';

export type DonationListConfig = {
	columnsType?: donationListColumnsType;
	columnsTypeOptions?: {
		expression?: () => any;
		projects: UserProjectList;
	};
	refresh?: number;
	hideHeader?: boolean;
	fullSize?: boolean;
	pagination?: boolean;
	limit?: number;
	type?: {
		value?: any;
		object?: any;
	};
};

@Component({
	selector: 'donation-list',
	templateUrl: 'donation-list.html',
	styleUrls: ['../../../sass/main/custom/tools-page-template.scss', 'donation-list.scss']
})
export class DonationListComponent implements OnDestroy, OnChanges {
	@Input() config: DonationListConfig;

	currentResolution: string;
	donations: Donation[];
	pagination: {
		itemsCount: number;
		totalPages: number;
		maxPages: number;
		currentPage: number;
		options: { label: string; value: number; tooltip: string }[];
		resultPerPage: number;
		resultPerPageDefault: number;
		toRecalculate: boolean;
	};
	sorts: {
		value: any;
		parsedValue: { label: string; orderBy: any; sort: any; show: boolean };
		options: { label: string; orderBy: any; sort: any; show: boolean }[];
	};
	tableHeadColumns: {};
	tableHeadColumnsList: string[];
	refreshTimeout: any;
	parsedConfig: {}

	constructor(
		private donationService: DonationService,
		private route: ActivatedRoute,
		private translate: TranslateService,
		browserHelperService: BrowserHelperService
	) {
		this.currentResolution = browserHelperService.currentResolution;
		this.donations = [];
		this.pagination = {
			itemsCount: 0,
			totalPages: 0,
			maxPages: 4,
			currentPage: 1,
			options: [],
			resultPerPage: 24,
			resultPerPageDefault: 12,
			toRecalculate: true
		};
		this.sorts = { value: null, parsedValue: { label: null, orderBy: null, sort: null, show: null }, options: [] };
		this.tableHeadColumns = {};
		this.tableHeadColumnsList = [];
		this.refreshTimeout = null;
		this.parsedConfig = {};
	}

	private getSortOption(orderBy, sort) {
		const option = this.sorts.options.filter(option => option.orderBy == orderBy && option.sort == sort);

		return option.length == 1 ? option[0] : null;
	}

	private getColumnsTypeHtmlClass(columnKey, show) {
		const tableTypes = {
			donor: {
				columns: {
					txid: {
						htmlClass: 'hidden-xs',
					},
					from: {
						htmlClass: '',
					},
					time: {
						htmlClass: '',
					},
					value: {
						htmlClass: '',
					}
				}
			},
			donorSmall: {
				columns: {
					from: {
						htmlClass: '',
					},
					directionDonation: {
						htmlClass: 'text-color-green',
					},
					to: {
						htmlClass: '',
					},
					time: {
						htmlClass: 'hidden-xs',
					},
					value: {
						htmlClass: '',
					}
				}
			},
			country: {
				columns: {
					fromCountry: {
						htmlClass: '',
					},
					directionDonation: {
						htmlClass: 'text-color-green',
					},
					toCountry: {
						htmlClass: '',
					},
					time: {
						htmlClass: 'hidden-xs',
					},
					value: {
						htmlClass: '',
					}
				}
			},
			countrySmall: {
				columns: {
					fromCountry: {
						htmlClass: '',
					},
					time: {
						htmlClass: '',
					},
					value: {
						htmlClass: '',
					}
				}
			},
			full: {
				columns: {
					txid: {
						htmlClass: 'hidden-sm hidden-xs',
					},
					from: {
						htmlClass: '',
					},
					fromCountry: {
						htmlClass: 'hidden-sm hidden-xs',
					},
					toLength: {
						htmlClass: 'hidden-md hidden-sm hidden-xs',
					},
					to: {
						htmlClass: '',
					},
					toCountry: {
						htmlClass: 'hidden-sm hidden-xs',
					},
					time: {
						htmlClass: 'hidden-xs',
					},
					value: {
						htmlClass: '',
					}
				}
			}
		};

		let htmlClass = '';

		if (tableTypes[this.config.columnsType].columns[columnKey])
			htmlClass = tableTypes[this.config.columnsType].columns[columnKey].htmlClass

		return htmlClass;
	}

	private getColumnsConfig() {
		const self = this;

		function columnsTypeShowChecker(obj) {
			/*
				{
					donor: boolean,
					donorSmall: boolean,
					country: boolean,
					countrySmall: boolean,
					full: boolean,
					custom: expression
				}
			*/

			for (const key in obj) {
				if (key == 'custom' && obj[key] && self.config.columnsTypeOptions && self.config.columnsTypeOptions.expression)
					return self.config.columnsTypeOptions.expression();
				else if (obj[key] && self.config.columnsType == key)
					return true
			}

			return false;
		};


		/*
			// donor
				txid, from, time, value

			// donorSmall
				from, directionDonation, to, time, value

			// country
				fromCountry, directionDonation, toCountry, time, value

			// countrySmall
				fromCountry, time, value

			// full
				txid, from, fromCountry, toLength, to, toCountry, time, value
		*/

		const produceConfig = (q, column, trueShow = false) => {
			const show = trueShow ? true : columnsTypeShowChecker(q);
			const htmlClass = this.getColumnsTypeHtmlClass(column, show);

			return { show: show, htmlClass: htmlClass };
		}

		const config = {
			txid: produceConfig({ donor: true, full: true }, 'txid'),
			from: produceConfig({ donor: true, donorSmall: true, full: true }, 'from'),
			fromCountry: produceConfig({ country: true, countrySmall: true, full: true }, 'fromCountry'),
			directionDonation: produceConfig({ donorSmall: true, country: true }, 'directionDonation'),
			toLength: produceConfig({ full: true }, 'toLength'),
			to: produceConfig({ donorSmall: true, full: true }, 'to'),
			toCountry: produceConfig({ country: true, full: true }, 'toCountry'),
			toProject: produceConfig({ custom: true }, 'toProject'),
			time: produceConfig({}, 'time', true),
			value: produceConfig({}, 'value', true)
		};

		return config;
	}

	//set sorts options
	private setSortsOptions() {
		this.sorts.options = [
			{
				label: this.translate.instant('Date'),
				orderBy: 'time',
				sort: 'asc',
				show: true
			},
			{
				label: this.translate.instant('Date'),
				orderBy: 'time',
				sort: 'desc',
				show: true
			},
			{
				label: this.translate.instant('Donation'),
				orderBy: 'value',
				sort: 'asc',
				show: true
			},
			{
				label: this.translate.instant('Donation'),
				orderBy: 'value',
				sort: 'desc',
				show: true
			},
			{
				label: this.translate.instant('Donor/Origin'),
				orderBy: 'from',
				sort: 'asc',
				show: true
			},
			{
				label: this.translate.instant('Donor/Origin'),
				orderBy: 'from',
				sort: 'desc',
				show: true
			},
			{
				label: this.translate.instant('Origin Country'),
				orderBy: 'fromcountry',
				sort: 'asc',
				show: true
			},
			{
				label: this.translate.instant('Origin Country'),
				orderBy: 'fromcountry',
				sort: 'desc',
				show: true
			}
		];
	}

	//set table head
	private setTableHeadColumns() {
		const columnsConfig = this.getColumnsConfig();
		this.tableHeadColumns = {
			txid: {
				label: this.translate.instant('Tx Id'),
				style: { 'flex-grow': '1', 'min-width': '0' },
				class: columnsConfig.txid.htmlClass,
				show: columnsConfig.txid.show,
				sort: {
					asc: {
						show: () => false
					},
					desc: {
						show: () => false
					},
					ascDesc: {
						show: () => false
					}
				}
			},
			from: {
				label: this.translate.instant('Donor'),
				style: { 'flex-grow': '1.4' },
				class: columnsConfig.from.htmlClass,
				show: columnsConfig.from.show,
				sort: {
					asc: {
						value: this.getSortOption('from', 'asc'),
						show: () => this.sorts.parsedValue.orderBy == 'from' && this.sorts.parsedValue.sort == 'asc'
					},
					desc: {
						value: this.getSortOption('from', 'desc'),
						show: () => this.sorts.parsedValue.orderBy == 'from' && this.sorts.parsedValue.sort == 'desc'
					},
					ascDesc: {
						value: this.getSortOption('from', 'desc'),
						show: () => this.sorts.parsedValue.orderBy != 'from'
					}
				}
			},
			fromCountry: {
				label: this.translate.instant('Origin country'),
				style: { 'flex-grow': '1.4' },
				class: columnsConfig.fromCountry.htmlClass,
				show: columnsConfig.fromCountry.show,
				sort: {
					asc: {
						value: this.getSortOption('fromcountry', 'asc'),
						show: () => this.sorts.parsedValue.orderBy == 'fromcountry' && this.sorts.parsedValue.sort == 'asc'
					},
					desc: {
						value: this.getSortOption('fromcountry', 'desc'),
						show: () => this.sorts.parsedValue.orderBy == 'fromcountry' && this.sorts.parsedValue.sort == 'desc'
					},
					ascDesc: {
						value: this.getSortOption('fromcountry', 'desc'),
						show: () => this.sorts.parsedValue.orderBy != 'fromcountry'
					}
				}
			},
			directionDonation: {
				label: '',
				style: { 'flex-grow': '0.25' },
				class: columnsConfig.directionDonation.htmlClass,
				show: columnsConfig.directionDonation.show,
				sort: {
					asc: {
						show: () => false
					},
					desc: {
						show: () => false
					},
					ascDesc: {
						show: () => false
					}
				}
			},
			toLength: {
				label: this.translate.instant('Destination users'),
				style: { 'flex-grow': '1' },
				class: columnsConfig.toLength.htmlClass,
				show: columnsConfig.toLength.show,
				sort: {
					asc: {
						show: () => false
					},
					desc: {
						show: () => false
					},
					ascDesc: {
						show: () => false
					}
				}
			},
			to: {
				label: this.translate.instant('Destination'),
				style: { 'flex-grow': '1.4' },
				class: columnsConfig.to.htmlClass,
				show: columnsConfig.to.show,
				sort: {
					asc: {
						show: () => false
					},
					desc: {
						show: () => false
					},
					ascDesc: {
						show: () => false
					}
				}
			},
			toCountry: {
				label: this.translate.instant('Recipient country'),
				style: { 'flex-grow': '1.5' },
				class: columnsConfig.toCountry.htmlClass,
				show: columnsConfig.toCountry.show,
				sort: {
					asc: {
						show: () => false
					},
					desc: {
						show: () => false
					},
					ascDesc: {
						show: () => false
					}
				}
			},
			toProject: {
				label: this.translate.instant('Project'),
				style: { 'flex-grow': '1.5' },
				class: columnsConfig.toProject.htmlClass,
				show: columnsConfig.toProject.show,
				sort: {
					asc: {
						show: () => false
					},
					desc: {
						show: () => false
					},
					ascDesc: {
						show: () => false
					}
				}
			},
			time: {
				label: this.translate.instant('Date'),
				style: { 'flex-grow': '1' },
				class: columnsConfig.time.htmlClass,
				show: columnsConfig.time.show,
				sort: {
					asc: {
						value: this.getSortOption('time', 'asc'),
						show: () => this.sorts.parsedValue.orderBy == 'time' && this.sorts.parsedValue.sort == 'asc'
					},
					desc: {
						value: this.getSortOption('time', 'desc'),
						show: () => this.sorts.parsedValue.orderBy == 'time' && this.sorts.parsedValue.sort == 'desc'
					},
					ascDesc: {
						value: this.getSortOption('time', 'desc'),
						show: () => this.sorts.parsedValue.orderBy != 'time'
					}
				}
			},
			value: {
				label: this.translate.instant('Donation'),
				style: { 'flex-grow': '1.3' },
				class: columnsConfig.value.htmlClass,
				show: columnsConfig.value.show,
				sort: {
					asc: {
						value: this.getSortOption('value', 'asc'),
						show: () => this.sorts.parsedValue.orderBy == 'value' && this.sorts.parsedValue.sort == 'asc'
					},
					desc: {
						value: this.getSortOption('value', 'desc'),
						show: () => this.sorts.parsedValue.orderBy == 'value' && this.sorts.parsedValue.sort == 'desc'
					},
					ascDesc: {
						value: this.getSortOption('value', 'desc'),
						show: () => this.sorts.parsedValue.orderBy != 'value'
					}
				}
			}
		};
		this.tableHeadColumnsList = ['txid', 'from', 'fromCountry', 'directionDonation', 'toLength', 'to', 'toCountry', 'toProject', 'time', 'value']
			.filter(k => this.tableHeadColumns[k].show);
	}

	//set paginations buttons
	private setPaginationOptions() {
		this.pagination.options = [];
		let current = 0;

		let tot = Math.ceil(this.pagination.itemsCount / this.pagination.resultPerPageDefault);
		if (tot == 0) tot = 1;

		//calculate limits
		//add it when is less than max and when no more than 3 limits are added
		for (let n = 1; n <= tot && n < 4; n++) {
			current = this.pagination.resultPerPageDefault * n;

			this.pagination.options.push({
				value: current,
				label: current.toString(),
				tooltip: this.translate.instant('Show') + ' ' + current + ' ' + this.translate.instant('results')
			});
		}

		this.pagination = { ...this.pagination };
	}

	//set first query default values
	private setDefaultQuery() {
		//SORT
		const sort = this.getSortOption('time', 'desc');
		this.sorts.value = JSON.stringify(sort);
		this.sorts.parsedValue = sort;

		//LIMIT
		if (!this.config.limit)
			this.pagination.resultPerPage = this.pagination.resultPerPageDefault * 2;
		else
			this.pagination.resultPerPage = this.pagination.resultPerPageDefault;

		this.pagination = { ...this.pagination };
	}

	//set first query by parameters values
	private setQueryByParams() {
		if (this.route.snapshot.queryParamMap.has('page')) 
			this.pagination.currentPage = parseInt(this.route.snapshot.queryParamMap.get('page')) - 1;

		if (this.route.snapshot.queryParamMap.has('orderby') && this.route.snapshot.queryParamMap.has('sort')) {
			const sort = this.getSortOption(this.route.snapshot.queryParamMap.get('orderby'), this.route.snapshot.queryParamMap.get('sort'));

			if (sort != null) {
				this.sorts.value = JSON.stringify(sort);
				this.sorts.parsedValue = sort;
			}
		}
		else if (this.route.snapshot.queryParamMap.has('orderby')) {
			const sort = this.getSortOption(this.route.snapshot.queryParamMap.get('orderby'), this.sorts.parsedValue.sort);

			if (sort != null) {
				this.sorts.value = JSON.stringify(sort);
				this.sorts.parsedValue = sort;
			}
		}
		else if (this.route.snapshot.queryParamMap.has('sort')) {
			const sort = this.getSortOption(this.sorts.parsedValue.orderBy, this.route.snapshot.queryParamMap.get('sort'));

			if (sort != null) {
				this.sorts.value = JSON.stringify(sort);
				this.sorts.parsedValue = sort;
			}
		}
	}

	//set donations by filters
	private setVisibleDonations() {
		if (this.config.type.value && !this.config.type.object) return;

		//SET QUERY
		const query: {
			page: number;
			sort: string;
			orderby: string;
			limit: number;
			flow?: string;
		} = {
			page: this.pagination.currentPage - 1,
			sort: this.sorts.parsedValue.sort,
			orderby: this.sorts.parsedValue.orderBy,
			limit: this.pagination.resultPerPage
		};

		let donationsObservable: Observable<PaginationReply<Donation>> = null;

		switch (this.config.type.value) {
			case 'user': {
				query.flow = 'in';
				donationsObservable = this.donationService.getUserDonations(this.config.type.object.username, query);
				break;
			}
			case 'project': {
				donationsObservable = this.donationService.getProjectDonations(this.config.type.object._id, query);
				break;
			}
			case 'event': {
				donationsObservable = this.donationService.getEventDonations(this.config.type.object._id, query);
				break;
			}
			case 'campaign': {
				donationsObservable = this.donationService.getCampaignDonations(this.config.type.object._id, query);
				break;
			}
			default: {
				donationsObservable = this.donationService.getList(query);
			}
		}

		donationsObservable.subscribe(donations => {
			switch (this.config.type.value) {
				case 'user': {
					donations.list = donations.list.map(donation => {
						donation.value = donation.to.filter(recipient => recipient.user == this.config.type.object.username)[0].value;
						return donation;
					});

					break;
				}
				case 'project': {
					donations.list = donations.list.map(donation => {
						donation.value = donation.to.filter(recipient => recipient.project == this.config.type.object._id)[0].value;
						return donation;
					});

					break;
				}
			}

			//to recalculate pages available
			this.pagination.itemsCount = donations.count;

			while (donations.count < (this.pagination.resultPerPage / 2) && this.pagination.resultPerPage > this.pagination.resultPerPageDefault)
				this.pagination.resultPerPage /= 2;

			if (this.pagination.toRecalculate)
				this.setPaginationOptions();

			this.pagination = { ...this.pagination };
			setTimeout(() => {
				if (this.config.columnsTypeOptions) {
					//projects npo donation list
					if (this.config.columnsTypeOptions.projects)
						donations.list.forEach(donation => {
							const arrTo = [];
							donation.to.forEach(to => {
								this.config.columnsTypeOptions.projects.closedprojects.forEach(project => {
									if (to.project == project._id) {
										(to.project as any) = project;
										arrTo.push(to);
									}
								});

								this.config.columnsTypeOptions.projects.projects.forEach(project => {
									if (to.project == project._id) {
										(to.project as any) = project;
										arrTo.push(to);
									}
								});
							});
							donation.to = arrTo;
						});
				}

				this.donations = donations.list;
			}, 0);
		});
	}
	//when page is changed
	public changePage() {
		setTimeout(() => {
			this.pagination.toRecalculate = false;
			this.setVisibleDonations();
		}, 0);
	}

	//when result per page are changed
	public limitResults(event?) {
		setTimeout(() => {
			this.pagination.toRecalculate = false;
			this.setVisibleDonations();
		}, 0);
	}

	//when an order element is clicked
	public sortResults(sort?: any) {
		this.pagination.toRecalculate = false;

		if (sort) {
			delete sort['$$hashKey'];
			this.sorts.value = JSON.stringify(sort);
			this.sorts.parsedValue = sort;
		}
		else
			this.sorts.parsedValue = JSON.parse(this.sorts.value);

		this.setVisibleDonations();
	}


	ngOnChanges(changes) {
		if (!changes.config || !changes.config.currentValue)
			return;

		if (!this.config.type)
			this.config.type = { value: null, object: null };

		if (!this.config.columnsType)
			this.config.columnsType = 'full';

		if (this.config.limit)
			this.pagination = { ...this.pagination, ...{ resultPerPageDefault: this.config.limit } };

		this.setSortsOptions();
		this.setTableHeadColumns();
		this.setDefaultQuery();
		this.setQueryByParams();

		this.setVisibleDonations();

		if (this.config.refresh && !this.refreshTimeout) {
			this.refreshTimeout = setInterval(() => {
				this.setVisibleDonations();
			}, this.config.refresh * 1000);
		}
	}

	ngOnDestroy() {
		if (this.refreshTimeout)
			clearInterval(this.refreshTimeout);
	}
}