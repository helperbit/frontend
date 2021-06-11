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
