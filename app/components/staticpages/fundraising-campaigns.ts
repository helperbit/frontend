import { TranslateService } from '@ngx-translate/core';
import { StaticPageBase } from "./static-page-base";
import { Component } from '@angular/core';
import { UtilsService } from 'app/services/utils';


@Component({
	selector: 'static-fundraising-campaigns-component',
	templateUrl: 'fundraising-campaigns.html',
	styleUrls: ['static-page.scss']
})
export class StaticFundraisingCampaignsComponent extends StaticPageBase {
	constructor(utilsService: UtilsService, translate: TranslateService) {
		super(translate, utilsService, (translate) => ({
			header: {
				title: translate.instant('Fundraising campaigns, celebrate an important occasion with a charity initiative')
			},
			image: {
				url: '/media/staticpages/donation.png',
				alt: translate.instant('fundraising campaigns')
			},
			meta: {
				title: translate.instant('Fundraising campaigns, celebrate an important occasion with a charity initiative'),
				image: '/media/staticpages/donation.png',
				description: translate.instant('A Fundraising Campaign is an initiative created for an important occasion. The raised amount is addressed to the cause you care for, in a direct and transparent way.')
			}
		}));
	}
}
