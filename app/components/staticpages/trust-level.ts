import { TranslateService } from '@ngx-translate/core';
import { StaticPageBase } from "./static-page-base";
import { Component } from '@angular/core';
import { UtilsService } from 'app/services/utils';

@Component({
	selector: 'static-trust-level-component',
	templateUrl: 'trust-level.html',
	styleUrls: ['static-page.scss']
})
export class StaticTrustLevelComponent extends StaticPageBase {
	constructor(utilsService: UtilsService, translate: TranslateService) {
		super(translate, utilsService, (translate) => ({
			header: {
				title: translate.instant('Verification and Trust Level of a single user')
			},
			image: {
				url: '/media/staticpages/trust_level2.png',
				alt: translate.instant('Verification and Trust Level of a single user')
			},
			meta: {
				title: translate.instant('Verification and Trust Level of a single user'),
				image: '/media/staticpages/trust_level2.png',
				description: translate.instant('The verification procedure is focused on the identity and geographical location of individual users signed up for Helperbit. This passage allows citizens to be helped in case that they are affected by a natural disaster, receiving direct donations.')
			}
		}));
	}
}