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