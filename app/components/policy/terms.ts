/* 
 *  Helperbit: a p2p donation platform (frontend)
 *  Copyright (C) 2016-2021  Davide Gessa (gessadavide@gmail.com)
 *  Copyright (C) 2016-2021  Helperbit team
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

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
