import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { DashboardService, UserVerify, UserPrivate, AdminList } from '../../../models/dashboard';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { interpolateString } from 'app/shared/helpers/utils';
import { UserService } from 'app/models/user';

@Component({
	selector: 'me-admin-component',
	templateUrl: 'admin.html',
	styleUrls: ['../../../sass/main/custom/page.scss', 'admin.scss']
})
export class MeAdminComponent implements OnInit {
	pageHeader: PageHeaderConfig;
	admins: {
		firstname: string;
		lastname: string;
		email: string;
		status: 'none' | 'signed' | 'verified';
		tooltip: string;
	}[];

	constructor(
		private dashboardService: DashboardService,
		private translate: TranslateService
	) {
		this.pageHeader = {
			description: {
				title: translate.instant('administrators'),
				subTitle: translate.instant('Manage non-profit administrators')
			}
		};
	}

	update() {
		this.dashboardService.getAdminList().subscribe((adminList: AdminList) => {
			this.dashboardService.getVerify().subscribe((data: UserVerify) => {
				if (data.verification.filter(v => v.provider == 'npoadmins').length != 1)
					return;

				const adminVerify = data.verification.filter(v => v.provider == 'npoadmins')[0];
				const admins = adminVerify.info.admins;
				this.admins = [];


				for (let admin of admins) {
					const newAdmin = admin;
					if (adminList.admins.indexOf(admin.email) != -1) {
						const adminuser = adminList.adminsusers.filter(a => a.email == admin.email)[0];

						if (adminuser.trustlevel >= 25) {
							newAdmin.status = 'verified';
							newAdmin.tooltip = this.translate.instant('Completed!');
						} else {
							newAdmin.status = 'signed';
							newAdmin.tooltip = interpolateString(
								this.translate.instant('The admin {{firstname}} {{lastname}} should complete the ID verification!'), newAdmin);	
						}
						this.admins.push(newAdmin);
					} else {
						newAdmin.status = 'none';
						newAdmin.tooltip = interpolateString(
							this.translate.instant('The admin {{firstname}} {{lastname}} should register as single user on Helperbit using the email {{email}} and should complete the ID verification'), newAdmin);
						this.admins.push(newAdmin);
					}
				}
			});
		});
	}

	ngOnInit() {
		this.update();
	}
}
