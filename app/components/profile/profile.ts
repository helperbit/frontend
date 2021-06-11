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
import { ModalConfig } from '../../shared/components/modal/oldModal/modal';
import { PageHeaderConfig } from '../../shared/components/page-header/page-header';
import { DonationListConfig } from '../../shared/components/donation-list/donation-list';
import { BadgesGridConfig } from '../../shared/components/badges-grid/badges-grid';
import { TranslateService } from '@ngx-translate/core';
import { RoundImageProgressConfig } from '../../shared/components/round-image-progress/round-image-progress';
import { ResponseMessageConfig, buildErrorResponseMessage } from '../../shared/components/response-messages/response-messages';
import { UserService, UserModel } from '../../models/user';
import { CurrencyService } from '../../services/currency';
import { UserProjectList } from '../../models/dashboard';
import { Ror } from '../../models/ror';
import { TransactionPublic } from '../../models/wallet';
import { ChartConfig } from '../../shared/components/chart/chart';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MeProfileOperatingCountriesComponent } from './modals/operating-countries/operating-countries';
import { MoneyPipe } from '../../shared/filters/money';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'app/services/utils';
import { getLocalStorage } from 'app/shared/helpers/utils';
import { OnTranslateLoad } from 'app/shared/helpers/on-translate-load';

/* User profile /user/:username and /user/byid/:id */
@Component({
	selector: 'user-component',
	templateUrl: 'profile.html',
	styleUrls: ['../../sass/main/custom/page.scss', 'profile.scss']
})
export class UserComponent extends OnTranslateLoad implements OnInit {
	modals: { [modalName: string]: ModalConfig };
	pageHeader: PageHeaderConfig;
	listConfig: DonationListConfig;
	badgesConfig: BadgesGridConfig;
	userImageConfig: RoundImageProgressConfig;
	responseMessage: ResponseMessageConfig;
	donationsStats: any;
	chartConfig: ChartConfig;

	me: boolean;
	user: UserModel;
	username: string = '';
	loading: boolean = true;
	projects: UserProjectList;
	txs: TransactionPublic[];
	rors: Ror[];
	addresses: { [address: string]: number };

	constructor(
		private userService: UserService,
		private route: ActivatedRoute,
		private utilsService: UtilsService,
		private currencyService: CurrencyService,
		private router: Router,
		private modalService: NgbModal,
		private moneyPipe: MoneyPipe,
		translate: TranslateService
	) {
		super(translate);

		this.modals = {
			addresses: {
				id: 'modalAddresses',
				hideCloseButton: true,
				title: ''
			},
			map: {
				id: 'modalMap',
				modalClass: 'modal-xl modal-full',
				hideCloseButton: true,
				title: ''
			}
		};
	}

	tabSelected(event) {
		if (event.nextId == 'graph-tab') {
			event.preventDefault();
			this.router.navigateByUrl('/donation/graph/user/' + this.username);
		}
	}

	showAddresses() {
		$('#modalAddresses').modal('show');

		this.userService.getAddresses(this.user.username).subscribe(addresses => {
			this.addresses = {};

			for (let i = 0; i < addresses.length; i++) {
				this.addresses[addresses[i]] = 0.0;
			}
		});
	}

	showMap() {
		const modalRef = this.modalService.open(MeProfileOperatingCountriesComponent);
		modalRef.componentInstance.countries = this.user.countries;
		modalRef.result.then((v) => { }, () => { });
	}

	loadProfile(user: UserModel) {
		this.modals.addresses.title = this.translate.instant('Bitcoin addresses');
		this.modals.map.title = this.translate.instant('Operating Countries');

		this.username = user.username;
		this.user = user;
		this.listConfig = { ...this.listConfig, ...{ type: { object: this.user, value: 'user' } } };
		this.loading = false;
		this.donationsStats = {
			donationsMade: this.user.donateddonations,
			bitcoinDonated: this.moneyPipe.transform(this.user.donated, 'short', true),
			donationsReceived: this.user.receiveddonations,
			bitcoinReceived: this.moneyPipe.transform(this.user.received, 'short', true),
		}

		this.listConfig.columnsTypeOptions.expression = () => user.usertype == 'npo';

		this.ngOnTranslateLoad(this.translate);

		let borderClass = 'trust-level-green';
		if (this.user.trustlevel <= 20) borderClass = 'trust-level-red';
		else if (this.user.trustlevel > 20 && this.user.trustlevel <= 50) borderClass = 'trust-level-orange';

		this.userImageConfig = {
			percentage: this.user.trustlevel,
			borderClass: borderClass,
			user: this.user
		};

		if (this.user.isSingleUser()) {
			this.badgesConfig = { ...this.badgesConfig, ...{ badges: this.user.badges } };
		} else {
			this.user.getTransactions().subscribe(txs => {
				this.txs = txs;
			});

			this.user.getProjects().subscribe(data => {
				this.projects = data;

				if (this.listConfig.columnsTypeOptions.expression())
					this.listConfig.columnsTypeOptions.projects = data;
			});

			this.user.getRors().subscribe(rors => {
				this.rors = rors;
			});

			this.user.getDonationChart().subscribe(chart => {
				const values = [];
				const labels = [];

				chart.data.forEach(donation => {
					values.push(Math.floor(donation.amount * 10000.0) / 10000.0);
					labels.push(donation.date.toDateString());
				});

				this.chartConfig.values = values;
				this.chartConfig.labels = labels;
				this.chartConfig.colors = ['#fe3737'];
			});
		}
	}

	ngOnTranslateLoad(translate: TranslateService) {
		this.modals.addresses.title = translate.instant('Bitcoin addresses');
		this.modals.map.title = translate.instant('Operating Countries');

		if (!this.user)
			return;

		/* Set page header */
		this.pageHeader.info.boxes = [];

		this.pageHeader.info.boxes.push({
			title: String(this.user.donateddonations),
			subTitle: translate.instant('donations')
		});

		this.pageHeader.info.boxes.push({
			title: this.moneyPipe.transform(this.user.donated, 'short', true),
			subTitle: this.moneyPipe.transform('name') + ' ' + translate.instant('donated')
		});

		this.pageHeader.info.boxes.push({
			title: this.moneyPipe.transform(this.user.received, 'short', true),
			subTitle: this.moneyPipe.transform('name') + ' ' + translate.instant('received')
		});

		this.pageHeader.info.boxes.push({
			title: String(this.user.receiveddonations),
			subTitle: this.translate.instant('received donations')
		});

		this.currencyService.onCurrencyChange.subscribe(currency => {
			this.pageHeader.info.boxes[1].title = this.moneyPipe.transform(this.user.donated, 'short', true);
			this.pageHeader.info.boxes[1].subTitle = this.moneyPipe.transform('name') + ' ' + translate.instant('donated');

			this.pageHeader.info.boxes[2].title = this.moneyPipe.transform(this.user.received, 'short', true);
			this.pageHeader.info.boxes[2].subTitle = this.moneyPipe.transform('name') + ' ' + translate.instant('received');
		});

		/* Set meta */
		this.utilsService.setMeta(
			translate.instant('User') + ': ' + this.user.username,
			this.utilsService.getSString(this.user.bio),
			'https://api.helperbit.com/api/v1/user/' + this.user.username + '/avatar'
		);
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.pageHeader = { info: { boxes: [] } };

			this.listConfig = {
				type: {
					value: 'user',
					object: null
				},
				columnsType: 'donor',
				columnsTypeOptions: {
					expression: null,
					projects: null
				},
				pagination: true
			};

			this.badgesConfig = { badges: [], badgeClass: 'col-lg-4 col-md-4 col-sm-6 col-xs-12', badgeHeight: 125, alwaysDescription: true };

			this.chartConfig = {
				values: [], colors: [], labels: [], type: 'bar', options: {
					tooltips: {
						callbacks: {
							label: function (tooltipItem, data) { return tooltipItem.value + ' BTC'; }
						}
					}
				}
			};

			const username = params.username;
			this.me = (username == getLocalStorage().getItem('username'));

			this.userService.getModel(username).subscribe(user => { this.loadProfile(user) }, (res) => {
				// if (res.error.error == 'E2')
				// 	this.cfpLoadingBar.error('E2', username);
				// else {
				this.responseMessage = buildErrorResponseMessage(res.error);
				// }
			});
		});
	}
}

