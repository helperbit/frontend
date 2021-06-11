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

import * as $ from 'jquery';
import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { TranslateService } from '@ngx-translate/core';
import { DashboardService } from '../../../models/dashboard';
import AppSettings from '../../../app.settings';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/* User profile /me/edit */
@Component({
	selector: 'me-control-panel-component',
	templateUrl: 'controlpanel.html',
	styleUrls: ['../../../sass/main/custom/page.scss', 'controlpanel.scss']
})
export class MeControlPanelComponent implements OnInit {
	pageHeader: PageHeaderConfig;
	sections: {
		title: string;
		tooltipPosition: 'bottom' | 'top';
		buttons: {
			title: string;
			description: string;
			destination: string;
			icon: string;
			iconHover: string;
			new: boolean;
			tasks: any;
		}[];
	}[];

	constructor(
		private dashboardService: DashboardService,
		translate: TranslateService,
		private router: Router
	) {
		this.pageHeader = {
			description: {
				title: translate.instant('Control panel'),
				subTitle: translate.instant('The hub to manage your activies on the platform')
			}
		};

		this.sections = [
			{
				title: translate.instant('be involved'),
				tooltipPosition: 'bottom',
				buttons: [
					{
						title: translate.instant('become an ambassador'),
						description: translate.instant('Help your friends to sign up for the platform through your invite link and you can receive t-shirts, sweatshirts and a hardware wallet. Compete also for the 500€ prize.'),
						destination: '/me/ambassador',
						icon: '/media/controlpanel/png/ambassador.png',
						iconHover: '/media/controlpanel/png/ambassador_active.png',
						new: true,
						tasks: null
					},
					{
						title: translate.instant('collect the badges'),
						description: translate.instant('Many activities have been assigned to you and for each completed activity you receive a digital recognition, available on your profile.'),
						destination: '/me/badges',
						icon: '/media/controlpanel/png/badge.png',
						iconHover: '/media/controlpanel/png/badge_active.png',
						new: true,
						tasks: null
					},
					{
						title: translate.instant('gather money for charities'),
						description: translate.instant('Open your Campaign to celebrate an important occasion like a birthday, a festivity or a personal milestone. The beneficiary of the Campaign can not be you or a personal cause, choose the non-profit and support a charitable cause.'),
						destination: '/campaign/create',
						icon: '/media/controlpanel/png/campaign.png',
						iconHover: '/media/controlpanel/png/campaign_active.png',
						new: false,
						tasks: null
					},
					{
						title: translate.instant('manage your bitcoin wallet'),
						description: translate.instant('Create your multisignature wallet and use it to send and receive donations.'),
						destination: '/me/wallet',
						icon: '/media/controlpanel/png/wallet.png',
						iconHover: '/media/controlpanel/png/wallet_active.png',
						new: false,
						tasks: null
					},
					{
						title: translate.instant('browse charity projects'),
						description: translate.instant('Check which non-profit is accepting bitcoin donations and has created a charitable project.'),
						destination: '/project/list',
						icon: '/media/controlpanel/png/project.png',
						iconHover: '/media/controlpanel/png/project_active.png',
						new: false,
						tasks: null
					}
				]
			},
			{
				title: translate.instant('settings'),
				tooltipPosition: 'top',
				buttons: [
					{
						title: translate.instant('complete your profile'),
						description: translate.instant('Fill the basic forms and become eligible to complete the ID verification process. This increases the chance to be helped if you are affected by a natural disaster.'),
						destination: '/me/edit',
						icon: '/media/controlpanel/png/profile.png',
						iconHover: '/media/controlpanel/png/profile_active.png',
						new: false,
						tasks: null
					},
					{
						title: translate.instant('be geoverified'),
						description: translate.instant('Helperbit offers different geoverification steps: according to the completed level, when a natural disaster occurs, users can receive direct donations. This does not compromise the user’s privacy, which, on the contrary, is safeguarded through appropriate procedures.'),
						destination: '/me/geoloc',
						icon: '/media/controlpanel/png/geoloc.png',
						iconHover: '/media/controlpanel/png/geoloc_active.png',
						new: false,
						tasks: null
					},
					{
						title: translate.instant('verify your identity'),
						description: translate.instant('This passage allows citizens to increase their trust level and be helped in case that they are affected by a natural disaster, receiving direct donations.'),
						destination: '/me/verify',
						icon: '/media/controlpanel/png/verify.png',
						iconHover: '/media/controlpanel/png/verify_active.png',
						new: false,
						tasks: null
					},
					{
						title: translate.instant('privacy'),
						description: translate.instant('User privacy is a very important value for us. Each individual can change the settings related to the public visualisation of personal data through the own configuration page. For more information, see the Privacy Policy page.'),
						destination: '/me/privacy',
						icon: '/media/controlpanel/png/privacy.png',
						iconHover: '/media/controlpanel/png/privacy_active.png',
						new: false,
						tasks: null
					},
					{
						title: translate.instant('profile security'),
						description: translate.instant('Change your password with a stronger one and protect your account from external attackers.'),
						destination: '/me/security',
						icon: '/media/controlpanel/png/security.png',
						iconHover: '/media/controlpanel/png/security_active.png',
						new: false,
						tasks: null
					},

				]
			},
		];
	}

	mouseEnter(e, b) {
		$(e.currentTarget).find('img').attr('src', b.iconHover);
	}

	mouseLeave(e, b) {
		$(e.currentTarget).find('img').attr('src', b.icon);
	}

	browseTo(b) {
		this.router.navigateByUrl(b.destination);
	}

	ngOnInit() {
		this.dashboardService.get().subscribe(user => {
			this.sections[0].buttons[3].tasks = {
				completed: !user.receiveaddress ? 0 : 1,
				total: 1
			};

			this.dashboardService.getVerify().subscribe((data) => {
				this.sections[1].buttons[2].tasks = {
					completed: data.verification.length,
					total: data.verification.length + data.available.length
				};
				this.sections[1].buttons[0].tasks = {
					completed: 1,
					total: 1
				};
				this.sections[1].buttons[1].tasks = {
					completed: 1,
					total: 1
				};
			}, d => {
				const res = d.error;
				if (res.error == 'EV1') {
					const profileMissing = res.data.fields.filter(e => AppSettings.verify.errors.profile.indexOf(e) != -1).length;
					const geolocMissing = res.data.fields.filter(e => AppSettings.verify.errors.geolocalization.indexOf(e) != -1).length;

					this.sections[1].buttons[0].tasks = {
						completed: 0,
						total: res.data.mandatoryfields.filter(e => AppSettings.verify.errors.profile.indexOf(e) != -1).length
					};
					this.sections[1].buttons[1].tasks = {
						completed: 0,
						total: res.data.mandatoryfields.filter(e => AppSettings.verify.errors.geolocalization.indexOf(e) != -1).length
					};
					this.sections[1].buttons[2].tasks = {
						completed: 0,
						total: 1
					};

					this.sections[1].buttons[0].tasks.completed = this.sections[1].buttons[0].tasks.total - profileMissing;
					this.sections[1].buttons[1].tasks.completed = this.sections[1].buttons[1].tasks.total - geolocMissing;
				}
			});
		});
	}
}