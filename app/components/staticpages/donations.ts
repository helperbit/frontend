import { TranslateService } from '@ngx-translate/core';
import { StaticPageBase } from './static-page-base';
import { Component } from '@angular/core';
import { UtilsService } from 'app/services/utils';


@Component({
	selector: 'static-donations-component',
	templateUrl: 'donations.html',
	styleUrls: ['static-page.scss']
})
export class StaticDonationsComponent extends StaticPageBase {
	constructor(utilsService: UtilsService, translate: TranslateService) {
		super(translate, utilsService, (translate) => ({
			header: {
				title: translate.instant('Make a Donation using Helperbit')
			},
			image: {
				url: '/media/staticpages/donation.png',
				alt: translate.instant('donations')
			},
			meta: {
				title: translate.instant('Make a Donation using Helperbit'),
				image: '/media/staticpages/donation.png',
				description: translate.instant('There are several ways to make a donation in Helperbit: you can donate using Bitcoin, Litecoin, Ethereum and other 16 cryptocurrencies, but payments by credit, debit and prepaid cards are also accepted.')
			}
		}));
	}
}