import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { DonationService, Donation } from '../../../models/donation';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { getLocalStorage } from 'app/shared/helpers/utils';

/* User invoiceable donations /me/invoiceable */
@Component({
	selector: 'me-invoiceable-component',
	templateUrl: 'invoiceable.html',
	styleUrls: ['../../../sass/main/custom/page.scss']
})
export class MeInvoiceableComponent implements OnInit {
	pageHeader: PageHeaderConfig;
	username: string;
	invoiceableDonations: Donation[];

	constructor(
		private donationService: DonationService,
		translate: TranslateService
	) {
		this.donationService = donationService;
		this.invoiceableDonations = [];

		this.pageHeader = {
			description: {
				title: translate.instant('invoiceable donations'),
				subTitle: translate.instant('Donation invoices for tax deduction')
			}
		};
	}

	private update() {
		this.invoiceableDonations = [];
		this.donationService.getUserDonations(this.username, { flow: 'out' }).subscribe(data => {
			for (let i = 0; i < data.list.length; i++) {
				for (let j = 0; j < data.list[i].to.length; j++) {
					if (data.list[i].to[j].type == 'npo') {
						this.invoiceableDonations.push(data.list[i]);
					}
				}
			}
		});
	}

	requestInvoice(txid) {
		this.donationService.requestInvoice(txid).subscribe(_ => {
			this.update();
		});
	}

	ngOnInit() {
		this.username = getLocalStorage().getItem('username');
		this.update();
	}
}