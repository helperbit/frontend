import { UtilsService } from '../../../../../services/utils';
import { getValueFormArrayByKeyName, getMediaUrl, getLocalStorage } from '../../../../../shared/helpers/utils';
import { buildErrorResponseMessage } from '../../../../../shared/components/response-messages/response-messages';
import { DashboardService, UserMedia, UserVerification } from '../../../../../models/dashboard';
import AppSettings from '../../../../../app.settings';
import { FileCustom } from 'app/shared/types/input-file';
import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { WizardComponent } from 'angular-archwizard';
import { DropzoneFile } from 'app/shared/components/dropzone/dropzone';
import { NgWizardStep } from 'app/shared/helpers/ng-wizard-step';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfig } from 'app/shared/components/modal/oldModal/modal';

export interface ModalMeVerifyProviderCompanyConfig extends ModalConfig {
	medias?: DropzoneFile[];
};

@Component({
	selector: 'me-verify-provider-company-component',
	templateUrl: 'company.html',
	styleUrls: ['company.scss']
})
export class ModalMeVerifyProviderCompanyComponent implements OnInit {
	@Input() config: ModalMeVerifyProviderCompanyConfig;
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
			certificate: DropzoneFile[];
		}>;
		step2: NgWizardStep<{
			certificate: UserMedia;
		}>;
		step3: NgWizardStep<any>;
	};

	constructor(
		private dashboardService: DashboardService,
		private translate: TranslateService,
		private utilsService: UtilsService,
		public activeModal: NgbActiveModal
	) {
		/* FORMS */

		this.wizard = { step1: null, step2: null, step3: null };

		//STEP 1

		this.wizard.step1 = new NgWizardStep();

		this.wizard.step1.initializeModel({ certificate: null });

		this.wizard.step1.setTitles({
			main: translate.instant('Upload'),
			heading: translate.instant('Upload your Document')
		});

		//certificate
		this.wizard.step1.addField({
			type: 'dropzone',
			key: 'certificate',
			className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center',
			templateOptions: {
				label: translate.instant('Business Entity Certificate'),
				required: true,
				config: {
					exts: AppSettings.form.exts,
					maxSize: AppSettings.form.fileSize.document.max,
					maxFiles: 1,
					minFiles: 1,
					description: translate.instant('Insert your Business Entity Certificate')
				}
			}
		});

		//STEP 2

		this.wizard.step2 = new NgWizardStep();

		this.wizard.step2.initializeModel({ certificate: { name: null, mid: null } });

		this.wizard.step2.setTitles({
			main: translate.instant('Summary'),
			heading: translate.instant('Do you confirm your submission?')
		});

		// this.formCompany.step2.setSubmitDisable((form, model) => form.$invalid);

		//STEP 3
		
		this.wizard.step3 = NgWizardStep.createFinishStep(this.translate);
	}

	ngOnInit() {
		if (this.config) {
			this.editMode = true;

			const medias = this.config.medias;

			const certificate = getValueFormArrayByKeyName(medias, 'name', 'businesscertificate');

			this.utilsService.getFileFromUrl({
				url: getMediaUrl(certificate.mid + '?token=' + getLocalStorage().getItem('token')),
				fileName: 'business-entity-certificate'
			}).subscribe((file: FileCustom) => {
				this.wizard.step1.setModelField('certificate', [file]);
			}, res => {
				this.wizard.step1.setResponse('error', buildErrorResponseMessage(res.error));
			});
		}
	}

	sendCompanyDocument () {
		this.wizard.step1.resetResponse();

		//send certificate
		this.dashboardService.doVerificationMediaStep('company', 0, this.wizard.step1.model.certificate[0].file, 'businesscertificate').subscribe(_ => {
			this.dashboardService.emitNotificationUpdate('verify');

			//set summary, then go next step
			this.dashboardService.getVerify().subscribe(res => {
				const verification: UserVerification = <UserVerification>getValueFormArrayByKeyName(res.verification, 'provider', 'company');

				this.wizard.step2.initializeModel({
					certificate: <UserMedia>getValueFormArrayByKeyName(verification.medias, 'name', 'businesscertificate')
				});

				this.wizardHandler.goToNextStep();
			}, res => {
				this.wizard.step1.setResponse('error', buildErrorResponseMessage(res.error));
			});
		}, res => {
			this.wizard.step1.setResponse('error', buildErrorResponseMessage(res.error));
		});
	}

	confirmCompanyDocument () {
		this.wizard.step2.resetResponse();

		this.dashboardService.doVerificationStep('company', 1, {}).subscribe(_ => {
			this.dashboardService.emitNotificationUpdate('verify');
			this.wizardHandler.goToNextStep();
		}, res => {
			this.wizard.step2.setResponse('error', buildErrorResponseMessage(res.error));
		});
	}
}