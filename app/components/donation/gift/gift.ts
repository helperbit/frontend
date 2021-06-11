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
