import * as $ from 'jquery';
import { BrowserHelperService } from '../../../services/browser-helper';
import { ResponseMessageConfig, buildErrorResponseMessage } from '../../../shared/components/response-messages/response-messages';
import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { ModalsConfig } from '../../../shared/components/modal/oldModal/modal';
import { InfoBoxConfig } from '../../../shared/components/info-box/info-box';
import { SocialShareStyle, SocialShareConfig } from '../../../shared/components/social-share/social-share';
import { TranslateService } from '@ngx-translate/core';
import { CampaignService, Campaign } from '../campaign.service';
import { ProgressBarConfig } from '../../../shared/components/progress-bar/progress-bar';
import { DashboardService, UserPrivate } from '../../../models/dashboard';
import AppSettings from '../../../app.settings';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RowStyle, RowStyleObject } from 'app/models/common';


@Component({
	selector: 'campaign-create-component',
	templateUrl: 'create.html',
	styleUrls: ['../../../sass/main/custom/page.scss', 'create.scss']
})
export class CampaignCreateComponent implements OnInit {
	responseMessage: ResponseMessageConfig;
	pageHeader: PageHeaderConfig;
	modals: ModalsConfig;
	infoBox: InfoBoxConfig;
	socialShare: { style: SocialShareStyle; config: SocialShareConfig };
	tableHeadColumns: any;
	tableHeadColumnsList: string[];
	currentResolution: string;

	user: UserPrivate;
	campaigns: (Campaign & { socialShare?: any; progressBarConfig?: ProgressBarConfig })[];
	canCreateCampaign: boolean;
	campaignsRowStyle: RowStyleObject;

	constructor(
		private campaignService: CampaignService, 
		private router: Router,
		private dashboardService: DashboardService, 
		private translate: TranslateService, 
		browserHelperService: BrowserHelperService
	) {
		this.currentResolution = browserHelperService.currentResolution;
		this.responseMessage = null;
		this.pageHeader = {
			description: {
				title: translate.instant('Fundraising Campaign'),
				subTitle: translate.instant('Create or edit a fundraising campaign')
			}
		};
		this.modals = {
			confirm: {
				id: 'modalConfirm',
				modalClass: 'modal-md',
				hideCloseButton: true,
				title: null,
				confirm: {
					method: null,
					parameters: null,
					description: null
				}
			}
		};

		this.infoBox = {
			title: translate.instant('What is a fundraising campaign?'),
			transclude: true

		};

		this.socialShare = {
			config: {
				title: translate.instant('I started a crowdfunding campaign') + ' \"__TITLE__\" ' + translate.instant('on Helperbit.com'),
				hashtags: [translate.instant('helperbit'), translate.instant('fundraising campaign'), translate.instant('donate')],
				url: AppSettings.urls.public.campaign
			},
			style: {
				colored: true
			}
		};

		this.tableHeadColumnsList = ['title', 'status', 'donations', 'end', 'social', 'actions']
		this.tableHeadColumns = {
			'title': {
				label: translate.instant('Title'),
				show: true,
				class: 'text-center text-ellipsis',
				style: { 'width': '20%' }
			},
			'status': {
				label: translate.instant('Status'),
				show: true,
				class: 'text-center',
				style: { 'width': '15%' }
			},
			'donations': {
				label: browserHelperService.currentResolution != 'xs' ? translate.instant('Donations Received') : translate.instant('Received'),
				show: true,
				class: 'text-center',
				style: { 'width': '20%' }
			},
			'end': {
				label: translate.instant('End Date'),
				show: true,
				class: 'text-center hidden-xs',
				style: { 'width': browserHelperService.currentResolution != 'xs' ? '10%' : 'auto' }
			},
			'social': {
				label: translate.instant('Share'),
				show: true,
				class: 'text-center hidden-xs',
				style: { 'width': browserHelperService.currentResolution != 'xs' ? '15%' : 'auto' }
			},
			'actions': {
				label: translate.instant('Actions'),
				show: true,
				class: 'text-center',
				style: { 'width': '20%' }
			}
		};

		this.campaignsRowStyle = {};
	}

	initCampaigns() {
		this.responseMessage = null;

		this.campaignService.getMyCampaigns().subscribe((campaigns: Campaign[]) => {
			this.campaigns = campaigns;

			this.campaigns.forEach(campaign => {
				this.setRowStyle(campaign);

				campaign.socialShare = {};
				
				campaign.socialShare.config = {
					title: this.socialShare.config.title.replace('__TITLE__', campaign.title),
					hashtags: this.socialShare.config.hashtags,
					url: this.socialShare.config.url + campaign._id
				};
				campaign.progressBarConfig = this.campaignService.createProgressBarConfig(campaign);
			});

			this.canCreateCampaign = this.campaigns.filter(c => c.status == 'started').length == 0;
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.error);
		});
	}

	showModal(id) {
		$('#' + id).modal('show');
		$('#' + id).on('hide.bs.modal', e => {
			this.initCampaigns();
		});
		$('#' + id).on('hidden.bs.modal', e => {
			//cancella gli eventi associata alla modal
			$('#' + id).unbind();
		});
	}



	setRowStyle(campaign: Campaign): void {
		const style: RowStyle = {
			status: {
				class: {
					label: null,
					icon: null
				},
				text: null
			},
			buttons: null
		};

		if (campaign.status == 'started')
			style.status = { class: { label: 'label-success', icon: 'fa-check' }, text: this.translate.instant('Started') };
		else if (campaign.status == 'concluded')
			style.status = { class: { label: 'label-info', icon: 'fa-flag' }, text: this.translate.instant('Closed') };
		else // if (campaign.status == 'draft')
			style.status = { class: { label: 'label-default', icon: 'fa-pencil-square-o' }, text: this.translate.instant('Draft') };


		style.buttons = [
			{
				text: this.translate.instant('Go to'),
				class: 'btn-info',
				icon: {
					class: 'fa-eye'
				},
				tooltip: this.translate.instant('Click to go to this fundraising campaign.'),
				show: true,
				click: campaign => this.goToCampaign(campaign)
			},
			{
				text: this.translate.instant('Edit'),
				class: 'btn-default',
				icon: {
					class: 'fa-pencil'
				},
				tooltip: this.translate.instant('Click to edit this fundraising campaign.'),
				show: campaign.status != 'concluded',
				click: project => this.editCampaign(project)
			},
			{
				text: this.translate.instant('Delete'),
				class: 'btn-danger',
				icon: {
					class: 'fa-trash'
				},
				tooltip: this.translate.instant('Click to delete this fundraising campaign.'),
				show: campaign.receiveddonations == 0 && campaign.status != 'concluded',
				click: campaign => this.openConfirmDeleteCampaign(campaign)
			}
		];

		this.campaignsRowStyle[campaign._id] = style;
	}

	newCampaign() {
		this.router.navigateByUrl('/campaign/new/edit');
	}

	editCampaign(campaign) {
		this.router.navigateByUrl('/campaign/' + campaign._id + '/edit');
	}

	openConfirmDeleteCampaign(campaign) {
		this.modals.confirm.confirm.method = campaign => this.deleteCampaign(campaign);
		this.modals.confirm.confirm.parameters = [campaign];
		this.modals.confirm.title = this.translate.instant('Confirm delete campaign');
		this.modals.confirm.confirm.description = this.translate.instant('Are you sure to delete') + ' ' + campaign.title + ' ' + this.translate.instant('campaign?');
		this.showModal(this.modals.confirm.id);
	}

	deleteCampaign(campaign) {
		this.responseMessage = null;

		this.campaignService.delete(campaign._id).subscribe(_ => {
			this.initCampaigns();
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.error);
		});
	}

	goToCampaign(campaign) {
		this.router.navigateByUrl('/campaign/' + campaign._id);
	}

	ngOnInit() {
		/* Init user */
		this.responseMessage = null;

		this.dashboardService.get().subscribe(user => {
			this.user = user;
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.error);
		});

		this.initCampaigns();
	}
}

