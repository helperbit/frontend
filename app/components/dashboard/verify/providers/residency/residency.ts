import { buildErrorResponseMessage } from '../../../../../shared/components/response-messages/response-messages';
import { DashboardService } from '../../../../../models/dashboard';
import AppSettings from '../../../../../app.settings';
import { Component, ViewChild } from '@angular/core';
import { NgWizardStep } from 'app/shared/helpers/ng-wizard-step';
import { DropzoneFile } from 'app/shared/components/dropzone/dropzone';
import { WizardComponent } from 'angular-archwizard';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'me-verify-provider-residency-component',
	templateUrl: 'residency.html',
	styleUrls: ['residency.scss']
})
export class ModalMeVerifyProviderResidencyComponent {
	public wizardHandler: WizardComponent;

	@ViewChild(WizardComponent) set contentMulti(content: WizardComponent) {
		this.wizardHandler = content;

		this.wizard.step1.setHandler(this.wizardHandler);
		this.wizard.step2.setHandler(this.wizardHandler);
	};

	editMode: boolean;

	wizard: {
		step1: NgWizardStep<{
			residencyFile: DropzoneFile[];
		}>;
		step2: NgWizardStep<any>;
	}

	constructor(
		private dashboardService: DashboardService,
		private translate: TranslateService,
		public activeModal: NgbActiveModal
	) {
		/* FORMS */

		this.wizard = { step1: null, step2: null };

		//STEP 1

		this.wizard.step1 = new NgWizardStep();

		this.wizard.step1.initializeModel({
			residencyFile: null
		});

		this.wizard.step1.setTitles({
			main: this.translate.instant('Upload'),
			heading: this.translate.instant('Upload your Proof of Residency')
		});

		//residency
		this.wizard.step1.addField({
			type: 'dropzone',
			key: 'residencyFile',
			className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center',
			templateOptions: {
				label: this.translate.instant('Proof of Residency Document'),
				required: true,
				config: {
					exts: AppSettings.form.exts,
					maxSize: AppSettings.form.fileSize.document.max,
					maxFiles: 1,
					minFiles: 1,
					description: this.translate.instant('Insert your Proof of Residency Document')
				},
				helperTooltip: {
					content: this.translate.instant('Select the file of a document that proof your residency')
				}
			}
		});

		//FINISH

		this.wizard.step2 = NgWizardStep.createFinishStep(this.translate);
	}

	sendResidency() {
		this.wizard.step1.resetResponse();

		this.dashboardService.doVerificationMediaStep('residency', 0, this.wizard.step1.model.residencyFile[0].file, '').subscribe(_ => {
			this.dashboardService.emitNotificationUpdate('verify');
			this.wizardHandler.goToNextStep();
		}, res => {
			this.wizard.step1.setResponse('error', buildErrorResponseMessage(res.error));
		});
	}
}