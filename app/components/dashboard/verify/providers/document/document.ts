import { UtilsService } from '../../../../../services/utils';
import { getValueFormArrayByKeyName, getMediaUrl, getLocalStorage } from '../../../../../shared/helpers/utils';
import { buildErrorResponseMessage } from '../../../../../shared/components/response-messages/response-messages';
import { DashboardService, UserMedia } from '../../../../../models/dashboard';
import AppSettings from '../../../../../app.settings';
import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { ModalConfig } from 'app/shared/components/modal/oldModal/modal';
import { DropzoneFile } from 'app/shared/components/dropzone/dropzone';
import { WizardComponent } from 'angular-archwizard';
import { NgWizardStep } from 'app/shared/helpers/ng-wizard-step';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, forkJoin } from 'rxjs';
import { getDateSelectorModelFromDate, InputSelectDateNumber, getDateFromDateSelectorModel } from 'app/shared/components/date-selector/date-selector';
import { FileCustom } from 'app/shared/types/input-file';

export interface ModalMeVerifyProviderDocumentConfig extends ModalConfig {
	info: {
		document: string;
		documentid: string;
		expirationdate: string;
	};
	medias?: DropzoneFile[];
};

@Component({
	selector: 'me-verify-provider-document-component',
	templateUrl: 'document.html',
	styleUrls: ['document.scss']
})
export class ModalMeVerifyProviderDocumentComponent implements OnInit {
	@Input() config: ModalMeVerifyProviderDocumentConfig;
	public wizardHandler: WizardComponent;

	@ViewChild(WizardComponent) set contentMulti(content: WizardComponent) {
		this.wizardHandler = content;

		this.wizard.step1.setHandler(this.wizardHandler);
		this.wizard.step2.setHandler(this.wizardHandler);
		this.wizard.step3.setHandler(this.wizardHandler);
	};

	editMode: boolean;

	wizard: {
		step1: NgWizardStep<{
			type: string;
			expirationDate: InputSelectDateNumber;
			id: string;
		}>;
		step2: NgWizardStep<{
			mediaFront: DropzoneFile[];
			mediaBack: DropzoneFile[];
		}>;
		step3: NgWizardStep<{
			type: string;
			expirationDate: string;
			id: string;
			mediaFront: UserMedia;
			mediaBack: UserMedia;
		}>;
		step4: NgWizardStep<any>;
	};

	constructor(
		private dashboardService: DashboardService,
		private translate: TranslateService,
		private utilsService: UtilsService,
		public activeModal: NgbActiveModal
	) {
		/* FORMS */

		this.wizard = { step1: null, step2: null, step3: null, step4: null };

		//STEP 1

		this.wizard.step1 = new NgWizardStep();

		this.wizard.step1.initializeModel({
			type: null,
			expirationDate: null,
			id: null
		});

		this.wizard.step1.setTitles({
			main: this.translate.instant('Upload'),
			heading: this.translate.instant('Upload your Document'),
			description: this.translate.instant('Upload the documents requested below.')
		});

		//type
		this.wizard.step1.addField({
			type: 'select',
			key: 'type',
			className: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
			templateOptions: {
				label: this.translate.instant('Document type'),
				required: true,
				options: [
					{
						label: this.translate.instant('ID'),
						value: 'id'
					},
					{
						label: this.translate.instant('Passport'),
						value: 'passport'
					}
				]
			}
		});

		//id
		this.wizard.step1.addField({
			type: 'input',
			key: 'id',
			className: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
			templateOptions: {
				type: 'text',
				label: this.translate.instant('Document Registration Number'),
				placeholder: this.translate.instant('Document registration number'),
				required: true
			},
			validation: {
				alphanumeric: {
					expression: (v, m, s) => AppSettings.form.regex.alphanumeric.test(m)
				}
			}
		});

		//expirationDate
		this.wizard.step1.addField({
			type: 'dateSelector',
			key: 'expirationDate',
			className: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
			templateOptions: {
				type: 'text',
				label: this.translate.instant('Expiration Date'),
				required: true,
				minDate: new Date()
			}
		});

		//STEP 2

		this.wizard.step2 = new NgWizardStep();

		this.wizard.step2.initializeModel({
			mediaFront: null,
			mediaBack: null
		});

		this.wizard.step2.setTitles({
			main: translate.instant('Information'),
			heading: translate.instant('Choose your document type and insert the information')
		});

		//mediaFront
		this.wizard.step2.addField({
			type: 'dropzone',
			key: 'mediaFront',
			className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
			templateOptions: {
				label: this.translate.instant('Document (Front)'),
				required: true,
				config: {
					exts: AppSettings.form.exts,
					maxSize: AppSettings.form.fileSize.document.max,
					maxFiles: 1,
					minFiles: 1,
					description: this.translate.instant('Insert your Front Document')
				}
			}
		});

		//mediaBack
		this.wizard.step2.addField({
			type: 'dropzone',
			key: 'mediaBack',
			className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
			templateOptions: {
				label: this.translate.instant('Document (Back)'),
				required: true,
				config: {
					exts: AppSettings.form.exts,
					maxSize: AppSettings.form.fileSize.document.max,
					maxFiles: 1,
					minFiles: 1,
					description: this.translate.instant('Insert your Back Document')
				}
			}
		});

		//STEP 3

		this.wizard.step3 = new NgWizardStep();

		this.wizard.step3.initializeModel({
			type: '',
			expirationDate: '',
			id: '',
			mediaFront: { name: null, mid: null },
			mediaBack: { name: null, mid: null }
		});

		// this.wizard.step3.setModelField('mediaFront', { name: null, mid: null });
		// this.wizard.step3.setModelField('mediaBack', { name: null, mid: null });

		this.wizard.step3.setTitles({
			main: this.translate.instant('Summary'),
			heading: this.translate.instant('Do you confirm your submission?')
		});

		//FINISH
		
		this.wizard.step4 = NgWizardStep.createFinishStep(this.translate);
	}

	ngOnInit() {
		if(this.config) {
			this.editMode = true;

			this.wizard.step1.initializeModel({
				type: this.config.info.document,
				id: this.config.info.documentid,
				expirationDate: getDateSelectorModelFromDate(new Date(this.config.info.expirationdate))
			});

			if (this.config.medias.length > 0) {
				const front = getValueFormArrayByKeyName(this.config.medias, 'name', 'front');
				const back = getValueFormArrayByKeyName(this.config.medias, 'name', 'back');

				const frontUrl = getMediaUrl(front.mid + '?token=' + getLocalStorage().getItem('token'));
				const backUrl = getMediaUrl(back.mid + '?token=' + getLocalStorage().getItem('token'));

				//send front and back
				const promises: Observable<FileCustom>[] = [
					this.utilsService.getFileFromUrl({ url: frontUrl, fileName: 'document-id-front' }),
					this.utilsService.getFileFromUrl({ url: backUrl, fileName: 'document-id-back' })
				];

				forkJoin(promises).subscribe((medias: FileCustom[]) => {
					this.wizard.step2.initializeModel({
						mediaFront: [medias[0]],
						mediaBack: [medias[1]]
					});
				}, res => {
					this.wizard.step2.setResponse('error', buildErrorResponseMessage(res.error));
				});
			}
		} 
	}

	sendDocumentInformation() {
		this.wizard.step1.resetResponse();
		
		const json = {
			document: this.wizard.step1.model.type,
			expirationdate: getDateFromDateSelectorModel(this.wizard.step1.model.expirationDate),
			documentid: this.wizard.step1.model.id
		};

		this.dashboardService.doVerificationStep('document', 0, json).subscribe(_ => {
			this.dashboardService.emitNotificationUpdate('verify');
			this.wizardHandler.goToNextStep();
		}, res => {
			this.wizard.step1.setResponse('error', buildErrorResponseMessage(res.error));
		});
	}

	sendDocumentMedias() {
		this.wizard.step2.resetResponse();

		const front = this.wizard.step2.model.mediaFront[0].file;
		const back = this.wizard.step2.model.mediaBack[0].file;

		//send front
		this.dashboardService.doVerificationMediaStep('document', 1, front, 'front').subscribe(_ => {
			this.dashboardService.emitNotificationUpdate('verify');

			//send back
			this.dashboardService.doVerificationMediaStep('document', 1, back, 'back').subscribe(_ => {
				this.dashboardService.emitNotificationUpdate('verify');

				//set summary, then go next step
				this.dashboardService.getVerify().subscribe(res => {
					const verification = getValueFormArrayByKeyName(res.verification, 'provider', 'document');
					
					this.wizard.step3.initializeModel({
						type: verification.info.document,
						id: verification.info.documentid,
						expirationDate: verification.info.expirationdate,
						mediaFront: getValueFormArrayByKeyName(verification.medias, 'name', 'front'),
						mediaBack: getValueFormArrayByKeyName(verification.medias, 'name', 'back')
					});
	
					this.wizardHandler.goToNextStep();
				});
			}, res => {
				this.wizard.step2.setResponse('error', buildErrorResponseMessage(res.error))
			});
		}, res => {
			this.wizard.step2.setResponse('error', buildErrorResponseMessage(res.error))
		});
	}

	confirmDocument() {
		this.wizard.step3.resetResponse();
		
		const json = {
			document: this.wizard.step3.model.type,
			expirationdate: this.wizard.step3.model.expirationDate,
			documentid: this.wizard.step3.model.id
		};

		this.dashboardService.doVerificationStep('document', 2, json).subscribe(_ => {
			this.dashboardService.emitNotificationUpdate('verify');
			this.wizardHandler.goToNextStep();
		}, res => {
			this.wizard.step3.setResponse('error', buildErrorResponseMessage(res.error))
		});
	}
}