import { TranslateService } from '@ngx-translate/core';
import { StaticPageBase } from './static-page-base';
import { Component } from '@angular/core';
import { UtilsService } from 'app/services/utils';


@Component({
	selector: 'static-badges-component',
	templateUrl: 'badges.html',
	styleUrls: ['static-page.scss']
})
export class StaticBadgesComponent extends StaticPageBase {
	constructor(utilsService: UtilsService, translate: TranslateService) {
		super(translate, utilsService, (translate) => ({
			header: {
				title: translate.instant('Badges')
			},
			image: {
				url: '/media/staticpages/badges_256x177.png',
				alt: translate.instant('badges')
			},
			meta: {
				title: translate.instant('Badges'),
				image: '/media/staticpages/advanced_donation.png',
				description: translate.instant('To stimulate the use of the platform and its diffusion in a fun way, some challenges are proposed here, in order to guide new users to explore the features offered by Helperbit.')
			}
		}));
	}
}
