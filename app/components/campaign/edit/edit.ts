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

import { UtilsService } from 'app/services/utils';
import addMonths from 'date-fns/addMonths';
import addDays from 'date-fns/addDays';
import { PageHeaderConfig } from 'app/shared/components/page-header/page-header';
import { buildErrorResponseMessage } from '../../../shared/components/response-messages/response-messages';
import { SocialShareConfig, SocialShareStyle } from 'app/shared/components/social-share/social-share';
import { ProjectService, Project } from '../../../models/project';
import { CampaignService, Campaign } from '../campaign.service';
import { DashboardService, UserPrivate } from '../../../models/dashboard';
import { ProgressBarConfig } from '../../../shared/components/progress-bar/progress-bar';
import AppSettings from '../../../app.settings';
import { Observable, forkJoin } from 'rxjs';
import { getMediaUrl, getLocalStorage } from 'app/shared/helpers/utils';
import { Component, ViewChild, OnInit } from '@angular/core';
import { WizardComponent } from 'angular-archwizard';
import { NgWizardStep } from 'app/shared/helpers/ng-wizard-step';
import { DropzoneFile } from 'app/shared/components/dropzone/dropzone';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { FileCustom } from 'app/shared/types/input-file';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { getDateSelectorModelFromDate, InputSelectDateNumber, getDateFromDateSelectorModel } from 'app/shared/components/date-selector/date-selector';
import { Tags } from 'app/models/common';

@Component({
	selector: 'me-edit-campaign-component',
	templateUrl: 'edit.html',
	styleUrls: ['../../../sass/main/custom/page.scss', 'edit.scss']
})
export class CampaignEditComponent implements OnInit {
	public wizardHandler: WizardComponent;

	@ViewChild(WizardComponent) set contentMulti(content: WizardComponent) {
		this.wizardHandler = content;

		this.wizard.step1.setHandler(this.wizardHandler);
		this.wizard.step2.setHandler(this.wizardHandler);
		this.wizard.step3.setHandler(this.wizardHandler);
		this.wizard.step4.setHandler(this.wizardHandler);
	};

	wizard: {
		step1: NgWizardStep<{
			title: string;
			description: string;
			target: number;
			currency: string;
			endDate: InputSelectDateNumber;
			project: {
				id: string;
				title: string;
				imgUrl: string;
				href: string;
				progressBarConfig: ProgressBarConfig;
			};
		}>;
		step2: NgWizardStep<{
			mediasDefault: string[];
			media: DropzoneFile[];
		}>;
		step3: NgWizardStep<any>;
		step4: NgWizardStep<any>;
	};

	editMode: boolean;
	pageHeader: PageHeaderConfig;
	campaign: Campaign;
	campaignId: string;
	user: UserPrivate;
	media: {
		toAdd: DropzoneFile[];
		toDelete: DropzoneFile[];
	};
	socialShare: {
		config: SocialShareConfig;
		style: SocialShareStyle;
	};

	constructor(
		private campaignService: CampaignService, 
		private projectService: ProjectService, 
		private dashboardService: DashboardService, 
		private translate: TranslateService,
		private utilsService: UtilsService,
		private route: ActivatedRoute
	) {
		this.pageHeader = {
			description: {
				title: this.translate.instant('New campaign'),
				subTitle: this.translate.instant('Create a campaign')
			}
		};

		this.user = null;
		this.campaign = null;
		this.editMode = false;
		this.media = { toAdd: [], toDelete: [] };
		this.socialShare = {
			config: {
				title: this.translate.instant('I started a crowdfunding campaign') + ' \"__TITLE__\" ' + this.translate.instant('on Helperbit.com'),
				hashtags: [this.translate.instant('helperbit'), this.translate.instant('fundraising campaign'), this.translate.instant('donate')],
				url: AppSettings.urls.public.campaign
			},
			style: {
				type: 'circle',
				colored: true,
				size: 2
			}
		};

		/* FORMS */

		this.wizard = { step1: null, step2: null, step3: null, step4: null };

		//STEP 1

		this.wizard.step1 = new NgWizardStep();

		this.wizard.step1.initializeModel({
			title: null,
			description: null,
			target: 1000,
			currency: 'EUR',
			endDate: null,
			project: null
		});

		this.wizard.step1.setTitles({
			main: this.translate.instant('Info'),
			heading: this.translate.instant('Describe your fundraising campaign')
		});

		//title
		this.wizard.step1.addField({
			type: 'input',
			key: 'title',
			templateOptions: {
				type: 'text',
				label: this.translate.instant('Title'),
				placeholder: this.translate.instant('Paolo Rossi Birthday Fundraising...'),
				required: true,
				minLength: AppSettings.form.length.min.campaign.title
			}
		});

		//description
		this.wizard.step1.addField({
			type: 'textarea',
			key: 'description',
			templateOptions: {
				label: this.translate.instant('Description'),
				placeholder: this.translate.instant('For my birthday i want organise this fundraising for the project...'),
				required: true,
				minLength: AppSettings.form.length.min.campaign.description
			}
		});

		//target
		this.wizard.step1.addField({
			type: 'input',
			key: 'target',
			className: 'col-lg-8 col-md-8 col-sm-12 col-xs-12',
			templateOptions: {
				type: 'number',
				label: this.translate.instant('Target'),
				helperTooltip: {
					content: this.translate.instant('Define the amount you would like to reach with this campaign')
				},
				required: true,
				min: 0.001
			}
		});

		//currency
		const buttonsGroupOptions = this.utilsService.buttonsGroupOptions();

		this.wizard.step1.addField({
			type: 'buttonsGroup',
			key: 'currency',
			className: 'col-lg-4 col-md-4 col-sm-12 col-xs-12',
			templateOptions: {
				label: this.translate.instant('Currency'),
				required: true,
				config: {
					options: buttonsGroupOptions.fiatCurrency.concat([buttonsGroupOptions.btcCurrency[0]]),
					fullSize: true
				}
			}
		});

		//endDate
		this.wizard.step1.addField({
			type: 'dateSelector',
			key: 'endDate',
			className: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
			templateOptions: {
				label: this.translate.instant('End Date'),
				required: true,
				helperTooltip: {
					content: this.translate.instant('Select when your campaign will end, the campaign could not be longer than one month')
				},
				maxDate: addMonths(new Date(), 1),
				minDate: addDays(new Date(), 1)
			}
		});

		//project
		this.wizard.step1.addField({
			type: 'chooseElements',
			key: 'project',
			className: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
			templateOptions: {
				label: this.translate.instant('Project'),
				required: true,
				helperTooltip: {
					content: this.translate.instant('Select the project that you want to sustain with your campaign')
				},
				config: {
					buttonText: this.translate.instant('Choose a project'),
					selectedText: this.translate.instant('Project selected:'),
					fullScreen: true,
					title: this.translate.instant('Choose a project'),
					description: this.translate.instant('Click an image to select a project. Check project info by clicking on project name.'),
					type: 'project',
					elements: []
				}
			}
		});

		//STEP 2

		this.wizard.step2 = new NgWizardStep();

		this.wizard.step2.initializeModel({
			mediasDefault: [],
			media: []
		});

		this.wizard.step2.setTitles({
			main: this.translate.instant('Media'),
			heading: this.translate.instant('Insert the media of your fundraising campaign'),
			description: this.translate.instant('Upload photos and images linked with your fundraising campaign. Media materials generate powerful emotional reactions in donors and improve your fundraising. You can upload a cover image for your fundraising campaign. Choose between a default image or upload a custom one.')
		});

		//project
		const campaignEvents = {
			'anniversary': {
				name: this.translate.instant('Anniversary'),
				iconId: 'champagne',
				src: AppSettings.baseUrl + '/media/campaign-events/svg/champagne.svg',
				srcPattern: AppSettings.baseUrl + '/media/campaign-events/patterns/champagne-pattern.png',
			},
			'birthday': {
				name: this.translate.instant('Birthday'),
				iconId: 'cake',
				src: AppSettings.baseUrl + '/media/campaign-events/svg/cake.svg',
				srcPattern: AppSettings.baseUrl + '/media/campaign-events/patterns/cake-pattern.png',
			},
			'christmas': {
				name: this.translate.instant('Christmas'),
				iconId: 'christmas',
				src: AppSettings.baseUrl + '/media/campaign-events/svg/christmas.svg',
				srcPattern: AppSettings.baseUrl + '/media/campaign-events/patterns/christmas-pattern.png',
			},
			'degree': {
				name: this.translate.instant('Degree'),
				iconId: 'diploma',
				src: AppSettings.baseUrl + '/media/campaign-events/svg/diploma.svg',
				srcPattern: AppSettings.baseUrl + '/media/campaign-events/patterns/diploma-pattern.png',
			},
			'wedding': {
				name: this.translate.instant('Wedding'),
				iconId: 'wedding',
				src: AppSettings.baseUrl + '/media/campaign-events/svg/wedding.svg',
				srcPattern: AppSettings.baseUrl + '/media/campaign-events/patterns/wedding-pattern.png',
			}
		};

		//mediasDefault
		this.wizard.step2.addField({
			type: 'tagsButtons',
			key: 'mediasDefault',
			className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center',
			hooks: {
				onInit: (field: FormlyFieldConfig) => {
					field.formControl.valueChanges.subscribe((value: Tags[]) => {	
						if (field.model[field.key].length > 0) {
							const eventInfo = campaignEvents[field.model[field.key][0]];

							this.utilsService.getFileFromUrl({ url: eventInfo.srcPattern, fileName: 'default-campaign-media' }).subscribe((media: FileCustom) => {
								setTimeout(() => this.wizard.step2.setModelField('media', [media]), 0);
							}, res => {
								this.wizard.step2.setResponse('error', buildErrorResponseMessage(res.error));
							});
						}
					});
				}
			},
			templateOptions: {
				label: this.translate.instant('Default Campaign Image Cover'),
				required: false,
				config: {
					tagsAvailable: campaignEvents,
					onlyOne: true
				}
			}
		});

		//label
		this.wizard.step2.addField({
			type: 'fieldLabel',
			className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-top-bottom-10 text-center',
			templateOptions: {
				label: this.translate.instant('Or')
			}
		});

		//media
		this.wizard.step2.addField({
			type: 'dropzone',
			key: 'media',
			className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center',
			templateOptions: {
				label: this.translate.instant('Custom Campaign Image Cover'),
				required: false,
				config: {
					exts: AppSettings.form.exts,
					maxSize: AppSettings.form.fileSize.media.max,
					maxFiles: 1,
					description: this.translate.instant('Insert your campaign media'),
					onAdd: (file: DropzoneFile) => {
						//only files without an id can be added
						if (!file.id)
							this.media.toAdd.push(file);
					},
					onDelete: (file: DropzoneFile) => {
						//only files with an id can be removed
						if (file.id)
							this.media.toDelete.push(file);
						else {
							const i = this.media.toAdd.indexOf(file);
							if (i != -1)
								this.media.toAdd.splice(i, 1);
						}
					}
				}
			}
		});

		//STEP 3

		this.wizard.step3 = new NgWizardStep();

		this.wizard.step3.setTitles({
			main: this.translate.instant('Share'),
			heading: this.translate.instant('Share with your friends!')
		});

		//FINISH

		this.wizard.step4 = NgWizardStep.createFinishStep(this.translate);
	}

	ngOnInit() {
		this.dashboardService.get().subscribe(user => {
			this.user = user;

			const hasParamId = this.route.snapshot.paramMap.has('id');

			this.projectService.getAll().subscribe((projects: Project[]) => {
				//EDIT MODE
				if (hasParamId && this.route.snapshot.paramMap.get('id') != 'new') {
					this.editMode = true;
					this.campaignId = this.route.snapshot.paramMap.get('id');

					//SET EDIT MODE
					//STEP 1

					this.wizard.step1.getField('target').templateOptions.disabled = true;
					this.wizard.step1.getField('currency').templateOptions.disabled = true;
					this.wizard.step1.getField('endDate').templateOptions.disabled = true;
					this.wizard.step1.getField('project').templateOptions.disabled = true;

					//END SET EDIT MODE

					this.campaignService.get(this.campaignId).subscribe(campaign => {
						this.campaign = campaign;

						this.pageHeader = {
							description: {
								title: this.translate.instant('Edit campaign'),
								subTitle: '"' + this.utilsService.getSString(this.campaign.title) + '"'
							}
						};

						this.projectService.get(this.campaign.resource).subscribe(project => {
							//step 1
							this.wizard.step1.initializeModel({
								title: this.campaign.title,
								description: this.campaign.description,
								target: this.campaign.target,
								currency: this.campaign.currency,
								endDate: getDateSelectorModelFromDate(new Date(this.campaign.end)),
								project: {
									id: project._id,
									title: this.utilsService.getSString(project.title),
									imgUrl: project.media[0] ? getMediaUrl(project.media[0]) : '/media/avatar_empty_org.png',
									href: '/project/' + project._id,
									progressBarConfig: this.projectService.createProgressBarConfig(project)
								}
							});

							//step 2
							if (this.campaign.media) {
								const url = getMediaUrl(this.campaign.media + '?token=' + getLocalStorage().getItem('token'));

								this.utilsService.getFileFromUrl({ url: url, id: this.campaign.media, fileName: 'campaign-media-' + this.campaign.media }).subscribe((media: FileCustom) => {
									this.wizard.step2.setModelField('media', [media]);
								}, res => {
									this.wizard.step2.setResponse('error', buildErrorResponseMessage(res.error));					
								});
							}
						}, res => {
							this.wizard.step2.setResponse('error', buildErrorResponseMessage(res.error));
						});
					});
				}
				else
					this.editMode = false;
					
				this.wizard.step1.getField('project').templateOptions.config.elements = projects
					.filter((project: Project) => project.status == 'approved' && project.end == null)
					.map((project: Project) => {
						return {
							id: project._id,
							title: this.utilsService.getSString(project.title),
							imgUrl: project.media[0] ? getMediaUrl(project.media[0]) : '/media/avatar_empty_org.png',
							href: '/project/' + project._id,
							progressBarConfig: this.projectService.createProgressBarConfig(project)
						};
					});
			}, res => {
				this.wizard.step1.setResponse('error', buildErrorResponseMessage(res.error));
			});
		}, res => {
			this.wizard.step1.setResponse('error', buildErrorResponseMessage(res.error));
		});
	}

	sendCampaignInformation() {
		this.wizard.step1.resetResponse();

		this.socialShare.config = {
			title: this.translate.instant('I started a crowdfunding campaign') + ' \"__TITLE__\" ' + this.translate.instant('on Helperbit.com'),
			hashtags: [this.translate.instant('helperbit'), this.translate.instant('fundraising campaign'), this.translate.instant('donate')],
			url: AppSettings.urls.public.campaign
		};

		const json: any = {
			type: 'project',
			title: this.wizard.step1.model.title,
			description: this.wizard.step1.model.description
		};
		
		if (!this.editMode) {
			json.target = this.wizard.step1.model.target;
			json.currency = this.wizard.step1.model.currency;
			json.end = getDateFromDateSelectorModel(this.wizard.step1.model.endDate).toJSON();
			json.resource = this.wizard.step1.model.project.id;
		}


		if (this.campaignId)
			this.campaignService.edit(this.campaignId, json).subscribe(_ => {
				this.socialShare.config = {...this.socialShare.config, ...{
					title: this.socialShare.config.title.replace('__TITLE__', json.title),
					url: this.socialShare.config.url + this.campaignId
				}};

				this.wizardHandler.goToNextStep();
			}, res => {
				this.wizard.step1.setResponse('error', buildErrorResponseMessage(res.error));
			});
		else
			this.campaignService.create(json).subscribe(data => {
				this.campaignId = data.id;

				this.socialShare.config = {
					...this.socialShare.config, ...{
						title: this.socialShare.config.title.replace('__TITLE__', json.title),
						url: this.socialShare.config.url + this.campaignId
					}
				};

				this.wizardHandler.goToNextStep();
			}, res => {
				this.wizard.step1.setResponse('error', buildErrorResponseMessage(res.error));
			});
	}

	sendCampaignMedia() {
		this.wizard.step2.resetResponse();

		const promisesRemoveMedia: Observable<void>[] = this.media.toDelete.map((file: DropzoneFile) => this.campaignService.removeMedia(this.campaignId));
		const promisesAddMedia: Observable<void>[] = this.media.toAdd.map((file: DropzoneFile) => this.campaignService.uploadMedia(this.campaignId, file.file));

		const promises = promisesRemoveMedia.concat(promisesAddMedia);

		if(promises.length > 0) {
			forkJoin(promises).subscribe(_ => {
				this.media.toDelete = [];
				this.media.toAdd = [];

				this.wizardHandler.goToNextStep();
			}, res => {
				this.wizard.step2.setResponse('error', buildErrorResponseMessage(res.error));
			});

			this.campaignService.get(this.campaignId).subscribe(campaign => {
				this.campaign = campaign;
			}, res => {
				this.wizard.step2.setResponse('error', buildErrorResponseMessage(res.error));
			});
		}
		else
			this.wizardHandler.goToNextStep();
	}
}
