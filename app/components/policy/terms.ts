import { PageHeaderConfig } from '../../shared/components/page-header/page-header';
import { TranslateService } from '@ngx-translate/core';
import { Component } from "@angular/core";

@Component({
	templateUrl: 'terms-content.html',
	selector: 'terms-content-component',
})
export class TermsContentComponent {}


@Component({
	templateUrl: 'termspage.html',
	selector: 'terms-component',
	styleUrls: ['policypage.scss']
})
export class TermsComponent {
	pageHeader: PageHeaderConfig;
	image: { url: string; alt: string };

	constructor(translate: TranslateService) {
		this.pageHeader = {
			description: {
				title: translate.instant('terms of service'),
				subTitle: translate.instant('Last Revised: November 15, 2017')
			}
		};
		this.image = {
			url: '/media/staticpages/privacy_policy.png',
			alt: translate.instant('terms of service')
		};
	}
}
