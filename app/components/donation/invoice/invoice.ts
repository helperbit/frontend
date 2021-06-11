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

