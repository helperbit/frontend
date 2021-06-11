import * as $ from 'jquery';
import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { InfoBoxConfig } from '../../../shared/components/info-box/info-box';
import { SocialShareConfig, SocialShareStyle } from '../../../shared/components/social-share/social-share';
import { UtilsService } from '../../../services/utils';
import { GoalsBarConfig } from '../widgets/goals-bar/goals-bar';
import { ModalConfig } from '../../../shared/components/modal/oldModal/modal';
import { StatsService } from '../../../models/stats';
import { UserService, User } from '../../../models/user';
import { DashboardService, UserPrivate, UserReferred } from '../../../models/dashboard';
import AppSettings from '../../../app.settings';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

/* User profile /me/admin */
@Component({
	selector: 'me-ambassador-component',
	templateUrl: 'ambassador.html',
	styleUrls: ['../../../sass/main/custom/page.scss', 'ambassador.scss']
})
export class MeAmbassadorComponent implements OnInit {
	profileBaseUrl: string = AppSettings.urls.public.profile;
	socialShare: {
		config: SocialShareConfig;
		style: SocialShareStyle;
	};
	pageHeader: PageHeaderConfig;
	infoBox: InfoBoxConfig;
	modals: { [modalName: string]: ModalConfig & { friends?: UserReferred[]; description?: string } };
	goalsBarConfig: GoalsBarConfig;
	user: UserPrivate;
	ambassador: { usersInvited: UserReferred[]; verified: UserReferred[]; notVerified: UserReferred[]; refBy?: string };
	merchandiseUser: {
		name: string;
		iconId: string;
		status: string;
		winDate: Date;
	}[];
	referred: string[];
	reflink: string;
	userReference: User;
	badgesData: any;


	constructor(
		private dashboardService: DashboardService, 
		private statsService: StatsService, 
		private userService: UserService, 
		public utilsService: UtilsService, 
		private router: Router,
		private translate: TranslateService
	) {
		this.pageHeader = {
			description: {
				title: translate.instant('Ambassador'),
				subTitle: translate.instant('Handle your invites')
			}
		};

		this.badgesData = this.utilsService.badges();

		this.modals = {
			friends: {
				id: 'friendsTable',
				modalClass: 'modal-md',
				hideCloseButton: true,
				title: translate.instant('Friends'),
				friends: []
			}
		};

		this.infoBox = {
			title: translate.instant('Who is an Ambassador?'),
			description: translate.instant('You can become an Ambassador by inviting your friends to join Helperbit. Share the invitation link and expand your network!'),
			link: '/i/ambassador'
		};

		this.socialShare = {
			config: {
				title: translate.instant('Join with me on helperbit.com! Use this link to register'),
				hashtags: [translate.instant('helperbit'), translate.instant('ambassador')],
				url: null
			},
			style: {
				type: 'block',
				colored: true,
				size: 1.5
			}
		};

		this.user = null;
		this.ambassador = { usersInvited: [], verified: [], notVerified: [], refBy: null };
		this.merchandiseUser = [];
		this.referred = [];
		this.reflink = AppSettings.baseUrl + '/signup?refby=';
		this.userReference = null;
	}


	goalClick(goal) {
		if (goal.unlock && (goal.href || goal.view)) {
			if (goal.href)
				window.location.replace(goal.href);
			else if (goal.view)
				this.router.navigateByUrl(goal.view)
		}
	}

	showFriendsTable(type) {
		switch (type) {
			case 'verified': {
				this.modals.friends.title = this.translate.instant('Verified Friends');
				this.modals.friends.description = this.translate.instant('Registration date of your verified friends.');
				this.modals.friends.friends = this.ambassador.verified;
				break;
			}
			case 'notVerified': {
				this.modals.friends.title = this.translate.instant('Not Verified Friends');
				this.modals.friends.description = this.translate.instant('Registration date of your unverified friends.');
				this.modals.friends.friends = this.ambassador.notVerified;
				break;
			}
		}

		$('#' + this.modals.friends.id).modal('show');
	}

	ngOnInit() {
		const merchandising = {
			'keychain': {
				name: this.translate.instant('Keychain'),
				iconId: 'keychain',
				src: AppSettings.baseUrl + '/media/merchandising/svg/keychain.svg'
			},
			'ledger': {
				name: this.translate.instant('Ledger'),
				iconId: 'ledger',
				src: AppSettings.baseUrl + '/media/merchandising/svg/ledger.svg'
			},
			'sweatshirt': {
				name: this.translate.instant('Sweatshirt'),
				iconId: 'sweatshirt',
				src: AppSettings.baseUrl + '/media/merchandising/svg/sweatshirt.svg'
			},
			'tshirt': {
				name: this.translate.instant('T-shirt'),
				iconId: 'tshirt',
				src: AppSettings.baseUrl + '/media/merchandising/svg/tshirt.svg'
			},
		};


		const promiseMe = this.dashboardService.get().toPromise();
		const promiseAmbassador = this.dashboardService.getAmbassador().toPromise();
		// const promiseMerchandise = this.statsService.getMerchandise().toPromise();

		Promise.all([promiseMe, promiseAmbassador]).then((res: any[]) => {
			const goalsBarConfig = {
				value: 0,
				percentage: 0,
				goals: [],
				cursorText: ''
			};

			this.user = res[0];

			//me get
			this.reflink = AppSettings.baseUrl + '/signup?refby=' + this.user.refcode;
			this.socialShare.config = {
				...this.socialShare.config, ...{
					url: this.reflink
				}
			};

			this.ambassador.usersInvited = res[1].referred;
			this.ambassador.verified = res[1].referred.filter(u => u.verified);
			this.ambassador.notVerified = res[1].referred.filter(u => !u.verified);
			this.ambassador.refBy = res[1].refby;

			if (this.ambassador.refBy) {
				this.userService.get(this.ambassador.refBy).subscribe(user => {
					this.userReference = user;
				});
			}

			//max value
			// const max = res[2].reduce((prev, current) => { return (prev.minrefs > current.minrefs) ? prev : current }).minrefs;

			// //ambassador
			// goalsBarConfig.value = this.ambassador.verified.length;
			// goalsBarConfig.percentage = this.ambassador.verified.length * 100 / max;
			// goalsBarConfig.cursorText = this.ambassador.verified.length + ' ' + (this.ambassador.verified.length == 1 ? this.translate.instant('friend') : this.translate.instant('friends')) + ' ' + this.translate.instant('already verified');

			// //merchandise
			// res[2].forEach(obj => {
			// 	let text = '';
			// 	const gift = merchandising[obj.name];

			// 	if (obj.assignment != null) {
			// 		this.merchandiseUser.push({
			// 			name: gift.name,
			// 			iconId: gift.iconId,
			// 			status: obj.assignment.status,
			// 			winDate: new Date(obj.time)
			// 		});
			// 	}

			// 	const availableTotal = (obj.total - obj.assigned);

			// 	if (availableTotal > 0)
			// 		if (goalsBarConfig.value >= obj.minrefs)
			// 			text = gift.name;
			// 		else
			// 			text = obj.minrefs + ' ' + this.translate.instant('referred friends to receive a') + '<br>' + gift.name + '<br>(' + availableTotal + ' ' + this.translate.instant('available') + ')';
			// 	else
			// 		text = gift.name;

			// 	goalsBarConfig.goals.push({
			// 		iconId: gift.iconId,
			// 		src: gift.src,
			// 		value: obj.minrefs,
			// 		percentage: obj.minrefs * 100 / max,
			// 		position: 'bottom',
			// 		available: availableTotal > 0,
			// 		unlock: goalsBarConfig.value >= obj.minrefs,
			// 		name: gift.name,
			// 		availableTotal: availableTotal || null,
			// 		tooltip: {
			// 			text: text
			// 		},
			// 		description: {
			// 			text: availableTotal == 0 ? this.translate.instant('ended') : null,
			// 			tooltip: {
			// 				text: obj.assignment != null && availableTotal > 0 ? obj.assignment.status : null
			// 			},
			// 		}
			// 	});
			// });

			//badges (only singleuser)
			const badgesIcons = {
				friend: {
					name: this.translate.instant('Friend Badge'),
					iconId: 'friend',
					src: AppSettings.baseUrl + '/media/badges/small/svg/friend.svg'
				},
				supporter: {
					name: this.translate.instant('Supporter Badge'),
					iconId: 'supporter',
					src: AppSettings.baseUrl + '/media/badges/small/svg/supporter.svg'
				},
				trust: {
					name: this.translate.instant('Trust Badge'),
					iconId: 'trust',
					src: AppSettings.baseUrl + '/media/badges/small/svg/trust.svg'
				},
				donor: {
					name: this.translate.instant('Donor Badge'),
					iconId: 'donor',
					src: AppSettings.baseUrl + '/media/badges/small/svg/donor.svg'
				},
				fundraiser: {
					name: this.translate.instant('Fundraiser Badge'),
					iconId: 'fundraiser',
					src: AppSettings.baseUrl + '/media/badges/small/svg/fundraiser.svg'
				},
				ambassador: {
					name: this.translate.instant('Ambassador Badge'),
					iconId: 'ambassador',
					src: AppSettings.baseUrl + '/media/badges/small/svg/ambassador.svg'
				}
			};

			if (this.user.usertype == 'singleuser') {
				goalsBarConfig.goals.push({
					iconId: badgesIcons.ambassador.iconId,
					src: badgesIcons.ambassador.src,
					value: 2,
					percentage: 2,
					position: 'top',
					available: true,
					unlock: goalsBarConfig.value >= 2,
					name: this.badgesData['ambassador-bronze'].name,
					tooltip: {
						text: (goalsBarConfig.value < 2 ? '2 ' + this.translate.instant('referred friends to receive the') + ' ' : '') + this.badgesData['ambassador-bronze'].name
					},
					href: AppSettings.baseUrl + '/me/badges/ambassador'
				});

				goalsBarConfig.goals.push({
					iconId: badgesIcons.ambassador.iconId,
					src: badgesIcons.ambassador.src,
					value: 20,
					percentage: 20,
					position: 'top',
					available: true,
					unlock: goalsBarConfig.value >= 20,
					name: this.badgesData['ambassador-silver'].name,
					tooltip: {
						text: (goalsBarConfig.value < 20 ? '20 ' + this.translate.instant('referred friends to receive the') + ' ' : '') + this.badgesData['ambassador-silver'].name
					},
					href: AppSettings.baseUrl + '/me/badges/ambassador'
				});

				goalsBarConfig.goals.push({
					iconId: badgesIcons.ambassador.iconId,
					src: badgesIcons.ambassador.src,
					value: 50,
					percentage: 50,
					position: 'top',
					available: true,
					unlock: goalsBarConfig.value >= 50,
					name: this.badgesData['ambassador-gold'].name,
					tooltip: {
						text: (goalsBarConfig.value < 50 ? '50 ' + this.translate.instant('referred friends to receive the') + ' ' : '') + this.badgesData['ambassador-gold'].name
					},
					href: AppSettings.baseUrl + '/me/badges/ambassador'
				});
			}

			goalsBarConfig.goals.sort((g1, g2) => g1.value - g2.value);
			this.goalsBarConfig = { ...goalsBarConfig };
		}).catch((res) => { });
	}
}
