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
import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { DashboardService, UserPrivate } from '../../../models/dashboard';
import { Component, OnInit } from '@angular/core';
import { FormGroupEx } from '../../../shared/ngx-formly/form-group-ex';


@Component({
	selector: 'privacy-component',
	templateUrl: 'privacy.html',
	styleUrls: ['../../../sass/main/custom/page.scss']
})
export class MePrivacyComponent implements OnInit {
	pageHeader: PageHeaderConfig;
	toggles: any;

	form: FormGroupEx<{
		firstname?: boolean;
		lastname?: boolean;
		birthdate?: boolean;
		country?: boolean;
		website?: boolean;
		mobile?: boolean;
		gender?: boolean;
	}>;
	title: { main: string; heading: string };

	constructor(private dashboardService: DashboardService, translate: TranslateService) {
		this.pageHeader = {
			description: {
				title: translate.instant('Privacy'),
				subTitle: translate.instant('Edit your privacy information')
			}
		};

		this.title = {
			main: translate.instant('Toggle the fields to show in your public page'),
			heading: translate.instant('Complete all fields')
		};

		this.toggles = {
			'firstname': { label: translate.instant('First Name'), show: false },
			'lastname': { label: translate.instant('Last Name'), show: false },
			'birthdate': { label: translate.instant('Birth date'), show: false },
			'country': { label: translate.instant('Country'), show: false },
			'website': { label: translate.instant('Website'), show: false },
			'mobile': { label: translate.instant('Mobile Phone'), show: false },
			'gender': { label: translate.instant('Gender'), show: false },
		};

		this.form = new FormGroupEx();

		for(const key in this.toggles)
			this.form.model[key] = false;
	}

	send() {
		this.dashboardService.edit({
			publicfields: $.map(this.form.model, (v, i) => { return { key: i, show: v }; }).filter(f => f.show).map(t => t.key)
		}).subscribe(res => { });
	}

	ngOnInit() {
		for (const key in this.toggles) {
			this.form.addField({
				className: 'col-lg-4 col-md-4 col-sm-4 col-xs-6',
				key: key,
				type: 'toggleSwitch',
				templateOptions: {
					text: this.toggles[key].label,
					change: (event) => { this.send(); }
				}
			});
		}

		this.dashboardService.get().subscribe((user: UserPrivate) => {
			user.publicfields.forEach(f => {
				this.form.model[f] = true;
				this.toggles[f].show = true;
			});
			this.form.model = { ...this.form.model };
		});
	}
}