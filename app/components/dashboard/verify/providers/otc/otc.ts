import { buildErrorResponseMessage } from '../../../../../shared/components/response-messages/response-messages';
import { DashboardService, UserPrivate } from '../../../../../models/dashboard';
import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { NgWizardStep } from 'app/shared/helpers/ng-wizard-step';
import { WizardComponent } from 'angular-archwizard';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfig } from 'app/shared/components/modal/oldModal/modal';

export interface ModalMeVerifyProviderOtcConfig extends ModalConfig {
	insertOtc: boolean;
};

@Component({
	selector: 'me-verify-provider-otc-component',
	templateUrl: 'otc.html',
	styleUrls: ['otc.scss']
})
export class ModalMeVerifyProviderOtcComponent implements OnInit {
	@Input() config: ModalMeVerifyProviderOtcConfig;
	public wizardHandler: WizardComponent;

	@ViewChild(WizardComponent) set contentMulti(content: WizardComponent) {
		this.wizardHandler = content;

		this.wizard.step1.setHandler(this.wizardHandler);
		this.wizard.step2.setHandler(this.wizardHandler);

		if(this.config && this.config.insertOtc) {
			this.wizardHandler.goToNextStep();
			setTimeout(() => this.wizardHandler.goToNextStep(),0)
		} else {
			this.wizard.step3.disable();
			this.wizard.step4.disable();
		}
	};

	wizard: {
		step1: NgWizardStep<{
			country: string;
			region: string;
			city: string;
			zipCode: string;
			street: string;
			streetNumber: string;
		}>;
		step2: NgWizardStep<any>;
		step3: NgWizardStep<{
			otcCode: string;
		}>;
		step4: NgWizardStep<any>;
	}

	user: UserPrivate;

	constructor(
		private dashboardService: DashboardService,
		private translate: TranslateService,
		public activeModal: NgbActiveModal
	) {
		/* FORMS */

		this.wizard = { step1: null, step2: null, step3: null, step4: null };

		//STEP 1

		this.wizard.step1 = new NgWizardStep();

		this.wizard.step1.setTitles({
			main: this.translate.instant('Address'),
			heading: this.translate.instant('Confirm your address')
		});

		//STEP 2

		this.wizard.step2 = new NgWizardStep();

		this.wizard.step2.setTitles({
			main: this.translate.instant('Send OTC'),
			heading: this.translate.instant('Wait the OTC')
		});

		//STEP 3

		this.wizard.step3 = new NgWizardStep();

		this.wizard.step3.setTitles({
			main: this.translate.instant('Insert OTC'),
			heading: this.translate.instant('Insert here the code received through snail mail')
		});

		//otcCode
		this.wizard.step3.addField({
			type: 'input',
			key: 'otcCode',
			templateOptions: {
				type: 'text',
				label: this.translate.instant('OTC Code'),
				placeholder: 'jdf76ey38rhd63',
				required: true
			},
			validators: { validation: ['alphanumeric'] }
		});

		//FINISH
	
		this.wizard.step4 = NgWizardStep.createFinishStep(this.translate);
	}

	confirmAddress () {
		this.wizard.step1.resetResponse();

		this.dashboardService.doVerificationStep('otc', 0, {}).subscribe(_ => {
			this.dashboardService.emitNotificationUpdate('verify');
			this.wizardHandler.goToNextStep();
		}, res => {
			this.wizard.step1.setResponse('error', buildErrorResponseMessage(res.error));
		});
	}

	sendOtcCode () {
		this.wizard.step3.resetResponse();

		const json = {
			otc: this.wizard.step3.model.otcCode
		};

		this.dashboardService.doVerificationStep('otc', 1, json).subscribe(_ => {
			this.dashboardService.emitNotificationUpdate('verify');
			this.wizardHandler.goToNextStep();
		}, res => {
			this.wizard.step3.setResponse('error', buildErrorResponseMessage(res.error));
		});
	}

	ngOnInit() {
		if(!this.config || !this.config.insertOtc)
			this.dashboardService.get().subscribe((user: UserPrivate) => {
				this.user = user;
				
				this.wizard.step1.initializeModel({
					country: this.user.country,
					region: this.user.region,
					city: this.user.city,
					zipCode: this.user.zipcode,
					street: this.user.street,
					streetNumber: this.user.streetnr
				});
			});
	}
}
