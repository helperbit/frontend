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
import { PageHeaderConfig } from "../../../shared/components/page-header/page-header";
import { ProjectService, Project } from "../../../models/project";
import { UserService } from "../../../models/user";
import { DonationService, Donation } from "../../../models/donation";
import { EventService, Event } from "../../../models/event";
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UtilsService } from '../../../services/utils';
import { interpolateString, getLocalStorage } from '../../../shared/helpers/utils';

/* Donation controller */
@Component({
	selector: 'donation-component',
	templateUrl: 'donation.html',
	styleUrls: ['../../../sass/main/custom/page.scss', 'donation.scss']
})
export class DonationComponent implements OnInit {
	username: string;
	donation: Donation;
	event: Event;
	project: Project;
	projects: { [id: string]: Project };
	invoice: { enabled: boolean };
	pageHeader: PageHeaderConfig;

	constructor(
		private donationService: DonationService, 
		private userService: UserService, 
		private projectService: ProjectService, 
		private translate: TranslateService, 
		private route: ActivatedRoute,
		private eventService: EventService, 
		private utilsService: UtilsService
	) {
		this.donation = null;
		this.event = null;
		this.project = null;
		this.projects = {};
		this.invoice = { enabled: false };
	}

	loadDonation(params: Params) {
		const txid = params.txid;
		this.donationService.get(txid).subscribe(donation => {
			this.donation = donation;

			this.pageHeader = {
				description: {
					title: this.translate.instant('donation'),
					subTitle: this.donation.txid
				}
			};

			this.utilsService.setMeta(
				this.translate.instant('Donation') + ': ' + this.donation.txid,
				interpolateString(this.translate.instant('Donation of {{value}} BTC; click to view more details.'), { value: String(this.donation.value) })
			);

			if (this.donation.event) {
				this.eventService.get(this.donation.event).subscribe((event) => {
					this.event = event;
				});
			}

			if (this.donation.from) {
				this.userService.get(this.donation.from).subscribe(user => {
					if (user.usertype != 'npo' && user.usertype != 'company')
						return;

					for (let i = 0; i < this.donation.to.length; i++) {
						if (this.donation.to[i].type == 'npo' && this.donation.to[i].user == this.username) {
							this.invoice.enabled = true;
						}
					}
				});
			}

			for (let i = 0; i < this.donation.to.length; i++) {
				if (this.donation.to[i].project) {
					this.projectService.get(this.donation.to[i].project).subscribe((project) => {
						this.projects[project._id] = project;
					});
				}
			}
		});
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.username = getLocalStorage().getItem('username');
			this.loadDonation(params);
		});
	}
}
