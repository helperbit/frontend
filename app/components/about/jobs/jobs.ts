import { PageHeaderConfig } from "../../../shared/components/page-header/page-header";
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'app/services/utils';

@Component({
	selector: 'jobs-component',
	templateUrl: 'jobs.html',
	styleUrls: ['../../../sass/main/custom/page.scss']
})
export class JobsComponent implements OnInit {
	pageHeader: PageHeaderConfig;

	constructor (private utilsService: UtilsService, private translate: TranslateService) {
		this.pageHeader = {
			description: {
				title: translate.instant('we are hiring!'),
				subTitle: translate.instant('open job positions')
			}
		}
	}

	ngOnInit () {
		this.utilsService.setMeta(
			this.translate.instant('Open job positions'),
			this.translate.instant('Open job positions: job opportunity to work in Helperbit as a backend developer, frontend developer, designer or sales manager.')
		);
	}
}
