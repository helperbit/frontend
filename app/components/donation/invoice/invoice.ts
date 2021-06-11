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

import { TranslateService } from '@ngx-translate/core';
import { PageHeaderConfig } from "../../../shared/components/page-header/page-header";
import { UserService, User } from "../../../models/user";
import { DashboardService, UserPrivate } from "../../../models/dashboard";
import { DonationService, Donation } from "../../../models/donation";
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getLocalStorage } from 'app/shared/helpers/utils';

/* Donation invoice controller */
@Component({
	selector: 'donation-invoice-component',
	templateUrl: 'invoice.html',
	styleUrls: ['../../../sass/main/custom/page.scss', 'invoice.scss']
})
export class DonationInvoiceComponent implements OnInit {
	username: string;
	user: UserPrivate;
	donation: Donation;
	pageHeader: PageHeaderConfig;
	from: User;

	constructor(
		private donationService: DonationService,
		private userService: UserService,
		private dashboardService: DashboardService,
		private translate: TranslateService,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		const txid = this.route.snapshot.paramMap.get('txid');
		this.username = getLocalStorage().getItem('username');
		this.pageHeader = {
			description: {
				title: this.translate.instant('donation invoice printing'),
				subTitle: txid
			}
		};

		this.dashboardService.get().subscribe((user: UserPrivate) => {
			this.user = user;

			this.donationService.get(txid).subscribe(donation => {
				this.donation = donation;

				this.userService.get(this.donation.from).subscribe(user => {
					this.from = user;
					window.print();
				});
			});
		});
	}
}

