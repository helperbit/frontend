import { TranslateService } from '@ngx-translate/core';
import { StaticPageBase } from './static-page-base';
import { Component } from '@angular/core';
import { UtilsService } from 'app/services/utils';


@Component({
	selector: 'static-advanced-donations-component',
	templateUrl: 'advanced-donations.html',
	styleUrls: ['static-page.scss']
})
export class StaticAdvancedDonationsComponent extends StaticPageBase {
	constructor(utilsService: UtilsService, translate: TranslateService) {
		super(translate, utilsService, (translate) => ({
			header: {
				title: translate.instant('Advanced Donations')
			},
			image: {
				url: '/media/staticpages/advanced_donation.png',
				alt: translate.instant('advanced donations')
			},
			meta: {
				title: translate.instant('Advanced Donations'),
				image: '/media/staticpages/advanced_donation.png',
				description: translate.instant('')
			}
		}));
	}
}
