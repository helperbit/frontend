import { PageHeaderConfig } from '../../shared/components/page-header/page-header';
import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';


@Component({
	templateUrl: 'privacy-content.html',
	selector: 'privacy-content-component'
})
export class PrivacyContentComponent {}

@Component({
	selector: 'privacy-component',
	templateUrl: 'privacypage.html',
	styleUrls: ['policypage.scss']
})
export class PrivacyComponent {
	pageHeader: PageHeaderConfig;
	image: { url: string; alt: string };

	constructor(translate: TranslateService) {
		this.pageHeader = {
			description: {
				title: translate.instant('privacy policy'),
				subTitle: translate.instant('Last Revised: May 24, 2018')
			}
		};
		this.image = {
			url: '/media/staticpages/privacy_policy2.png',
			alt: translate.instant('privacy policy')
		};
	}
}
