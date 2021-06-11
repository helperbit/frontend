import isAfter from 'date-fns/isAfter';
import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { SocialShareConfig, SocialShareStyle } from '../../../shared/components/social-share/social-share';
import { TranslateService } from '@ngx-translate/core';
import { DonationListConfig } from '../../../shared/components/donation-list/donation-list';
import { UtilsService } from '../../../services/utils';
import { ProjectService, Project } from '../../../models/project';
import { CampaignService, Campaign } from '../campaign.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Donation } from '../../../models/donation';
import { ProgressBarConfig } from '../../../shared/components/progress-bar/progress-bar';
import { CurrencyService } from '../../../services/currency';
import AppSettings from '../../../app.settings';
import { Component, OnInit } from '@angular/core';
import { MoneyPipe } from '../../../shared/filters/money';
import { MoneyToBTCPipe } from '../../../shared/filters/money-to-btc';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { getMediaUrl, getLocalStorage } from 'app/shared/helpers/utils';
import { Event } from 'app/models/event';

@Component({
	selector: 'campaign-component',
	templateUrl: 'campaign.html',
	styleUrls: ['../../../sass/main/custom/page.scss', 'campaign.scss']
})
export class CampaignComponent implements OnInit {
	pageHeader: PageHeaderConfig;
	progressBarConfig: ProgressBarConfig;
	socialShare: {
		config: SocialShareConfig;
		style: SocialShareStyle;
	};
	donations: Donation[];
	isMine: boolean;
	campaign: Campaign;
	listConfig: DonationListConfig;
	project: Project;
	event: Event;
	projectImage: string;
	campaignImage: string;
	ownerImage: string;
	canDonate: boolean;

	constructor(
		private campaignService: CampaignService,
		private projectService: ProjectService,
		private currencyService: CurrencyService,
		private translate: TranslateService,
		private loadingBar: LoadingBarService,
		private utilsService: UtilsService,
		private moneyPipe: MoneyPipe,
		private moneyToBTCPipe: MoneyToBTCPipe,
		private datePipe: DatePipe,
		private route: ActivatedRoute
	) {
		this.pageHeader = {
			info: {
				boxes: []
			}
		};

		this.socialShare = {
			config: {
				title: translate.instant('I started a crowdfunding campaign') + ' \"__TITLE__\" ' + translate.instant('on Helperbit.com'),
				hashtags: [translate.instant('helperbit'), translate.instant('fundraising campaign'), translate.instant('donate')]
			},
			style: {
				type: 'block',
				colored: true
			}
		};

		this.listConfig = {
			type: {
				value: 'campaign',
				object: null
			},
			columnsType: 'donor',
			pagination: true
		};
	}


	donate() {
		(window as any).HBDonateButton.init('project', this.project._id, '', 'flypme,mistralpay', null, true, null, this.route.snapshot.paramMap.get('id'));
		(window as any).HBDonateButton.activate();
	}

	ngOnInit() {
		this.campaignService.get(this.route.snapshot.paramMap.get('id')).subscribe((campaign) => {
			this.campaign = campaign;
			this.listConfig = { ...this.listConfig, ...{ type: { object: this.campaign, value: 'campaign' } } };

			this.socialShare.config = {
				...this.socialShare.config, ...{
					title: this.socialShare.config.title.replace('__TITLE__', this.campaign.title)
				}
			};

			/* Set page headers */
			this.pageHeader.info.boxes.push({
				title: this.moneyPipe.transform(this.moneyToBTCPipe.transform(this.campaign.receivedconverted, this.campaign.currency), 'short', true),
				subTitle: this.translate.instant('received')
			});

			this.pageHeader.info.boxes.push({
				title: String(this.campaign.receiveddonations),
				subTitle: this.translate.instant('supporters')
			});

			this.pageHeader.info.boxes.push({
				title: this.moneyPipe.transform(this.moneyToBTCPipe.transform(this.campaign.target, this.campaign.currency), 'short', true),
				subTitle: this.translate.instant('target')
			});

			this.pageHeader.info.boxes.push({
				title: this.datePipe.transform(this.campaign.end, 'shortDate'),
				subTitle: this.translate.instant('end date')
			});

			this.currencyService.onCurrencyChange.subscribe(_ => {
				this.pageHeader.info.boxes[0].title = this.moneyPipe.transform(this.moneyToBTCPipe.transform(this.campaign.receivedconverted, this.campaign.currency), 'short', true);
				this.pageHeader.info.boxes[2].title = this.moneyPipe.transform(this.moneyToBTCPipe.transform(this.campaign.target, this.campaign.currency), 'short', true);
			});

			this.campaignImage = this.campaign.media != null ? getMediaUrl(this.campaign.media, 'image', 400) : AppSettings.media.coverflow.campaign;
			this.ownerImage = getMediaUrl(this.campaign.owner, 'avatar'); // : AppSettings.media.avatar.singleuser.notDeclared;
			this.canDonate = isAfter(new Date(this.campaign.end), new Date());

			this.progressBarConfig = this.campaignService.createProgressBarConfig(this.campaign);

			if (getLocalStorage().getItem('username') == this.campaign.owner)
				this.isMine = true;

			if (this.route.snapshot.queryParamMap.has('donate') && this.campaign.end == null)
				this.donate();

			this.projectService.get(this.campaign.resource).subscribe((project) => {
				this.project = project;
				this.projectImage = this.project.media.length != 0 ? getMediaUrl(this.project.media[0], 'image', 400) : AppSettings.media.avatar.project;

				/* Set meta tag */

				this.utilsService.setMeta(
					this.translate.instant('Fundraising Campaign') + ': ' + this.campaign.title,
					this.campaign.description,
					this.campaign.media != null ? this.projectImage : AppSettings.urls.public.media + this.campaign.media
				);
			});
		}, res => {
			// if (res.error.error == 'E2')
			// 	this.cfpLoadingBar.error('E2', this.$routeParams['id']);
		});
	}
}

