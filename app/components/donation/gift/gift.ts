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

import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { TranslateService } from '@ngx-translate/core';
import { ProjectService, Project } from '../../../models/project';
import { DonationService, Donation, DonationGift } from '../../../models/donation';
import { UtilsService } from '../../../services/utils';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getMediaUrl, getLocalStorage } from 'app/shared/helpers/utils';


/* Donation controller */
@Component({
	selector: 'donation-gift-component',
	templateUrl: 'gift.html',
	styleUrls: ['../../../sass/main/custom/page.scss', 'gift.scss']
})
export class DonationGiftComponent implements OnInit {
	pageHeader: PageHeaderConfig;
	donation: Donation & DonationGift;
	project: Project;
	projects: { [id: string]: Project };
	username: string;
	projectImage: string;

	constructor(
		private translate: TranslateService,
		private donationService: DonationService,
		private projectService: ProjectService,
		private route: ActivatedRoute,
		private utilsService: UtilsService
	) {
		this.donation = null;
		this.project = null;
		this.projects = {};
	}

	ngOnInit() {
		const txid = this.route.snapshot.paramMap.get('txid');
		this.username = getLocalStorage().getItem('username');
		this.pageHeader = {
			description: {
				title: this.translate.instant('gift donation'),
				subTitle: txid
			}
		};

		this.donationService.getGiftDonation(txid, this.route.snapshot.queryParamMap.get('token')).subscribe((donation) => {
			this.donation = donation;

			this.utilsService.setMeta(
				this.translate.instant('Donation') + ': ' + this.donation.txid,
				this.translate.instant('Donation of {{value}} BTC; click to view more details.', { value: this.donation.value })
			);

			for (let i = 0; i < this.donation.to.length; i++) {
				if (this.donation.to[i].project) {
					this.projectService.get(this.donation.to[i].project).subscribe((project) => {
						this.projects[project._id] = project;
						this.project = project;
						this.projectImage = getMediaUrl(this.project.media[0], 'image', 400);
					});
				}
			}
		});
	}
}
