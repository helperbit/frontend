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

import { PageHeaderConfig } from "../../shared/components/page-header/page-header";
import { UtilsService } from 'app/services/utils';
import { OnInit } from '@angular/core';
import { OnTranslateLoad } from 'app/shared/helpers/on-translate-load';
import { TranslateService } from '@ngx-translate/core';

export interface StaticPageConfig {
	header: {
		title: string;
	};
	meta: {
		title: string;
		image: string;
		description: string;
	};
	image: {
		url: string;
		alt: string;
	};
};

export type StaticPageConfigFn = (translate: TranslateService) => StaticPageConfig;

export class StaticPageBase extends OnTranslateLoad {
	pageHeader: PageHeaderConfig;
	image: { url: string; alt: string };
	staticConfig: StaticPageConfig;

	constructor(
		translate: TranslateService,
		private utilsService: UtilsService,
		private staticConfigFn: StaticPageConfigFn
	) {
		super(translate, true);
		
		this.staticConfig = this.staticConfigFn(translate);
		this.image = this.staticConfig.image;
	}

	ngOnTranslateLoad(translate) {
		this.staticConfig = this.staticConfigFn(translate);

		this.pageHeader = { description: this.staticConfig.header };
		this.image = this.staticConfig.image;

		this.utilsService.setMeta(
			this.staticConfig.meta.title,
			this.staticConfig.meta.description,
			this.staticConfig.meta.image
		);
	}
}