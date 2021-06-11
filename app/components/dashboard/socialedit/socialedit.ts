import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { AuthService } from '../../../models/auth';
import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgWizardStep } from 'app/shared/helpers/ng-wizard-step';
import { WizardComponent } from 'angular-archwizard';
import { FormControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

/* User profile /me/socialedit */
@Component({
	selector: 'social-edit-component',
	templateUrl: 'socialedit.html',
	styleUrls: ['../../../sass/main/custom/page.scss']
})
export class MeSocialEditComponent {
	public wizardHandler: WizardComponent;
	public pageHeader: PageHeaderConfig;
	public wizard: {
		step0: NgWizardStep<{
			email: string;
			password: string;
			passwordConfirm: string;
		}>;
		step1: NgWizardStep<any>;
	};

	@ViewChild(WizardComponent) set contentMulti(content: WizardComponent) {
		this.wizardHandler = content;

		this.wizard.step0.setHandler(this.wizardHandler);
		this.wizard.step1.setHandler(this.wizardHandler);
	};


	constructor(private authService: AuthService, translate: TranslateService) {
		this.pageHeader = {
			description: {
				title: translate.instant('Account settings'),
				subTitle: translate.instant('Set an email and password for your account')
			}
		};

		/* FORMS */

		this.wizard = { step0: new NgWizardStep(), step1: new NgWizardStep() };


		//STEP 1

		this.wizard.step0 = new NgWizardStep();
		this.wizard.step0.setTitles({
			main: translate.instant('Setup'),
			description: translate.instant('You need to setup your account email and password to use all the functionalities of Helperbit.')
		});


		//email
		this.wizard.step0.addField({
			type: 'email',
			key: 'email',
			templateOptions: {
				label: translate.instant('Email'),
				placeholder: translate.instant('Email'),
				required: true,
				hideAsterisk: true,
				labelPlaceholder: true
			}
		});

		//password
		this.wizard.step0.addField({
			type: 'password',
			key: 'password',
			templateOptions: {
				label: translate.instant('Password'),
				placeholder: translate.instant('Password'),
				required: true,
				hideAsterisk: true,
				labelPlaceholder: true
			}
		});

		//passwordConfirm
		this.wizard.step0.addField({
			type: 'password',
			key: 'passwordConfirm',
			templateOptions: {
				label: translate.instant('Password Confirm'),
				placeholder: translate.instant('Password Confirm'),
				required: true,
				hideAsterisk: true,
				labelPlaceholder: true
			},
			validators: {
				equals: {
					expression: (control: FormControl, field: FormlyFieldConfig) =>
						control.value == this.wizard.step0.model.password,
					// message: (err, field: FormlyFieldConfig) => translate.instant('This field must be equal to password')
					message: translate.instant('This field must be equal to password')
				}
			}
		});

		this.wizard.step1 = NgWizardStep.createFinishStep(translate);
	}

	submit(model) {
		this.wizard.step0.resetResponse();

		const json = {
			email: model.email,
			password: model.password,
			password2: model.passwordConfirm
		};

		this.authService.socialEdit(json).subscribe(_ => {
			this.wizard.step0.next();
		}, (res) => {
			this.wizard.step0.setResponse('error', res.error);
		});
	}
}
