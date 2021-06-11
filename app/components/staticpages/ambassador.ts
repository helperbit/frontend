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

import { UtilsService } from '../../services/utils';
import { PageHeaderConfig } from '../../shared/components/page-header/page-header';
import { SocialShareConfig, SocialShareStyle } from '../../shared/components/social-share/social-share';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../models/user';
import { DashboardService, UserPrivate } from '../../models/dashboard';
import AppSettings from '../../app.settings';
import { Component, OnInit } from '@angular/core';
import { getLocalStorage } from 'app/shared/helpers/utils';
import { OnTranslateLoad } from 'app/shared/helpers/on-translate-load';


@Component({
	selector: 'static-ambassador-component',
	templateUrl: 'ambassador.html',
	styleUrls: ['static-page.scss', 'ambassador.scss']
})
export class StaticAmbassadorComponent extends OnTranslateLoad implements OnInit {
	pageHeader: PageHeaderConfig;
	image: { url: string; alt: string };
	socialShare: {
		config: SocialShareConfig;
		style: SocialShareStyle;
	};
	user: User;
	reflink: string;
	isLogged: boolean;
	badgesData: any;

	constructor(
		translate: TranslateService,
		private dashboardService: DashboardService,
		public utilsService: UtilsService
	) {
		super(translate);
		this.badgesData = utilsService.badges();
		this.user = null;
		this.reflink = AppSettings.baseUrl + '/signup?refby=';
		this.isLogged = false;
	}

	ngOnTranslateLoad(translate) {
		this.pageHeader = {
			description: {
				title: translate.instant('Ambassador')
			}
		};
		this.image = {
			url: '/media/staticpages/ambassador_256x228.png',
			alt: translate.instant('ambassador')
		};
		this.socialShare = {
			config: {
				title: translate.instant('Join with me on helperbit.com! Use this link to register'),
				hashtags: [translate.instant('helperbit'), translate.instant('ambassador')],
				url: null
			},
			style: {
				// type: 'circle',
				colored: true,
				size: 1.5
			}
		};

		this.utilsService.setMeta(
			this.translate.instant('Ambassador'),
			this.translate.instant('The Ambassador Program has been designed to reward the virtuous community of Helperbit. Your help is essential to spread our initiative and for this reason we are happy to thank you with unique prizes!'),
			'/media/staticpages/advanced_donation.png'
		);
	}

	ngOnInit() {
		this.isLogged = getLocalStorage().getItem('token') ? true : false;

		if (!this.isLogged)
			return;

		this.dashboardService.get().subscribe((user: UserPrivate) => {
			this.user = user;
			this.reflink = AppSettings.baseUrl + '/signup?refby=' + this.user.refcode;
			this.socialShare.config = { ...this.socialShare.config, ...{ url: this.reflink } };
		});
	}
}
