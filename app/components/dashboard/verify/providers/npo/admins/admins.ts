import { UtilsService } from '../../../../../../services/utils';
import { getValueFormArrayByKeyName, getMediaUrl, getLocalStorage } from '../../../../../../shared/helpers/utils';
import { buildErrorResponseMessage } from '../../../../../../shared/components/response-messages/response-messages';
import { DashboardService, UserPrivate } from '../../../../../../models/dashboard';
import AppSettings from '../../../../../../app.settings';
import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { ModalConfig } from 'app/shared/components/modal/oldModal/modal';
import { WizardComponent } from 'angular-archwizard';
import { NgWizardStep } from 'app/shared/helpers/ng-wizard-step';
import { DropzoneFile } from 'app/shared/components/dropzone/dropzone';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormFieldGroup } from 'app/shared/ngx-formly/form-field-group';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormControl, Validators } from '@angular/forms';

export interface UserAdminsFields {
	firstName: string;
	lastName: string;
	idNumber: string;
	email: string;
}

export interface UserAdminsFieldsApi {
	firstname: string;
	lastname: string;
	idnumber: string;
	email: string;
}

export interface ModalMeVerifyProviderNpoAdminsConfig extends ModalConfig {
	info: {
		incharge: UserAdminsFieldsApi;
		referent: UserAdminsFieldsApi;
		admins: UserAdminsFieldsApi[];
	};
	media?: DropzoneFile[];
};

@Component({
	selector: 'me-verify-provider-admins-component',
	templateUrl: 'admins.html',
	styleUrls: ['admins.scss']
})
export class ModalMeVerifyProviderNpoAdminsComponent implements OnInit {
	@Input() config: ModalMeVerifyProviderNpoAdminsConfig;
	public wizardHandler: WizardComponent;

	@ViewChild(WizardComponent) set contentMulti(content: WizardComponent) {
		this.wizardHandler = content;

		this.wizard.step1.setHandler(this.wizardHandler);
		this.wizard.step2.setHandler(this.wizardHandler);
		this.wizard.step3.setHandler(this.wizardHandler);
	};

	wizard: {
		step1: NgWizardStep<{
			representativeBody: string;
			personInCharge: UserAdminsFields;
			admin1: UserAdminsFields;
			admin2: UserAdminsFields;
			admin3: UserAdminsFields;
			admin4?: UserAdminsFields;
			admin5?: UserAdminsFields;
			admin6?: UserAdminsFields;
			admin7?: UserAdminsFields;
			admin8?: UserAdminsFields;
		}>;
		step2: NgWizardStep<{
			media: DropzoneFile[];
		}>;
		step3: NgWizardStep<{
			media: (DropzoneFile & { mid: string });
		}>;
		step4: NgWizardStep<any>;
	};
	
	// TODO
	// $location: angular.ILocationService;

	editMode: boolean;
	isDocumentPrinted: boolean;
	adminsConfig: {
		min: number;
		max: number;
		current: number;
	}
	user: UserPrivate;
	today: Date;

	constructor(
		private dashboardService: DashboardService,
		private translate: TranslateService,
		private utilsService: UtilsService,
		public activeModal: NgbActiveModal
	) {
		this.editMode = false;
		this.isDocumentPrinted = false;
		this.adminsConfig = { min: 3, max: 8, current: 3 };
		this.today = new Date();
		this.user = null;

		/* FORMS */

		/*
		
			TODO - IMPORTANT

			bisogna fare il validation dei vari campi email (sia su ogni email di admin[N] che su personInCharge, se settata)
			e controllare che tutte le email siano diverse. Solo questo, la validazione dell'email con altri validator
			si lascia fare al singolo field quando cambia il valore da parte dell'utente.

			per gli idNumber invece va fatto il check solo su quelli degli admin[N] visto che ci può stare un id uguale a quella
			dell'eventuale person in charge

		*/

		// const isDifferentEmailValid = (control: FormControl, field: FormlyFieldConfig) => {
		// 	let valid = true;

		// 	if(!this.user) return valid;
		// 	//check the field group key
		// 	if(field.parent.key == 'personInCharge')
		// 		valid = isEmailValid(control.value);
		// 	else {
		// 		const adminNumber = Number(field.parent.key.split('admin')[1]);

		// 		valid = isEmailValid(control.value, adminNumber);
		// 	}
		// 	return valid;
		// };

		// const validateEmailFields = () => {
		// 	for (let index = 0; index < this.adminsConfig.current; index++) {
		// 		const inputAdmin: FormlyFieldConfig = this.wizard.step1.getField('email', 'admin' + (index + 1));
		// 		const formControlAdmin = this.wizard.step1.getFieldFormControl('email', 'admin' + (index + 1));
		// 		if(!isDifferentEmailValid(formControlAdmin, inputAdmin)) {
		// 			if(formControlAdmin.errors)
		// 				formControlAdmin.setErrors({ ...formControlAdmin.errors, differentEmail: true });
		// 			else
		// 				formControlAdmin.setErrors({ differentEmail: true });
		// 		}
		// 		else if (formControlAdmin.errors && formControlAdmin.errors.differentEmail){
		// 			delete formControlAdmin.errors['differentEmail'];

		// 			if(formControlAdmin.errors)
		// 				formControlAdmin.setErrors({ ...formControlAdmin.errors });
		// 			else
		// 				formControlAdmin.setErrors(null);
		// 		}

		// 		// debugger
		// 		// this.wizard.step1.value[inputAdmin.key].$validate();
		// 		// this.wizard.step1.form.value['admin' + (index + 1) + 'Email'].$validate();
		// 	}
		// };

		const isIdNumberValid = (value: string, adminNumber: number) => {
			//check when the value is one of the admin[N] idNumber
			for (let index = 0; index < this.adminsConfig.current; index++)
				if (index != adminNumber-1)
					if (value == this.wizard.step1.model['admin' + (index + 1)].idNumber)
						return false;

			return true;
		}

		const isEmailValid = (value: string, adminNumber?: number) => {
			//standard check with user email
			if(value == this.user.email)
				return false;

			//if rapresentativeBody is a person and adminNumber is set
			//(means the field is not personCharge) check also is email
			if(this.wizard.step1.model.representativeBody == 'person' && adminNumber && value == this.wizard.step1.model.personInCharge.email)
				return false;

			//check when the value is one of the admin[N] email
			for (let index = 0; index < this.adminsConfig.current; index++)
				if (index != adminNumber-1)
					if (value == this.wizard.step1.model['admin' + (index + 1)].email)
						return false;

			return true;
		}

		//OLD formly angular js version
		// const adminsValidator = (value, key, indexNoCheck) => {
		// 	let check = true;

		// 	for (let index = 0; index < this.adminsConfig.current; index++) {
		// 		if (index != indexNoCheck) {
		// 			if (value == this.wizard.step1.model['admin' + (index + 1)][key]) {
		// 				check = false;
		// 				break;
		// 			}
		// 		}
		// 	}

		// 	return check;
		// }

		/* FORMS */

		this.wizard = { step1: null, step2: null, step3: null, step4: null };

		let fieldGroup: FormFieldGroup = null;

		//STEP 1

		this.wizard.step1 = new NgWizardStep();

		this.wizard.step1.initializeModel({
			representativeBody: 'person',
			personInCharge: {
				firstName: null,
				lastName: null,
				idNumber: null,
				email: null
			},
			admin1: {
				firstName: null,
				lastName: null,
				idNumber: null,
				email: null
			},
			admin2: {
				firstName: null,
				lastName: null,
				idNumber: null,
				email: null
			},
			admin3: {
				firstName: null,
				lastName: null,
				idNumber: null,
				email: null
			}
		});

		this.wizard.step1.setTitles({
			main: translate.instant('Document'),
			heading: translate.instant('Insert Admins')
		});

		//representativeBody
		// this.wizard.step1.addField({
		// 	type: 'radio',
		// 	key: 'representativeBody',
		// 	className: 'col-lg-6 col-md-6 col-sm-12 col-xs-12 admins-custom-label',
		// 	templateOptions: {
		// 		label: translate.instant('[select​ the​ right option]'),
		// 		required: true,
		// 		hideAsterisk: true,
		// 		options: [
		// 			{
		// 				label: translate.instant('The Board of Directors'),
		// 				value: 'board'
		// 			},
		// 			{
		// 				label: translate.instant('The person in charge of the fundraising sector'),
		// 				value: 'person'
		// 			}
		// 		],
		// 		change: (field: FormlyFieldConfig, event?: any) => {
		// 			this.isDocumentPrinted = false;
		// 			//valido le mail al cambio del radio box dato che formly cancella il form di validazione del referente quando scompare e quindi non risulterebbero errori
		// 			for (let index = 0; index < this.adminsConfig.current; index++) {
		// 				const inputAdmin: FormlyFieldConfig = this.wizard.step1.getField('email', 'admin' + (index + 1));
		// 				const formControlAdmin = this.wizard.step1.getFieldFormControl('email', 'admin' + (index + 1));
		// 				if(inputAdmin.validators.differentEmail.expression(formControlAdmin, inputAdmin))
		// 					formControlAdmin.setErrors({ ...formControlAdmin.errors, differentEmail: true });
		// 				else {
		// 					delete formControlAdmin.errors['differentEmail'];
		// 					formControlAdmin.setErrors({ ...formControlAdmin.errors });
		// 				}

		// 				// debugger
		// 				// this.wizard.step1.value[inputAdmin.key].$validate();
		// 				// this.wizard.step1.form.value['admin' + (index + 1) + 'Email'].$validate();
		// 			}
		// 		}
		// 	}
		// });

		//DYNAMIC PART

		const getFieldBasic = (): FormlyFieldConfig => {
			return {
				type: null,
				key: null,
				className: 'col-lg-3 col-md-3 col-sm-12 col-xs-12',
				templateOptions: {
					label: null,
					placeholder: null,
					hideAsterisk: true,
					change: (field: FormlyFieldConfig, event?: any) => {
						this.isDocumentPrinted = false;
					}
				}
			};
		}

		const getFieldFirstName = (config: FormlyFieldConfig) => {
			const field = getFieldBasic();

			field.type = 'input';
			field.key = 'firstName';
			field.templateOptions.type = 'text';
			field.templateOptions.label = translate.instant('First Name');
			field.templateOptions.placeholder = config.templateOptions.placeholder;
			field.templateOptions.minLength = AppSettings.form.length.min.firstName;
			field.validators = {
				validation: ['fullName']
			};

			//just optional fields
			if(config.templateOptions.required)
				field.templateOptions.required = config.templateOptions.required;
			if(config.expressionProperties)
				field.expressionProperties = config.expressionProperties;
			if(config.validators)
				field.validators = config.validators;

			return field;
		};

		const getFieldLastName = (config: FormlyFieldConfig) => {
			const field = getFieldBasic();

			field.type = 'input';
			field.key = 'lastName';
			field.templateOptions.type = 'text';
			field.templateOptions.label = translate.instant('Last Name');
			field.templateOptions.placeholder = config.templateOptions.placeholder;
			field.templateOptions.minLength = AppSettings.form.length.min.lastName;
			field.validators = {
				validation: ['fullName']
			};

			//just optional fields
			if(config.templateOptions.required)
				field.templateOptions.required = config.templateOptions.required;
			if(config.expressionProperties)
				field.expressionProperties = config.expressionProperties;
			if(config.validators)
				field.validators = config.validators;

			return field;
		};

		const getFieldIdNumber = (config: FormlyFieldConfig) => {
			const field = getFieldBasic();

			field.type = 'input';
			field.key = 'idNumber';
			field.templateOptions.type = 'text';
			field.templateOptions.label = translate.instant('ID Number');
			field.templateOptions.placeholder = config.templateOptions.placeholder;
			field.templateOptions.minLength = AppSettings.form.length.min.idNumber;
			field.validators = {
				validation: ['alphanumeric'],
				differentIdNumber: {
					expression: (control: FormControl, field: FormlyFieldConfig) => {
						if(field.parent.key != 'personInCharge') {
							const adminNumber = Number(field.parent.key.split('admin')[1]);
							return isIdNumberValid(control.value, adminNumber);
						}
						return true;
					},
					message: translate.instant('The id number of each admin must be different')
				}
			};

			//just optional fields
			if(config.templateOptions.required)
				field.templateOptions.required = config.templateOptions.required;
			if(config.expressionProperties)
				field.expressionProperties = config.expressionProperties;
			if(config.validators)
				field.validators = config.validators;

			return field;
		};

		const getFieldEmail = (config: FormlyFieldConfig) => {
			const field = getFieldBasic();

			field.type = 'email';
			field.key = 'email';
			field.templateOptions.label = translate.instant('Email');
			field.templateOptions.placeholder = config.templateOptions.placeholder;
			field.validators = {
				validation: [Validators.email],
				differentEmail: {
					expression: (control: FormControl, field: FormlyFieldConfig) => {
						let valid = true;

						if(!this.user) return valid;
						//check the field group key
						if(field.parent.key == 'personInCharge')
							valid = isEmailValid(control.value);
						else {
							const adminNumber = Number(field.parent.key.split('admin')[1]);

							valid = isEmailValid(control.value, adminNumber);
						}
						// validateEmailFields();
						return valid;
					},
					message: translate.instant('The mail of this NPO profile, person in charge and each admin must be different')
				}
			};

			//just optional fields
			if(config.templateOptions.required)
				field.templateOptions.required = config.templateOptions.required;
			if(config.expressionProperties)
				field.expressionProperties = config.expressionProperties;
			if(config.validators)
				field.validators = config.validators;

			return field;
		};

		//END DYNAMIC PART

		fieldGroup = new FormFieldGroup('formly-group');
		fieldGroup.setKey('personInCharge');
		fieldGroup.addFieldGroupLabel(translate.instant('Person in charge'), 
			translate.instant('President, head of fundraising or other equivalent role'));
		//TODO l'exp è da riscrivere con i parametri giusti
		// fieldGroup.setHideExpression((model: any, formState: any, field?: FormlyFieldConfig) => {
		// 	return this.wizard.step1.model.representativeBody != 'person';
		// });
		//TODO serve anche row?
		// fieldGroup.setClassName('row formly-group');

		//personInCharge.FirstName
		fieldGroup.addField(getFieldFirstName({
			templateOptions: {
				placeholder: 'John',
			},
			expressionProperties: {
				'templateOptions.required': 'model.representativeBody == \'person\'',
				// 'templateOptions.disabled': 'model.representativeBody != \'person\''
			},
		}));

		//personInCharge.LastName
		fieldGroup.addField(getFieldLastName({
			templateOptions: {
				placeholder: 'Smith',
			},
			expressionProperties: {
				'templateOptions.required': 'model.representativeBody == \'person\'',
				// 'templateOptions.disabled': 'model.representativeBody != \'person\''
			},
		}));

		//personInCharge.IdNumber
		fieldGroup.addField(getFieldIdNumber({
			templateOptions: {
				placeholder: 'US01245D',
			},
			expressionProperties: {
				'templateOptions.required': 'model.representativeBody == \'person\'',
				// 'templateOptions.disabled': 'model.representativeBody != \'person\''
			},
		}));

		//personInCharge.email
		fieldGroup.addField(getFieldEmail({
			templateOptions: {
				placeholder: 'johnsmith@email.com',
			},
			expressionProperties: {
				'templateOptions.required': 'model.representativeBody == \'person\'',
				// 'templateOptions.disabled': 'model.representativeBody != \'person\''
			},
		}));

		//TODO serve anche row?
		// fieldGroup.setClassName('row formly-group');

		this.wizard.step1.addFieldGroup(fieldGroup);


		fieldGroup = new FormFieldGroup('formly-group');
		fieldGroup.setKey('referent');
		fieldGroup.addFieldGroupLabel(translate.instant('Referent'));
		//TODO l'exp è da riscrivere con i parametri giusti
		//TODO serve anche row?
		// fieldGroup.setClassName('row formly-group');

		//personInCharge.FirstName
		fieldGroup.addField(getFieldFirstName({
			templateOptions: {
				placeholder: 'John',
			},
			expressionProperties: {
				'templateOptions.disabled': 'true'
			},
		}));

		//personInCharge.LastName
		fieldGroup.addField(getFieldLastName({
			templateOptions: {
				placeholder: 'Smith',
			},
			expressionProperties: {
				'templateOptions.disabled': 'true'
			},
		}));

		//personInCharge.IdNumber
		fieldGroup.addField(getFieldIdNumber({
			templateOptions: {
				placeholder: 'US01245D',
			},
			expressionProperties: {
				'templateOptions.disabled': 'true'
			},
		}));

		//personInCharge.email
		fieldGroup.addField(getFieldEmail({
			templateOptions: {
				placeholder: 'johnsmith@email.com',
			},
			expressionProperties: {
				'templateOptions.disabled': 'true'
			},
		}));

		//TODO serve anche row?
		// fieldGroup.setClassName('row formly-group');

		this.wizard.step1.addFieldGroup(fieldGroup);

		//label
		this.wizard.step1.addField({
			type: 'fieldLabel',
			className: 'padding-right-left-15',
			templateOptions: {
				label: translate.instant('Declares that the people in charge ​ of the multisignature wallet created through Helperbit are:')
			}
		});

		const adminsSettings = [
			{
				firstName: {
					placeholder: 'John'
				},
				lastName: {
					placeholder: 'Smith'
				},
				idNumber: {
					placeholder: 'US01245D'
				},
				email: {
					placeholder: 'johnsmithanotheremail@email.com'
				}
			},
			{
				firstName: {
					placeholder: 'Satoshi'
				},
				lastName: {
					placeholder: 'Nakamoto'
				},
				idNumber: {
					placeholder: 'JP874352'
				},
				email: {
					placeholder: 'satoshinakamoto@email.com'
				}
			},
			{
				firstName: {
					placeholder: 'Francesca'
				},
				lastName: {
					placeholder: 'Rossi'
				},
				idNumber: {
					placeholder: 'IT786472'
				},
				email: {
					placeholder: 'francescarossi@email.com'
				}
			}
		];

		for (let index = 0; index < this.adminsConfig.current; index++) {
			let currentAdminInfo = null;

			if(index+1 > this.adminsConfig.min)
				currentAdminInfo = adminsSettings[0];
			else
				currentAdminInfo = adminsSettings[index];

			fieldGroup = new FormFieldGroup('formly-group');
			fieldGroup.setKey('admin' + (index+1));
			fieldGroup.addFieldGroupLabel(translate.instant('Admin') + ' ' + (index + 1));
			//TODO serve anche row?
			// fieldGroup.setClassName('row formly-group');

			//admin[N]FirstName
			fieldGroup.addField(getFieldFirstName({
				templateOptions: {
					placeholder: currentAdminInfo.firstName.placeholder,
					required: true
				}
			}));
	
			//admin[N]LastName
			fieldGroup.addField(getFieldLastName({
				templateOptions: {
					placeholder: currentAdminInfo.lastName.placeholder,
					required: true
				}
			}));
	
			//admin[N]IdNumber
			fieldGroup.addField(getFieldIdNumber({
				templateOptions: {
					placeholder: currentAdminInfo.idNumber.placeholder,
					required: true
				}
			}));
	
			//admin[N]Email
			fieldGroup.addField(getFieldEmail({
				templateOptions: {
					placeholder: currentAdminInfo.email.placeholder,
					required: true
				}
			}));

			this.wizard.step1.addFieldGroup(fieldGroup);
		}

		//STEP 2

		this.wizard.step2 = new NgWizardStep();

		this.wizard.step2.initializeModel({
			media: []
		});

		this.wizard.step2.setTitles({
			main: translate.instant('Upload'),
			heading: translate.instant('Upload the previous document signed')
		});

		//media
		this.wizard.step2.addField({
			type: 'dropzone',
			key: 'media',
			className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center',
			templateOptions: {
				label: translate.instant('Admins'),
				required: true,
				config: {
					exts: AppSettings.form.exts,
					maxSize: AppSettings.form.fileSize.document.max,
					maxFiles: 1,
					minFiles: 1,
					description: translate.instant('Insert your Admins Document')
				},
				helperTooltip: {
					content: this.translate.instant('You will have to upload the Certification of a Manager who appoints the Administrators of the funds. Helperbit provides you the document with the information; you have to print it, ask the Manager to sign it and then upload the signed document')
				}
			}
		});

		//STEP 3

		this.wizard.step3 = new NgWizardStep();

		this.wizard.step3.initializeModel({
			media: null
		});

		this.wizard.step3.setTitles({
			main: translate.instant('Summary'),
			heading: translate.instant('Do you confirm your submission?')
		});

		//FINISH
		
		this.wizard.step4 = NgWizardStep.createFinishStep(this.translate);
	}

	ngOnInit() {
		this.dashboardService.get().subscribe((user: UserPrivate) => {
			this.user = user;
			
			if (Object.keys(this.user).length == 0) return;

			this.today = new Date();
			
			// this.wizard.step1.setModelField('representativeBody', 'person');

			// this.wizard.step1.setModelField('firstName', this.user.referent.firstname, 'personInCharge');
			// this.wizard.step1.setModelField('lastName', this.user.referent.lastname, 'personInCharge');
			// this.wizard.step1.setModelField('idNumber', this.user.referent.idnumber, 'personInCharge');
			// this.wizard.step1.setModelField('email', this.user.referent.email, 'personInCharge');

			this.wizard.step1.setModelField('firstName', this.user.referent.firstname, 'referent');
			this.wizard.step1.setModelField('lastName', this.user.referent.lastname, 'referent');
			this.wizard.step1.setModelField('idNumber', this.user.referent.idnumber, 'referent');
			this.wizard.step1.setModelField('email', this.user.referent.email, 'referent');

			// this.wizard.step1.setModelField('firstName', this.user.referent.firstname, 'admin1');
			// this.wizard.step1.setModelField('lastName', this.user.referent.lastname, 'admin1');
			// this.wizard.step1.setModelField('idNumber', this.user.referent.idnumber, 'admin1');
			
			if (this.config) {
				this.editMode = true;

				//step 1
				if (this.config.info.incharge) {
					this.wizard.step1.setModelField('firstName', this.config.info.incharge.firstname, 'personInCharge');
					this.wizard.step1.setModelField('lastName', this.config.info.incharge.lastname, 'personInCharge');
					this.wizard.step1.setModelField('idNumber', this.config.info.incharge.idnumber, 'personInCharge');
					this.wizard.step1.setModelField('email', this.config.info.incharge.email, 'personInCharge');
				}
				else
					this.wizard.step1.setModelField('representativeBody', 'board');

				for (let i = 0; i < this.config.info.admins.length; i++) {
					const currentAdmin = this.config.info.admins[i];

					this.wizard.step1.setModelField('firstName', currentAdmin.firstname, 'admin' + (i + 1));
					this.wizard.step1.setModelField('lastName', currentAdmin.lastname, 'admin' + (i + 1));
					this.wizard.step1.setModelField('idNumber', currentAdmin.idnumber, 'admin' + (i + 1));
					this.wizard.step1.setModelField('email', currentAdmin.email, 'admin' + (i + 1));
				}

				//TODO è inutile visto che l'utente quando fa il print deve ricaricare il file generato
				//step 2
				if (this.config.media.length > 0) {
					const document = getValueFormArrayByKeyName(this.config.media, 'name', 'admins');
					const documentUrl = getMediaUrl(document.mid + '?token=' + getLocalStorage().getItem('token'));

					this.utilsService.getFileFromUrl({ url: documentUrl, fileName: 'wallet-admins' }).subscribe(file => {
						this.wizard.step2.setModelField('media', file);
					}, res => {
						this.wizard.step1.setResponse('error', buildErrorResponseMessage(res.error))
					});
				}
			}
		}, res => {
			this.wizard.step1.setResponse('error', buildErrorResponseMessage(res.error));
			// this.$location.path('/login');
		});
	}

	sendAdminsInformationAndPrintDocument() {
		this.wizard.step1.resetResponse();

		const json: any = { admins: [] };

		for (let index = 0; index < this.adminsConfig.current; index++) {
			json.admins.push({
				firstname: this.wizard.step1.model['admin' + (index + 1)].firstName,
				lastname: this.wizard.step1.model['admin' + (index + 1)].lastName,
				idnumber: this.wizard.step1.model['admin' + (index + 1)].idNumber,
				email: this.wizard.step1.model['admin' + (index + 1)].email
			});
		}

		if (this.wizard.step1.model.representativeBody == 'person') {
			json.incharge = {
				firstname: this.wizard.step1.model.personInCharge.firstName,
				lastname: this.wizard.step1.model.personInCharge.lastName,
				idnumber: this.wizard.step1.model.personInCharge.idNumber,
				email: this.wizard.step1.model.personInCharge.email
			};
		}
		else
			json.incharge = null;

		this.dashboardService.doVerificationStep('npoadmins', 0, json).subscribe(_ => {
			this.dashboardService.emitNotificationUpdate('verify');
			window.print();
			this.isDocumentPrinted = true;
		}, res => {
			this.wizard.step1.setResponse('error', buildErrorResponseMessage(res.error));
		});
	}

	sendAdminsMedia() {
		this.wizard.step2.resetResponse();

		const media = this.wizard.step2.model.media[0].file;

		this.dashboardService.doVerificationMediaStep('npoadmins', 1, media, '').subscribe(_ => {
			this.dashboardService.getVerify().subscribe(res => {
				const verification = getValueFormArrayByKeyName(res.verification, 'provider', 'npoadmins');
				this.wizard.step3.initializeModel({
					media: getValueFormArrayByKeyName(verification.medias, 'name', 'admins')
				});
				// this.wizard.step3.setModelField('media', getValueFormArrayByKeyName(verification.medias, 'name', 'admins'));

				this.dashboardService.emitNotificationUpdate('verify');
				this.wizardHandler.goToNextStep();
			}, res => {
				this.wizard.step2.setResponse('error', buildErrorResponseMessage(res.error));	
			});
		}, res => {
			this.wizard.step2.setResponse('error', buildErrorResponseMessage(res.error));
		});
	}

	confirmAdmins() {
		this.wizard.step3.resetResponse();

		this.dashboardService.doVerificationStep('npoadmins', 2, {}).subscribe(_ => {
			this.dashboardService.emitNotificationUpdate('verify');
			this.wizardHandler.goToNextStep();
		}, res => {
			this.wizard.step3.setResponse('error', buildErrorResponseMessage(res.error))
		});
	}
}
