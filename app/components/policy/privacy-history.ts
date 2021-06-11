import { PageHeaderConfig } from '../../shared/components/page-header/page-header';
import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';

@Component({
	selector: 'privacy-history-component',
	templateUrl: 'privacy-history.html',
	styleUrls: ['../../sass/main/custom/page.scss']
})
export class PrivacyHistoryComponent {
	pageHeader: PageHeaderConfig;
	image: { url: string; alt: string };

	constructor(translate: TranslateService) {
		this.pageHeader = {
			description: {
				title: translate.instant('privacy policy history'),
				subTitle: translate.instant('Previous versions of the privacy policy')
			}
		};
		this.image = {
			url: '/media/staticpages/privacy_policy2.png',
			alt: translate.instant('privacy policy')
		};
	}
}