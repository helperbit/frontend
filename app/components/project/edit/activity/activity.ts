import { UtilsService } from '../../../../services/utils';
import { ResponseMessageConfig, buildErrorResponseMessage } from '../../../../shared/components/response-messages/response-messages';
import { ProjectService, ProjectActivity, ProjectActivityCategory } from '../../../../models/project';
import AppSettings from '../../../../app.settings';
import { TString } from 'app/models/common';
import { getMediaUrl, getLocalStorage } from 'app/shared/helpers/utils';
import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { ModalConfig } from 'app/shared/components/modal/oldModal/modal';
import { NgbModalRef, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WizardComponent } from 'angular-archwizard';
import { NgWizardStep } from 'app/shared/helpers/ng-wizard-step';
import { DropzoneFile } from 'app/shared/components/dropzone/dropzone';
import { TranslateService } from '@ngx-translate/core';
import { Observable, forkJoin } from 'rxjs';
import { FileCustom } from 'app/shared/types/input-file';

export interface ModalActivityComponentConfig extends ModalConfig {
	projectId: string;
	activity?: ProjectActivity;
};

export function openModalProjectActivity(modalService: NgbModal, config?: ModalActivityComponentConfig): NgbModalRef {
	const modalRef: NgbModalRef = modalService.open(ModalActivityComponent, {
		size: 'lg'
	});

	if(config)
		modalRef.componentInstance.config = config;

	return modalRef;
}

@Component({
	selector: 'me-activity-project-component',
	templateUrl: 'activity.html',
	styleUrls: ['activity.scss']
})
export class ModalActivityComponent implements OnInit {
	@Input() config: ModalActivityComponentConfig;
	public wizardHandler: WizardComponent;

	@ViewChild(WizardComponent) set contentMulti(content: WizardComponent) {
		this.wizardHandler = content;

		this.wizard.step1.setHandler(this.wizardHandler);
		this.wizard.step2.setHandler(this.wizardHandler);
		this.wizard.step3.setHandler(this.wizardHandler);
	};

	responseMessage: ResponseMessageConfig;
	projectId: string;
	activityId: string;
	editMode: boolean;
	media: {
		toAdd: DropzoneFile[];
		toDelete: DropzoneFile[];
	};

	wizard: {
		step1: NgWizardStep<{
			title: TString;
			description: TString;
			category: ProjectActivityCategory;
		}>;
		step2: NgWizardStep<{
			media: DropzoneFile[];
		}>;
		step3: NgWizardStep<any>;
	};

	constructor(
		private translate: TranslateService, 
		private utilsService: UtilsService,
		private projectService: ProjectService,
		public activeModal: NgbActiveModal,
	) {
		this.projectId = null;
		this.editMode = false;
		this.media = { toAdd: [], toDelete: [] };

		/* FORMS */

		this.wizard = { step1: null, step2: null, step3: null };

		//STEP 1

		//FORM STEP 1

		this.wizard.step1 = new NgWizardStep();

		this.wizard.step1.initializeModel({
			title: null,
			description: null,
			category: null
		});

		this.wizard.step1.setTitles({
			main: translate.instant('Information'),
			heading: translate.instant('Insert default information for this activity')
		});

		//title
		this.wizard.step1.addField({
			type: 'multiLanguageText',
			key: 'title',
			templateOptions: {
				label: this.translate.instant('Title'),
				hideAsterisk: true,
				minLength: AppSettings.form.length.min.activity.title
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
				minLength: AppSettings.form.length.min.activity.description
			}
		});

		//category
		this.wizard.step1.addField({
			type: 'select',
			key: 'category',
			templateOptions: {
				label: translate.instant('Category'),
				required: true,
				options: [
					{
						label: translate.instant('Updates'),
						value: 'update'
					},
					{
						label: translate.instant('Invoices'),
						value: 'invoice'
					},
					{
						label: translate.instant('Quotes'),
						value: 'quote'
					},
					{
						label: translate.instant('Media'),
						value: 'media'
					}
				]
			}
		});

		//STEP 2

		this.wizard.step2 = new NgWizardStep();

		this.wizard.step2.initializeModel({
			media: []
		});

		this.wizard.step2.setTitles({
			main: translate.instant('Media'),
			heading: translate.instant('Insert some media for this activity'),
		});

		//media
		this.wizard.step2.addField({
			type: 'dropzone',
			key: 'media',
			className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center',
			templateOptions: {
				label: translate.instant('Media'),
				required: false,
				config: {
					exts: AppSettings.form.exts,
					maxSize: AppSettings.form.fileSize.media.max,
					maxFiles: 4,
					minFiles: 1,
					description: translate.instant('Insert your activity media'),
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

		//FINISH

		this.wizard.step3 = NgWizardStep.createFinishStep(this.translate);
	}

	ngOnInit() {
		this.projectId = this.config.projectId;

		if (this.config.activity) {
			this.editMode = true;
			this.activityId = this.config.activity._id;
			this.editMode = true;

			this.wizard.step1.initializeModel({
				title: this.config.activity.title,
				description: this.config.activity.description,
				category: this.config.activity.category
			});
			
			if (this.config.activity.media.length > 0) {
				const promises: Observable<FileCustom>[] = [];

				this.config.activity.media.forEach((mid, index) => {
					const url = getMediaUrl(mid + '?token=' + getLocalStorage().getItem('token'));

					promises.push(this.utilsService.getFileFromUrl({ url: url, id: mid, fileName: 'activity-media-' + mid }));
				});

				forkJoin(promises).subscribe((medias: FileCustom[]) => {
					this.wizard.step2.initializeModel({
						media: medias
					});
				}, res => {
					this.wizard.step2.setResponse('error', buildErrorResponseMessage(res.error));
				});
			}
		}
		else {
			this.editMode = false;
			this.activityId = null;
		}
	}

	sendActivityInformation () {
		const json: {
			title: TString;
			description: TString;
			category: ProjectActivityCategory;
		} = {
			title: {
				en: this.wizard.step1.model.title.en
			},
			description: {
				en: this.wizard.step1.model.description.en
			},
			category: this.wizard.step1.model.category
		};

		if (this.wizard.step1.model.title.it)
			json.title.it = this.wizard.step1.model.title.it;
		if (this.wizard.step1.model.title.es)
			json.title.es = this.wizard.step1.model.title.es;

		if (this.wizard.step1.model.description.it)
			json.description.it = this.wizard.step1.model.description.it;
		if (this.wizard.step1.model.description.es)
			json.description.es = this.wizard.step1.model.description.es;

		if (this.activityId)
			this.projectService.editActivity(this.projectId, this.activityId, json).subscribe(_ => {
				this.wizardHandler.goToNextStep();
			}, res => {
				this.responseMessage = buildErrorResponseMessage(res.error);
			});
		else
			this.projectService.createActivity(this.projectId, json).subscribe(id => {
				this.activityId = id;
				this.wizardHandler.goToNextStep();
			}, res => {
				this.responseMessage = buildErrorResponseMessage(res.error);
			});
	}

	sendActivityMedia() {
		this.wizard.step2.resetResponse();

		const promisesRemoveMedia: Observable<void>[] = this.media.toDelete.map((file: DropzoneFile) => this.projectService.removeActivityMedia(this.projectId, this.activityId, file.id));
		const promisesAddMedia: Observable<void>[] = this.media.toAdd.map((file: DropzoneFile) => this.projectService.uploadActivityMedia(this.projectId, this.activityId, file.file));

		const promises = promisesRemoveMedia.concat(promisesAddMedia);

		if(promises.length > 0)
			forkJoin(promises).subscribe(_ => {
				this.media.toDelete = [];
				this.media.toAdd = [];

				this.wizardHandler.goToNextStep();
			}, res => {
				this.wizard.step2.setResponse('error', buildErrorResponseMessage(res));
			});
		else
			this.wizardHandler.goToNextStep();
	}
}