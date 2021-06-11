import { TranslateService } from '@ngx-translate/core';
import { StaticPageBase } from './static-page-base';
import { Component } from '@angular/core';
import { UtilsService } from 'app/services/utils';

@Component({
	selector: 'static-propose-noprofit-component',
	templateUrl: 'propose-noprofit.html',
	styleUrls: ['static-page.scss']
})
export class StaticProposeNoprofitComponent extends StaticPageBase {
	constructor(utilsService: UtilsService, translate: TranslateService) {
		super(translate, utilsService, (translate) => ({
			header: {
				title: translate.instant('Propose Your Non-Profit and Encourage it to Accept Crypto Donations')
			},
			image: {
				url: '/media/staticpages/proposed_npo.png',
				alt: translate.instant('Propose Your Non-Profit and Encourage it to Accept Crypto Donations')
			},
			meta: {
				title: translate.instant('Propose Your Non-Profit and Encourage it to Accept Crypto Donations'),
				image: '/media/staticpages/proposed_npo.png',
				description: translate.instant('Through the page “Proposed NPO List” you can vote for your favorite organization. Every vote increases the community’s interest in having more and more innovative organizations!')
			}
		}));
	}
}