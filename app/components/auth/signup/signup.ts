import { ModalConfig } from '../../../shared/components/modal/oldModal/modal';
import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, AuthSignupData } from '../../../models/auth';
import AppSettings from '../../../app.settings';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgWizardStep } from '../../../shared/helpers/ng-wizard-step';
import { WizardComponent } from 'angular-archwizard';
import { FormFieldGroup } from '../../../shared/ngx-formly/form-field-group';
import { FormControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { isEmpty } from '../../../shared/helpers/utils';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { openModalWhySignup, UserTypeInfo } from './modals/why-signup/why-signup';
import { OnTranslateLoad } from 'app/shared/helpers/on-translate-load';

const ga = window.ga;

@Component({
	selector: 'signup-component',
	templateUrl: 'signup.html',
	styleUrls: ['../../../sass/main/custom/page.scss', 'signup.scss']
})
export class SignupComponent extends OnTranslateLoad implements OnInit {
	public wizardHandler: WizardComponent;

	@ViewChild(WizardComponent) set contentMulti(content: WizardComponent) {
		this.wizardHandler = content;

		this.wizard.step0.setHandler(this.wizardHandler);
		this.wizard.step1.setHandler(this.wizardHandler);
		this.wizard.step2.setHandler(this.wizardHandler);

		setTimeout(() => {
			if (this.route.snapshot.paramMap.has('type')) {
				this.landing = true;
				this.startSignup(this.route.snapshot.paramMap.get('type'));
			}
		}, 0);
	};
	
	pageHeader: PageHeaderConfig;
	modals: { [modalName: string]: ModalConfig };
	wizard: {
		step0: NgWizardStep<{ userType: string }>;
		step1: NgWizardStep<{
			userInformation: {
				username: string;
				email: string;
				password: string;
				invitationCode?: string;
				emailLanguage: string;
			};
			otherControls: {
				policyConsent: boolean;
				newsletter: boolean;
			};
		}>;
		step2: NgWizardStep<any>;
	};
	userTypeInfo: UserTypeInfo[];
	landing: boolean;

	constructor(
		private authService: AuthService, 
		private route: ActivatedRoute,
		translate: TranslateService,
		private modalService: NgbModal
	) {
		super(translate);
	}

	ngOnTranslateLoad(translate) {
		this.userTypeInfo = [];

		this.pageHeader = {
			description: {
				title: translate.instant('registration form')
			}
		};

		this.modals = {
			whySignup: {
				id: 'whySignupModal',
				modalClass: 'modal-md',
				hideCloseButton: true,
				title: null
			}
		};

		/* FORMS */

		this.wizard = { step0: null, step1: null, step2: null };

		let fieldGroup: FormFieldGroup;

		//STEP 0

		this.wizard.step0 = new NgWizardStep();
		this.wizard.step0.initializeModel({ userType: '' });
		this.wizard.step0.setTitles({
			main: translate.instant('User Type'),
			heading: translate.instant('Create your account')
		});

		//STEP 1

		this.wizard.step1 = new NgWizardStep();

		this.wizard.step1.initializeModel({
			userInformation: {
				username: '',
				email: '',
				password: '',
				emailLanguage: translate.currentLang
			},
			otherControls: {
				policyConsent: false,
				newsletter: false
			}
		});

		this.wizard.step1.setTitles({
			main: translate.instant('Register'),
			heading: translate.instant('Create your account'),
		});

		fieldGroup = new FormFieldGroup();
		fieldGroup.setKey('userInformation');

		//username
		fieldGroup.addField({
			type: 'input',
			key: 'username',
			templateOptions: {
				type: 'text',
				label: translate.instant('Username'),
				placeholder: translate.instant('Username'),
				required: true,
				minLength: AppSettings.form.length.min.username,
				hideAsterisk: true,
				change: (field: FormlyFieldConfig, event?: any) => {
					if (field.model[field.key])
						this.wizard.step1.model.userInformation.username = this.wizard.step1.model.userInformation.username.toLowerCase();
				},
				labelPlaceholder: true
			},
			validators: {
				username: {
					expression: (control: FormControl, field: FormlyFieldConfig) => AppSettings.form.regex.username.test(control.value),
					message: (err, field: FormlyFieldConfig) => translate.instant('This field can contain lowercase characters, number and underscore symbol')
					// message: translate.instant('This field can contain lowercase characters, number and underscore symbol')
				}
			}
		});

		//email
		fieldGroup.addField({
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
		fieldGroup.addField({
			type: 'password',
			key: 'password',
			templateOptions: {
				label: translate.instant('Password'),
				placeholder: translate.instant('Password'),
				required: true,
				hideAsterisk: true,
				labelPlaceholder: true
			},
			validators: {
				containsUsername: {
					expression: (control: FormControl, field: FormlyFieldConfig) => {
						if (!isEmpty(control.value) && !isEmpty(this.wizard.step1.model.userInformation.username) && control.value.toLowerCase().indexOf(this.wizard.step1.model.userInformation.username.toLowerCase()) != -1)
							return false;
						return true;
					},
					message: translate.instant('Password cannot contains username')
				},
				containsEmail: {
					expression: (control: FormControl, field: FormlyFieldConfig) => {
						if (!isEmpty(control.value) && !isEmpty(this.wizard.step1.model.userInformation.email) && control.value.toLowerCase().indexOf(this.wizard.step1.model.userInformation.email.toLowerCase()) != -1)
							return false;
						return true;
					},
					message: translate.instant('Password cannot contains email')
				},
			}
		});

		//passwordConfirm
		fieldGroup.addField({
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
						control.value == this.wizard.step1.model.userInformation.password,
					// message: (err, field: FormlyFieldConfig) => translate.instant('This field must be equal to password')
					message: translate.instant('This field must be equal to password')
				}
			}
		});

		//invitationCode
		fieldGroup.addField({
			type:'input',
			key: 'invitationCode',
			templateOptions: {
				// required: false,
				type: 'text',
				label: translate.instant('Invitation Code (optional)'),
				placeholder: '123',
				helperTooltip: {
					content: translate.instant('Write here the code of the user that invite you to signup on Helperbit and get the badge!')
				},
				change: (field: FormlyFieldConfig, event?: any) => {
					const code = field.model[field.key].split('?refby=');

					if (code.length >= 2)
						this.wizard.step1.model.userInformation.invitationCode = code[1];
				}
			},
			validators: {
				// alphanumeric: {
				// 	expression: (control: FormControl, field: FormlyFieldConfig) => AppSettings.form.regex.alphanumeric.test(control.value)
				// }
				number: {
					expression: (control: FormControl, field: FormlyFieldConfig) => {
						if (control.value && control.value.length > 0)
							return AppSettings.form.regex.number.test(control.value);
						else
							return true;
					}
				}
			}
		});

		//emailLanguage
		fieldGroup.addField({
			type: 'select',
			key: 'emailLanguage',
			templateOptions: {
				label: translate.instant('Language') + ' ' + translate.instant('(optional)'),
				required: false,
				options: [
					{
						label: translate.instant('Italian'),
						value: 'it'
					},
					{
						label: translate.instant('English'),
						value: 'en'
					},
					{
						label: translate.instant('Spanish'),
						value: 'es'
					}
				]
			}
		});

		this.wizard.step1.addFieldGroup(fieldGroup);

		fieldGroup = new FormFieldGroup();
		fieldGroup.setKey('otherControls');

		// policyConsent
		fieldGroup.addField({
			type: 'policyConsent',
			key: 'policyConsent',
			templateOptions: {
				required: true
			}
		});

		//newsletter
		fieldGroup.addField({
			type: 'checkbox',
			key: 'newsletter',
			templateOptions: {
				label: translate.instant('Subscribe to newsletter'),
				description: translate.instant('We will provide you news and updates about 1 time per month. You may unsubscribe any time by clicking the unsubscribe-link in our newsletter.')
			}
		});

		//captcha
		fieldGroup.addField({ type: 'recaptcha', key: 'captcha' });

		this.wizard.step1.addFieldGroup(fieldGroup);

		//STEP 2

		this.wizard.step2 = NgWizardStep.createFinishStep(this.translate);	
	}

	setUsertypeInfo(type: string) {
		switch (type) {
			case 'singleuser': {
				this.userTypeInfo = [
					{ symbol: 'fa-check', text: this.translate.instant('100% free') },
					{ symbol: 'fa-universal-access', text: this.translate.instant('Receive donations if you are in need') },
					{ symbol: 'fa-ambulance', text: this.translate.instant('Donate directly to humanitarian causes') },
					{ symbol: 'fa-bar-chart', text: this.translate.instant('Monitor in real time the path of your donations') },
					{ symbol: 'fa-credit-card', text: this.translate.instant('Over 24+ Altcoins accepted here') }, //Credit/Debit Card and o
					{ symbol: 'fa-btc', text: this.translate.instant('High Secure Bitcoin Wallet') },
					{ symbol: 'fa-trophy', text: this.translate.instant('Invite friends and win amazing prizes!') }
				];
				break;
			}
			case 'npo':
			case 'municipality': {
				this.userTypeInfo = [
					{ symbol: 'fa-check', text: this.translate.instant('100% free') },
					{ symbol: 'fa-paper-plane', text: this.translate.instant('Start receive bitcoin donations') },
					{ symbol: 'fa-user-times', text: this.translate.instant('No intermediaries') },
					{ symbol: 'fa-file-text-o', text: this.translate.instant('No contracts') },
					{ symbol: 'fa-plus', text: this.translate.instant('Increase your donor base') },
					{ symbol: 'fa-star', text: this.translate.instant('Make stronger the relationship with your supporters') },
					{ symbol: 'fa-eur', text: this.translate.instant('Withdraw local currency (EUR,USD)') },
					{ symbol: 'fa-btc', text: this.translate.instant('Bitcoin and over 24+ Altcoins supported') },
					{ symbol: 'fa-hand-pointer-o', text: this.translate.instant('Add donation button on your website') },
					{ symbol: 'fa-credit-card', text: this.translate.instant('Track donations on blockchain') }, //Credit/Debit Card 
					{ symbol: 'fa-paperclip', text: this.translate.instant('Simplify internal audit and procedure') },
					{ symbol: 'fa-info', text: this.translate.instant('Live support 24/7') }
				];
				break;
			}
			case 'company': {
				this.userTypeInfo = [
					{ symbol: 'fa-money', text: this.translate.instant('No membership fee') },
					{ symbol: 'fa-file-text-o', text: this.translate.instant('No contracts') },
					{ symbol: 'fa-image', text: this.translate.instant('Match your brand with a cause') },
					{ symbol: 'fa-star', text: this.translate.instant('Leverage your CSR strategy') },
					{ symbol: 'fa-btc', text: this.translate.instant('Create your own High Secure Bitcoin Wallet') }
				];
				break;
			}
		}
	}

	showModal() {
		openModalWhySignup(this.modalService, {
			...this.modals.whySignup,
			userTypeInfo: this.userTypeInfo
		}).result.then((v) => { }, () => { });
	}

	socialLogin(socialName) {
		window.location.href = AppSettings.apiUrl + '/auth/social/' + socialName + '/login';
	}

	startSignup(userType: string) {
		this.wizard.step0.resetResponse();
		switch (userType) {
			case 'singleuser': {
				this.wizard.step1.titles.link = this.translate.instant('Check singleuser advantages!');
				this.modals.whySignup.title = this.translate.instant('Singleuser advantages');
				break;
			}
			case 'npo': {
				this.wizard.step1.titles.link = this.translate.instant('Check non-profit advantages!');
				this.modals.whySignup.title = this.translate.instant('Organization advantages');
				break;
			}
			// case 'municipality': {
			// 	this.wizard.step1.titles.link = this.translate.instant('Check municipality advantages!');
			// 	this.modals.whySignup.title = this.translate.instant('Municipality advantages');
			// 	break;
			// }
			case 'company': {
				this.wizard.step1.titles.link = this.translate.instant('Check company advantages!');
				this.modals.whySignup.title = this.translate.instant('Company advantages');
				break;
			}
		}

		this.wizard.step0.model.userType = userType;
		this.setUsertypeInfo(userType);
		this.wizardHandler.goToStep(1);
	}

	signup() {
		this.wizard.step1.resetResponse();
		const json: AuthSignupData = {
			username: this.wizard.step1.model.userInformation.username,
			email: this.wizard.step1.model.userInformation.email,
			password: this.wizard.step1.model.userInformation.password,
			terms: this.wizard.step1.model.otherControls.policyConsent,
			newsletter: this.wizard.step1.model.otherControls.newsletter,
			usertype: null
		};

		if (this.wizard.step1.model.userInformation.invitationCode)
			json.refby = this.wizard.step1.model.userInformation.invitationCode;
		if (this.wizard.step1.model.userInformation.emailLanguage)
			json.language = this.wizard.step1.model.userInformation.emailLanguage;

		switch (this.wizard.step0.model.userType) {
			case 'singleuser':
			case 'npo':
			case 'company': {
				json.usertype = this.wizard.step0.model.userType;
				break;
			}
			case 'municipality': {
				json.usertype = 'npo';
				json.subtype = this.wizard.step0.model.userType;
				break;
			}
		}

		this.authService.signup(json).subscribe(_ => {
			ga('send', {
				hitType: 'event',
				eventCategory: 'User',
				eventAction: 'signup',
				eventLabel: this.wizard.step1.model.userInformation.username
			});

			ga('send', {
				'hitType': 'pageview',
				'page': '/signup/done'
			});

			this.wizard.step1.next();
		}, res => {
			this.wizard.step1.captchaExpire();
			this.wizard.step1.setResponse('error', res.error);
		});
	}

	ngOnInit() {
		this.ngOnTranslateLoad(this.translate);
		
		if (this.route.snapshot.queryParamMap.has('refby')) {
			const refby = this.route.snapshot.queryParamMap.get('refby');
			this.wizard.step1.model.userInformation.invitationCode = refby;

			ga('send', {
				hitType: 'event',
				eventCategory: 'User',
				eventAction: 'land_with_ref',
				eventLabel: refby
			});
		}
	}
}
