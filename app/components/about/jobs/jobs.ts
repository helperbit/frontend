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
