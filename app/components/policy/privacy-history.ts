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