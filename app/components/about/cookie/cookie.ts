import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';

@Component({
	selector: 'cookie-component',
	templateUrl: 'cookie.html',
	styleUrls: ['../../../sass/main/custom/page.scss']
})
export class CookieComponent {
	pageHeader: PageHeaderConfig;

	constructor(translate: TranslateService) {
		this.pageHeader = {
			description: {
				title: translate.instant('cookie'),
				subTitle: translate.instant('Cookies policy')
			}
		};
	}
}