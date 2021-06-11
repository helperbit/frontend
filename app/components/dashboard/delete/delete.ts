import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';

@Component({
	selector: 'me-delete-component',
	templateUrl: 'delete.html',
	styleUrls: ['../../../sass/main/custom/page.scss']
})
export class MeDeleteComponent {
	pageHeader: PageHeaderConfig;

	constructor(translate: TranslateService) {
		this.pageHeader = {
			description: {
				title: translate.instant('delete account'),
				subTitle: translate.instant('Remove your account from Helperbit')
			}
		}
	}
}