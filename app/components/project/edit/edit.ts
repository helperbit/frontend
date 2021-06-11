import { UtilsService } from '../../.././../app/services/utils';
import { PageHeaderConfig } from 'app/shared/components/page-header/page-header';
import { buildErrorResponseMessage, ResponseMessageConfig } from '../../../shared/components/response-messages/response-messages';
import { ModalsConfig } from '../../../shared/components/modal/oldModal/modal';
import { ProjectService, ProjectActivity, Project } from '../../../models/project';
import { TString, Tags } from '../../../models/common';
import { WalletService, Wallet } from '../../../models/wallet';
import { DashboardService, UserPrivate } from '../../../models/dashboard';
import AppSettings from '../../../app.settings';
import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { WizardComponent } from 'angular-archwizard';
import { NgWizardStep } from 'app/shared/helpers/ng-wizard-step';
import { DropzoneFile } from 'app/shared/components/dropzone/dropzone';
import { TagsChipsOption } from 'app/shared/ngx-formly/fields/tags/tags';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { openModal } from 'app/shared/components/modal/modal';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, Observer } from 'rxjs';
import { FileCustom } from 'app/shared/types/input-file';
import { openModalProjectActivity } from './activity/activity';
import { getLocalStorage, getMediaUrl } from 'app/shared/helpers/utils';

const countryDict = require('../../../assets/data/country.json');

@Component({
	selector: 'me-edit-project-component',
	templateUrl: 'edit.html',
	styleUrls: ['../../../sass/main/custom/page.scss', 'edit.scss']
})
export class EditProjectComponent implements OnInit {
	private firstLoad: boolean = true;
	public wizardHandler: WizardComponent;

	// public defaultInvalidMediaError: ResponseMessageConfig = buildErrorResponseMessage({ error: 'EM6' });

	@ViewChild(WizardComponent) set contentMulti(content: WizardComponent) {
		this.wizardHandler = content;

		this.wizard.step1.setHandler(this.wizardHandler);
		this.wizard.step2.setHandler(this.wizardHandler);
		this.wizard.step3.setHandler(this.wizardHandler);
		this.wizard.step4.setHandler(this.wizardHandler);
		this.wizard.step5.setHandler(this.wizardHandler);
		this.wizard.step6.setHandler(this.wizardHandler);

		// If the project is approved, go to activity step
		// does not work
		setTimeout(() => {
			if (this.project && this.project.status == 'approved' && this.firstLoad) {
				this.firstLoad = false;
				this.wizardHandler.goToNextStep();

				setTimeout(() => this.wizardHandler.goToNextStep(), 0);
			}
		}, 0);
	};


	wizard: {
		step1: NgWizardStep<{
			title: TString;
			description: TString;
			tags: Tags[];
			target: number;
			currency: string;
			wallet: string;
		}>;
		step2: NgWizardStep<{
			countries: TagsChipsOption[];
		}>;
		step3: NgWizardStep<{
			activities: ProjectActivity[];
		}>;
		step4: NgWizardStep<{
			medias: DropzoneFile[];
		}>;
		step5: NgWizardStep<{
			youtubeUrl: string;
		}>;
		step6: NgWizardStep<any>;
	};

	projectConcluded: boolean;
	pageHeader: PageHeaderConfig;
	modals: ModalsConfig;
	project: Project;
	projectId: string;
	user: UserPrivate;
	wallets: {
		all: any[];
		used: any[];
		available: any[];
	};
	isReady: boolean;
	media: {
		toAdd: DropzoneFile[];
		toDelete: DropzoneFile[];
	};

	constructor(
		private walletService: WalletService,
		private projectService: ProjectService,
		private dashboardService: DashboardService,
		private translate: TranslateService,
		private utilsService: UtilsService,
		private modalService: NgbModal,
		private route: ActivatedRoute,
		private changeDetector: ChangeDetectorRef
	) {
		this.pageHeader = {
			description: {
				title: this.translate.instant('New project'),
				subTitle: this.translate.instant('Create a project')
			}
		};

		this.modals = {
			activity: {
				id: 'modalActivity',
				modalClass: 'modal-md',
				hideCloseButton: true,
				title: translate.instant('Activity')
			},
			confirm: {
				id: 'modalConfirm',
				modalClass: 'modal-md',
				hideCloseButton: true,
				title: this.translate.instant('Confirm delete activity'),
				// description: ('Are you sure to delete') + ' ' + this.utilsService.getSString(activity.title) + ' ' + this.translate.instant('activity?'
			}
		};

		this.project = null;
		this.projectConcluded = false;
		this.isReady = false;
		this.media = { toAdd: [], toDelete: [] };

		/* FORMS */

		this.wizard = { step1: null, step2: null, step3: null, step4: null, step5: null, step6: null };

		//STEP 1

		this.wizard.step1 = new NgWizardStep();

		this.wizard.step1.initializeModel({
			title: {
				en: null,
				it: null,
				es: null
			},
			description: {
				en: null,
				it: null,
				es: null
			},
			tags: null,
			target: 1000,
			currency: 'EUR',
			wallet: null
		});

		this.wizard.step1.setTitles({
			main: this.translate.instant('Information'),
			heading: this.translate.instant('Insert default information for this project')
		});

		//title
		this.wizard.step1.addField({
			type: 'multiLanguageText',
			key: 'title',
			templateOptions: {
				label: this.translate.instant('Title'),
				hideAsterisk: true,
				minLength: AppSettings.form.length.min.project.title
			}
		});

		//description
		this.wizard.step1.addField({
			type: 'multiLanguageText',
			key: 'description',
			templateOptions: {
				label: this.translate.instant('Description'),
				hideAsterisk: true,
				isTextarea: true,
				minLength: AppSettings.form.length.min.project.description
			}
		});

		//tags
		this.wizard.step1.addField({
			type: 'tagsButtons',
			key: 'tags',
			templateOptions: {
				label: this.translate.instant('Tags'),
				required: true,
				disabled: this.projectConcluded,
				// tooltip: {
				// 	content: this.translate.instant('Select each activity involved in this project')
				// },
				config: {
					tagsAvailable: []
				}
			}
		});

		//target
		this.wizard.step1.addField({
			type: 'input',
			key: 'target',
			className: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
			templateOptions: {
				type: 'number',
				label: this.translate.instant('Target'),
				required: true,
				disabled: this.projectConcluded,
				min: 1
			}
		});

		//currency
		this.wizard.step1.addField({
			type: 'buttonsGroup',
			key: 'currency',
			className: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
			templateOptions: {
				label: this.translate.instant('Currency'),
				required: true,
				disabled: this.projectConcluded,
				config: {
					options: this.utilsService.buttonsGroupOptions().fiatCurrency.concat([this.utilsService.buttonsGroupOptions().btcCurrency[0]]),
					fullSize: true
				}
			}
		});

		//wallet
		this.wizard.step1.addField({
			type: 'select',
			key: 'wallet',
			templateOptions: {
				label: this.translate.instant('Wallet'),
				required: true,
				disabled: this.projectConcluded
			}
		});

		//STEP 2

		this.wizard.step2 = new NgWizardStep();

		this.wizard.step2.setTitles({
			main: this.translate.instant('Countries'),
			heading: this.translate.instant('Insert the countries related with your project'),
			description: this.translate.instant('You can associate the project to an existing event. This is not compulsory, you can create a project that is not associated with an event. If the event you want to associate is not in the list this means that your verified position is far from it. Alternatively select a set of countries where your project will operate.')
		});

		//countries
		const autocompleteCountries = [];
		for (const countryKey in countryDict) {
			autocompleteCountries.push({ display: countryDict[countryKey], value: countryKey });
		}

		this.wizard.step2.addField({
			type: 'tags',
			key: 'countries',
			templateOptions: {
				required: true,
				hideAsterisk: true,
				label: this.translate.instant('Insert Country'),
				placeholder: this.translate.instant('Insert Country'),
				options: autocompleteCountries
			}
		});

		//STEP 3

		this.wizard.step3 = new NgWizardStep();

		//TODO serve solo sulla view
		// this.wizard.step3.setSubmitHandler((model) => {
		// 	this.sendProjectInformation({});
		// });

		this.wizard.step3.setTitles({
			main: this.translate.instant('Activities'),
			heading: this.translate.instant('Insert the activities related with your project'),
			description: this.translate.instant('Insert one or more activities for this project. One activity with english title is required. Activities are list of goals, products, services that make up your project. Please try to be as accurate as possible. We suggest to upload a document (quote / agreement or other) for each activity. More detailed projects have a greater chance to be approved and receive more donations.')
		});

		this.wizard.step3.initializeModel({
			activities: []
		});

		//TODO viene fatto quando creo una nuova activity o quando l'aggiorno
		//TODO quando una modal activity viene chiusa, vengono aggiornate le activity
		// $(window).on('load', () => {
		// 	$('#modalActivity').on('hide.bs.modal', e => {
		// 		if (this.projectId)
		// 			this.projectService.get(this.projectId).subscribe(project => {
		// 				this.wizard.step3.initializeModel({
		// 					activities: project.activities
		// 				});
		// 			}, res => {
		// 				this.wizard.step3.setResponse('error', buildErrorResponseMessage(res.error));
		// 			});
		// 	});
		// });

		//STEP 4

		this.wizard.step4 = new NgWizardStep();

		this.wizard.step4.setTitles({
			main: this.translate.instant('Media'),
			heading: this.translate.instant('Insert the media of your project'),
			description: this.translate.instant('Upload photos and images linked with your project. Media materials generate powerful emotional reactions in donors and improve your fundraising')
		});

		this.wizard.step4.initializeModel({
			medias: []
		});

		//medias
		this.wizard.step4.addField({
			type: 'dropzone',
			key: 'medias',
			className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center',
			templateOptions: {
				label: this.translate.instant('Project Media'),
				required: true,
				config: {
					exts: AppSettings.form.exts,
					maxSize: AppSettings.form.fileSize.media.max,
					maxFiles: 4,
					minFiles: 1,
					description: this.translate.instant('Insert your project media'),
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

		//STEP 5

		this.wizard.step5 = new NgWizardStep();

		this.wizard.step5.setTitles({
			main: this.translate.instant('Other'),
			heading: this.translate.instant('Other information'),
			description: this.translate.instant('Here you can insert additional information of your project')
		});

		//youtubeUrl
		this.wizard.step5.addField({
			type: 'urlYoutube',
			key: 'youtubeUrl',
			templateOptions: {
				label: this.translate.instant('Youtube Video URL')
			},
		});

		this.wizard.step5.initializeModel({
			youtubeUrl: null
		});

		//FINISH

		this.wizard.step6 = NgWizardStep.createFinishStep(this.translate);
	}

	activityCategoryToString(cat) {
		switch (cat) {
			case 'quote':
				return this.translate.instant('Quotes');
			case 'invoice':
				return this.translate.instant('Invoices');
			case 'update':
				return this.translate.instant('Updates');
			case 'media':
				return this.translate.instant('Media');
		}
		return '';
	}

	ngOnInit() {
		const setFormEditMode = () => {
			//STEP 1
			this.wizard.step1.getField('tags').templateOptions.disabled = this.projectConcluded;
			this.wizard.step1.getField('target').templateOptions.disabled = this.projectConcluded;
			this.wizard.step1.getField('currency').templateOptions.disabled = this.projectConcluded;
			this.wizard.step1.getField('wallet').templateOptions.disabled = this.projectConcluded;
		};

		this.dashboardService.get().subscribe(user => {
			this.user = user;
			const tagList = this.utilsService.tags();
			const paramId = this.route.snapshot.paramMap.get('id');

			if (paramId == 'new') {
				this.projectConcluded = false;

				//tags

				const tagsInput = this.wizard.step1.getField('tags');

				if (this.user.usertype == 'npo')
					tagsInput.templateOptions.config.tagsAvailable = this.user.tags.reduce((obj, tag) => Object.assign(obj, { [tag]: tagList[tag] }), {});
				else
					tagsInput.templateOptions.config.tagsAvailable = tagList;

				return this.dashboardService.getProjects().subscribe(data => {
					const projects = data.projects.concat(data.closedprojects);

					/* Check already selected wallets and available */
					const usedWallets = projects.map(p => p.receiveaddress).filter(p => p != null);

					this.walletService.getList().subscribe(list => {
						//wallets
						const availableWallets = list.wallets.filter(w => usedWallets.indexOf(w.address) == -1);
						const walletInput = this.wizard.step1.getField('wallet');
						const availableWalletsOptions = [];

						availableWallets.forEach(w => {
							availableWalletsOptions.push({
								label: w.label + ' - ' + w.address,
								value: w.address
							});
						});

						walletInput.templateOptions.options = availableWalletsOptions;
						this.isReady = true;
						this.changeDetector.detectChanges();
					});
				});
			}



			this.projectService.get(paramId).subscribe(project => {
				this.project = project;
				const donationsStatus = this.projectService.createProgressBarConfig(project);

				if (donationsStatus.current >= donationsStatus.target) {
					this.projectConcluded = true;
					this.projectId = paramId;

					setFormEditMode();

					//step 3

					this.wizard.step3.initializeModel({
						activities: this.project.activities
					});

					this.isReady = true;
				}
				//EDIT MODE
				else {
					this.projectConcluded = false;
					this.projectId = paramId;

					setFormEditMode();

					//tags

					const tagsInput = this.wizard.step1.getField('tags');

					if (this.user.usertype == 'npo')
						tagsInput.templateOptions.config.tagsAvailable = this.user.tags.reduce((obj, tag) => Object.assign(obj, { [tag]: tagList[tag] }), {});
					else
						tagsInput.templateOptions.config.tagsAvailable = tagList;


					this.dashboardService.getProjects().subscribe(data => {
						const projects = data.projects.concat(data.closedprojects);

						/* Check already selected wallets and available */
						// const usedWallets = projects.map(p => p.receiveaddress).filter(p => p != null);

						this.walletService.getList().subscribe(list => {
							//wallets
							const availableWallets = list.wallets.filter((wallet: Wallet) => wallet.address == this.project.receiveaddress);
							const walletInput = this.wizard.step1.getField('wallet');

							walletInput.templateOptions.options = [{
								label: availableWallets[0].label + ' - ' + availableWallets[0].address,
								value: availableWallets[0].address
							}];
						});

						this.isReady = true;
					});

					this.pageHeader = {
						description: {
							title: this.translate.instant('Edit project'),
							subTitle: '"' + this.utilsService.getSString(this.project.title) + '"'
						}
					};

					//step 1
					this.wizard.step1.initializeModel({
						title: this.project.title,
						description: this.project.description,
						tags: this.project.tags,
						target: this.project.target,
						currency: this.project.currency,
						wallet: this.project.receiveaddress,
					});

					//step 2

					if (this.project.countries.length > 0) {
						this.utilsService.getCountryTagsChipsOptions().subscribe((countryOptions: TagsChipsOption[]) => {
							this.wizard.step2.getField('countries').templateOptions.options = countryOptions;
						});

						this.utilsService.getCountryTagsChipsOptionsByCountryKeys(this.project.countries).subscribe((countryOptions: TagsChipsOption[]) => {
							this.wizard.step2.initializeModel({
								countries: countryOptions
							});
							//setModelField('countries', countryOptions);
						});
					}

					//step 3

					this.wizard.step3.initializeModel({
						activities: this.project.activities
					});
					//step 4
					if (this.project.media.length > 0)
						this.updateProjectMediaModel(this.project).subscribe(_ => { });

					//step 5
					//TODO da sistemare, l'inizializzazione deve avvenire appena il form ha l'attributo "controls" pronto
					//controls è il contenitore di tutti i FormControls del nostro form e visto che youtubeUrl è custom, serve fare il set con il formControl
					setTimeout(() => this.wizard.step5.setModelField('youtubeUrl', this.project.video), 1000);
				}
			}, res => {
				this.wizard.step3.setResponse('error', buildErrorResponseMessage(res.error));
			});
		}, res => {
			this.wizard.step1.setResponse('error', buildErrorResponseMessage(res.error));
		});
	}

	updateProjectMediaModel(project: Project): Observable<void> {
		return new Observable((observer: Observer<void>) => {
			const promises: Observable<FileCustom>[] = [];

			project.media.forEach((mid, index) => {
				const url = getMediaUrl(mid + '?token=' + getLocalStorage().getItem('token'));
				promises.push(this.utilsService.getFileFromUrl({ url: url, id: mid, fileName: 'project-media-' + mid }));
			});

			forkJoin(promises).subscribe((medias: FileCustom[]) => {
				this.wizard.step4.initializeModel({
					medias: medias
				});

				observer.next();
				observer.complete();
			}, res => {
				this.wizard.step4.setResponse('error', buildErrorResponseMessage(res.error));

				observer.error(res);
			});
		});
	}

	sendProjectInformation(json, step) {
		this.wizard['step' + step].resetResponse();

		if (this.projectId)
			this.projectService.edit(this.projectId, json).subscribe(_ => {
				this.wizardHandler.goToNextStep();
			}, res => {
				this.wizard['step' + step].setResponse('error', buildErrorResponseMessage(res.error));
			});
		else
			this.projectService.create(json).subscribe(id => {
				this.projectId = id;
				this.wizardHandler.goToNextStep();
			}, res => {
				this.wizard['step' + step].setResponse('error', buildErrorResponseMessage(res.error));
			});
	}

	sendProjectBasicInformation() {
		this.wizard.step1.resetResponse();

		type JSONFormat = {
			title: TString;
			description: TString;
			tags: string[];
			target: number;
			currency: string;
			receiveaddress: string;
		};

		const json: JSONFormat = {
			title: {
				en: this.wizard.step1.model.title.en
			},
			description: {
				en: this.wizard.step1.model.description.en
			},
			target: this.wizard.step1.model.target,
			tags: this.wizard.step1.model.tags,
			currency: this.wizard.step1.model.currency,
			receiveaddress: this.wizard.step1.model.wallet
		};

		if (this.wizard.step1.model.title.it)
			json.title.it = this.wizard.step1.model.title.it;
		if (this.wizard.step1.model.title.es)
			json.title.es = this.wizard.step1.model.title.es;

		if (this.wizard.step1.model.description.it)
			json.description.it = this.wizard.step1.model.description.it;
		if (this.wizard.step1.model.description.es)
			json.description.es = this.wizard.step1.model.description.es;

		this.sendProjectInformation(json, 1);
	}

	next() {
		this.wizardHandler.goToNextStep();
	}

	sendProjectCountries() {
		this.wizard.step2.resetResponse();

		const json: any = {};

		if (this.wizard.step2.model.countries)
			json.countries = this.wizard.step2.model.countries.map((option: TagsChipsOption) => option.value);

		this.sendProjectInformation(json, 2);
	}

	sendProjectMedia() {
		this.wizard.step4.resetResponse();

		const promisesRemoveMedia: Observable<void>[] = this.media.toDelete.map((file: DropzoneFile) => this.projectService.removeMedia(this.projectId, file.id));
		const promisesAddMedia: Observable<void>[] = this.media.toAdd.map((file: DropzoneFile) => this.projectService.uploadMedia(this.projectId, file.file));

		const promises = promisesRemoveMedia.concat(promisesAddMedia);

		if (promises.length > 0)
			forkJoin(promises).subscribe(_ => {
				this.media.toDelete = [];
				this.media.toAdd = [];

				this.projectService.get(this.projectId).subscribe((project: Project) => {
					this.updateProjectMediaModel(project).subscribe(_ => {
						this.wizardHandler.goToNextStep();
					});
				}, res => {
					this.wizard.step4.setResponse('error', buildErrorResponseMessage(res));
				});
			}, res => {
				this.wizard.step4.setResponse('error', buildErrorResponseMessage(res));
			});
		else
			this.wizardHandler.goToNextStep();
	}

	sendProjectOtherInformations() {
		const json: any = {
			video: this.wizard.step5.model.youtubeUrl
		};

		this.sendProjectInformation(json, 5);
	}

	//step 1 - basic info
	//step 2 - countries
	//step 3 - activities
	//step 4 - medias
	//step 5 - other info

	createActivity() {
		openModalProjectActivity(this.modalService, { ...this.modals.activity, projectId: this.projectId }).result.then(
			(v) => {
				if (this.projectId)
					this.projectService.get(this.projectId).subscribe((project: Project) => {
						this.wizard.step3.initializeModel({
							activities: project.activities
						});
					}, res => {
						this.wizard.step3.setResponse('error', buildErrorResponseMessage(res.error));
					});
			},
			() => {
				if (this.projectId)
					this.projectService.get(this.projectId).subscribe((project: Project) => {
						this.wizard.step3.initializeModel({
							activities: project.activities
						});
					}, res => {
						this.wizard.step3.setResponse('error', buildErrorResponseMessage(res.error));
					});
			});
	}

	editActivity(activity) {
		openModalProjectActivity(this.modalService, { ...this.modals.activity, projectId: this.projectId, activity: activity }).result.then(
			(v) => {
				if (this.projectId)
					this.projectService.get(this.projectId).subscribe((project: Project) => {
						this.wizard.step3.initializeModel({
							activities: project.activities
						});
					}, res => {
						this.wizard.step3.setResponse('error', buildErrorResponseMessage(res.error));
					});
			},
			() => {
				if (this.projectId)
					this.projectService.get(this.projectId).subscribe((project: Project) => {
						this.wizard.step3.initializeModel({
							activities: project.activities
						});
					}, res => {
						this.wizard.step3.setResponse('error', buildErrorResponseMessage(res.error));
					});
			});
	}

	openModalConfirmDeleteActivity(activity, index) {
		openModal(this.modalService, { ...this.modals.confirm, description: this.translate.instant('Are you sure to delete') + ' ' + this.utilsService.getSString(activity.title) + ' ' + this.translate.instant('activity?') }).result.then(
			(v) => { this.deleteActivity(activity, index); },
			() => { });
	}

	//TODO penso che il this dentro questo metodo venga inteso come referenza alla funzione
	//visto che viene assegnata sopra per referenza
	deleteActivity(activity, index) {
		(this.projectService as ProjectService).removeActivity(this.project._id, activity._id).subscribe(_ => {
			this.wizard.step3.model.activities.splice(index, 1);
		}, res => {
			this.wizard.step3.setResponse('error', buildErrorResponseMessage(res.error));
		});
	}
}