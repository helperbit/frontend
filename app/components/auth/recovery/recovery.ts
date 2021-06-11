import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { AuthService } from '../../../models/auth';
import { TranslateService } from '@ngx-translate/core';
import { Component, ViewChild } from '@angular/core';
import { WizardComponent } from 'angular-archwizard';
import { NgWizardStep } from 'app/shared/helpers/ng-wizard-step';
import { FormControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { isEmpty, getLocalStorage } from 'app/shared/helpers/utils';
import { ActivatedRoute } from '@angular/router';
import AppSettings from 'app/app.settings';
import { OnTranslateLoad } from 'app/shared/helpers/on-translate-load';

@Component({
	selector: 'recovery-component',
	templateUrl: 'recovery.html',
	styleUrls: ['../../../sass/main/custom/page.scss']
})
export class RecoveryComponent extends OnTranslateLoad {
	public wizardHandler: WizardComponent;

	@ViewChild(WizardComponent) set contentMulti(content: WizardComponent) {
		this.wizardHandler = content;

		this.wizard.step1.setHandler(this.wizardHandler);
		this.wizard.step2.setHandler(this.wizardHandler);
		this.wizard.step3.setHandler(this.wizardHandler);
		this.wizard.step4.setHandler(this.wizardHandler);
		
		if (! this.route.snapshot.queryParamMap.has('token'))
			return;
		
		this.wizard.step3.model.userToken = this.route.snapshot.queryParamMap.get('token');
		//use this methods to show the step from which start the wizard and be sure that the step circles become green
		//DOC https://github.com/madoar/angular-archwizard
		this.wizardHandler.goToStep(1);
		this.wizardHandler.goToStep(2);
	};
	
	pageHeader: PageHeaderConfig;
	wizard: {
		step1: NgWizardStep<{ email: string }>;
		step2: NgWizardStep<void>;
		step3: NgWizardStep<{
			userToken: string;
			password: string;
		}>;
		step4: NgWizardStep<void>;
	};
	username: string;

	constructor(
		private authService: AuthService,
		private route: ActivatedRoute,
		translate: TranslateService
	) {
		super(translate);
	}

	ngOnTranslateLoad(translate) {
		this.pageHeader = {
			description: {
				title: translate.instant('account recovery'),
				subTitle: translate.instant('Recover your account credentials')
			}
		};

		/* FORMS */

		this.wizard = { step1: null, step2: null, step3: null, step4: null };

		//STEP 1

		this.wizard.step1 = new NgWizardStep();

		this.wizard.step1.setTitles({
			main: translate.instant('Reset'),
			heading: translate.instant('Reset Password'),
			description: translate.instant('Type your email address, a reset link will be sent to that address.')
		});

		//email
		this.wizard.step1.addField({
			type: 'email',
			key: 'email',
			templateOptions: {
				label: translate.instant('Email'),
				placeholder: translate.instant('Email'),
				required: true,
				hideAsterisk: true
			}
		});

		//captcha
		this.wizard.step1.addField({ type: 'recaptcha', key: 'captcha' });

		//STEP 2

		this.wizard.step2 = new NgWizardStep();

		this.wizard.step2.setTitles({
			main: translate.instant('Send'),
			heading: translate.instant('Reset Link Sent')
		});

		//STEP 3

		this.wizard.step3 = new NgWizardStep();

		this.wizard.step3.initializeModel({ password: '', userToken: '' });
		this.wizard.step3.setTitles({
			main: translate.instant('Password'),
			heading: translate.instant('New Password'),
			description: translate.instant('Insert your new password.')
		});

		//password
		this.wizard.step3.addField({
			type: 'password',
			key: 'password',
			templateOptions: {
				label: translate.instant('Password'),
				placeholder: translate.instant('Password'),
				required: true,
				hideAsterisk: true
			},
			validators: {
				containsUsername: {
					expression: (control: FormControl, field: FormlyFieldConfig) => {
						if (!isEmpty(control.value) && !isEmpty(this.username) && control.value.toLowerCase().indexOf(this.username.toLowerCase()) != -1)
							return false;
						return true;
					},
					// message: (err, field: FormlyFieldConfig) => translate.instant('Password cannot contains username')
					message: translate.instant('Password cannot contains username')
				}
			}
		});

		//passwordConfirm
		this.wizard.step3.addField({
			type: 'password',
			key: 'passwordConfirm',
			templateOptions: {
				label: translate.instant('Password Confirm'),
				placeholder: translate.instant('Password Confirm'),
				required: true,
				hideAsterisk: true
			},
			validators: {
				equals: {
					expression: (control: FormControl, field: FormlyFieldConfig) => control.value === this.wizard.step3.model.password,
					// message: (err, field: FormlyFieldConfig) => translate.instant('This field must be equal to password')
					message: translate.instant('This field must be equal to password')
				}
			}
		});

		//captcha
		if (AppSettings.features.captcha)
			this.wizard.step3.addField({ type: 'recaptcha', key: 'captcha' });

		//FINISH

		this.wizard.step4 = NgWizardStep.createFinishStep(translate);
	}

	resetPassword() {
		this.wizard.step1.resetResponse();

		this.authService.resetPassword(this.wizard.step1.model.email).subscribe(_ => {
			this.wizard.step1.next();
		}, res => {
			this.wizard.step1.captchaExpire();
			this.wizard.step1.setResponse('error', res.error);
		});
	}

	changePassword() {
		this.wizard.step3.resetResponse();

		const json = {
			token: this.wizard.step3.model.userToken,
			newpassword: this.wizard.step3.model.password
		};

		this.authService.changePassword(json).subscribe(_ => {
			this.wizard.step3.next();
		}, res => {
			this.wizard.step3.captchaExpire();
			this.wizard.step3.setResponse('error', res.error);
		});
	}

	ngOnInit() {
		this.ngOnTranslateLoad(this.translate);
		this.username = getLocalStorage().getItem('username');
	}
}