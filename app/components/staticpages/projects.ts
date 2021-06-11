import { TranslateService } from '@ngx-translate/core';
import { StaticPageBase } from "./static-page-base";
import { Component } from '@angular/core';
import { UtilsService } from 'app/services/utils';

@Component({
	selector: 'static-projects-component',
	templateUrl: 'projects.html',
	styleUrls: ['static-page.scss']
})
export class StaticProjectsComponent extends StaticPageBase {
	constructor(utilsService: UtilsService, translate: TranslateService) {
		super(translate, utilsService, (translate) => ({
			header: {
				title: translate.instant('Create a social project to accept cryptocurrency donations in Helperbit')
			},
			image: {
				url: '/media/staticpages/project.png',
				alt: translate.instant('Create a social project to accept cryptocurrency donations in Helperbit')
			},
			meta: {
				title: translate.instant('Create a social project to accept cryptocurrency donations in Helperbit'),
				image: '/media/staticpages/project.png',
				description: translate.instant('Cryptocurrency donations are growing exponentially and it is expected that this payment method will become increasingly important for the entire charity sector. In Helperbit, non-profit organizations can learn more about this new tool and create innovative fundraising campaigns.')
			}
		}));
	}
}