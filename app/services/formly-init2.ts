/* 
 *  Helperbit: a p2p donation platform (frontend)
 *  Copyright (C) 2016-2021  Davide Gessa (gessadavide@gmail.com)
 *  Copyright (C) 2016-2021  Helperbit team
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

import { FormlyConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FieldType } from '@ngx-formly/core';
import { FormlyFieldRecaptcha } from '../shared/ngx-formly/fields/recaptcha/recaptcha';
import { FormlyWrapperFormField } from '../shared/ngx-formly/wrapper/form-field';
import { Validators, FormControl, ValidationErrors } from '@angular/forms';
import AppSettings from '../app.settings';
import { FormlyFieldPolicyConsent } from '../shared/ngx-formly/fields/policy-consent/policy-consent';
import { byteSize, isInArray, isEmpty } from '../shared/helpers/utils';
import { FormlyFieldFieldGroupLabel } from '../shared/ngx-formly/fields/field-group-label/field-group-label';
import { FormlyFieldFieldLabel } from 'app/shared/ngx-formly/fields/field-label/field-label';
// import FormlyFieldToggleSwitch from '../shared/ngx-formly/fields/toggle-switch';
// import FormlyFieldDateSelector from '../shared/ngx-formly/fields/date-selector';
// import FormlyFieldDropzone from '../shared/ngx-formly/fields/dropzone/dropzone';
// import FormlyFieldNumberDecimal from '../shared/ngx-formly/fields/number-decimal';
// import FormlyFieldTagsButtons from '../shared/ngx-formly/fields/tags-buttons';
// import FormlyFieldChooseElements from '../shared/ngx-formly/fields/choose-elements';
// import FormlyFieldMultiLanguageText from '../shared/ngx-formly/fields/multi-language-text';
// import FormlyFieldPhoneNumber from '../shared/ngx-formly/fields/phone-number/phone-number';
// import FormlyFieldTags from 'app/shared/ngx-formly/fields/tags/tags';
// import FormlyFieldUrlYoutube from 'app/shared/ngx-formly/fields/url-youtube/url-youtube';
// import FormlyFieldButtonsGroup from 'app/shared/ngx-formly/fields/buttons-group/buttons-group';

export class FormlyServices {
	public static setLabelPlaceholder(field: FieldType) {
		let element = null;
		field.to.placeholder = null;

		// const watch = field.$watch(function () { return $('#' + field.id).length; }, function (newVal, oldVal) {
		// 	if (newVal == 0) return;

		element = $('#' + field.id);
		element.parent().addClass('label-placeholder');

		element.focus(function () {
			$(this).parents('.label-placeholder').addClass('focused');
		});

		element.blur(function () {
			const inputValue = $(this).val();
			if (inputValue == '') {
				// $(this).removeClass('filled');
				$(this).parents('.label-placeholder').removeClass('focused');
			}
			// else {
			// 	$(this).addClass('filled');
			// }
		});

		// 	watch();
		// });
	};

	public static customValidators: { [key: string]: (FormControl, FormlyFieldConfig?) => ValidationErrors } = {
		password: (control: FormControl, field: FormlyFieldConfig) => {
			if (isEmpty(control.value) || AppSettings.form.regex.password.test(control.value)) return null;
			return { password: true };
		},
		// TO TEST
		url: (control: FormControl, field: FormlyFieldConfig) => {
			if (isEmpty(control.value) || AppSettings.form.regex.url.website.test(control.value)) return null;
			return { url: true };
		},
		// TO TEST
		urlYoutube: (control: FormControl, field: FormlyFieldConfig) => {
			if (isEmpty(control.value) || AppSettings.form.regex.url.youtube.test(control.value)) return null;
			return { urlYoutube: true };
		},
		maxFiles: (control: FormControl, field: FormlyFieldConfig) => {
			if (
				isEmpty(control.value)
				|| (field.templateOptions.config.maxFiles && (control.value.length <= field.templateOptions.config.maxFiles))
				|| (field.templateOptions.config.maxFiles && control.value.length <= field.templateOptions.config.maxFiles)
			) return null;
			return { maxFiles: true };
		},
		extension: (control: FormControl, field: FormlyFieldConfig) => {
			if (isEmpty(control.value)) return null;
			for (let i = 0; i < control.value.length; i++) {
				const splitted = control.value[i].file.name.split('.');
				const ext = splitted[splitted.length - 1];

				if (!isInArray(ext.toLowerCase(), field.templateOptions.config.exts))
					return { extension: true };
			}

			return null;
		},
		fileSize: (control: FormControl, field: FormlyFieldConfig) => {
			if (isEmpty(control.value)) return null;
			for (let i = 0; i < control.value.length; i++) {
				if (control.value[i].file.size > field.templateOptions.config.maxSize)
					return { fileSize: true };
			}

			return null;
		},
		requiredTags: (control: FormControl, field: FormlyFieldConfig) => {
			if (isEmpty(control.value)) return null;
			if (field.templateOptions.required && control.value.length == 0) return { requiredTags: true }
		},
		alphanumeric: (control: FormControl, field: FormlyFieldConfig) => {
			if (isEmpty(control.value) || AppSettings.form.regex.alphanumeric.test(control.value)) return null;
			return { alphanumeric: true };
		},
		fullName: (control: FormControl, field: FormlyFieldConfig) => {
			if (isEmpty(control.value) || AppSettings.form.regex.fullName.test(control.value)) return null;
			return { fullName: true };
		},
		//TODO il validator lo fa direttamente l'input
		// phoneNumber: (control: FormControl, field: FormlyFieldConfig) => {
		// 	// debugger
		// 	if(isEmpty(control.value)) return null;
		// 	if(!AppSettings.form.regex.phoneNumber.test(control.value))
		// 		return { phoneNumber: true };

		// 	return null;
		// },
		bitcoin: (control: FormControl, field: FormlyFieldConfig) => {
			if (isEmpty(control.value) || (field.templateOptions.maxDigits == 8 && AppSettings.form.regex.bitcoin.digits8.test(control.value))) return null;
			else if(isEmpty(control.value) || (field.templateOptions.maxDigits == 11 && AppSettings.form.regex.bitcoin.digits11.test(control.value))) return null;
			return { bitcoin: true };
		},
	};
}

@Injectable({
	providedIn: 'root'
})
export class FormlyInit2Service {
	constructor(
		private translate: TranslateService,
		private formlyConfig: FormlyConfig
	) { }

	init(): void {
		/* CUSTOM VALIDATION MESSAGES */

		this.formlyConfig.addValidatorMessage('required', (err, field: FormlyFieldConfig) => this.translate.instant('This field is required'));
		this.formlyConfig.addValidatorMessage('email', (err, field: FormlyFieldConfig) => this.translate.instant('Insert a correct email format'));
		this.formlyConfig.addValidatorMessage('minlength', (err, field: FormlyFieldConfig) => this.translate.instant('This field must have at least') + ' ' + field.templateOptions.minLength + ' ' + this.translate.instant('characters'));
		this.formlyConfig.addValidatorMessage('password', (err, field: FormlyFieldConfig) => this.translate.instant('This field must contains at least a capital letter, lowercase letter and a number'));
		this.formlyConfig.addValidatorMessage('email', (err, field: FormlyFieldConfig) => this.translate.instant('Insert a correct email format'));
		this.formlyConfig.addValidatorMessage('fileSize', (err, field: FormlyFieldConfig) => this.translate.instant('Max file size allowed is') + ' ' + byteSize(field.templateOptions.config.maxSize));
		this.formlyConfig.addValidatorMessage('maxFiles', (err, field: FormlyFieldConfig) => this.translate.instant('You can add') + ' ' + field.templateOptions.config.maxFiles + ' ' + this.translate.instant(' file or less'));
		this.formlyConfig.addValidatorMessage('extension', (err, field: FormlyFieldConfig) => this.translate.instant('Only') + ' ' + field.templateOptions.config.exts.join(', ') + ' ' + this.translate.instant('can be added'));
		this.formlyConfig.addValidatorMessage('requiredTags', (err, field: FormlyFieldConfig) => this.translate.instant('You must choose at least one tag'));

		//same name with different number to refers to intl input number errors
		this.formlyConfig.addValidatorMessage('phoneNumber0', (err, field: FormlyFieldConfig) => this.translate.instant('Insert a correct phone number format'));
		this.formlyConfig.addValidatorMessage('phoneNumber1', (err, field: FormlyFieldConfig) => this.translate.instant('Invalid country code'));
		this.formlyConfig.addValidatorMessage('phoneNumber2', (err, field: FormlyFieldConfig) => this.translate.instant('The phone number is too short'));
		this.formlyConfig.addValidatorMessage('phoneNumber3', (err, field: FormlyFieldConfig) => this.translate.instant('The phone number is too long'));
		this.formlyConfig.addValidatorMessage('phoneNumber4', (err, field: FormlyFieldConfig) => this.translate.instant('Insert a correct phone number format'));

		/* TO TEST */

		this.formlyConfig.addValidatorMessage('equalsPassword', (err, field: FormlyFieldConfig) => this.translate.instant('This field must be equal to password'));
		this.formlyConfig.addValidatorMessage('alphanumeric', (err, field: FormlyFieldConfig) => this.translate.instant('This field can contain letters and/or number'));
		this.formlyConfig.addValidatorMessage('fullName', (err, field: FormlyFieldConfig) => this.translate.instant('Insert a correct format'));
		this.formlyConfig.addValidatorMessage('ngIntlTelInput', (err, field: FormlyFieldConfig) => this.translate.instant('Insert a valid phone number format'));
		this.formlyConfig.addValidatorMessage('urlYoutube', (err, field: FormlyFieldConfig) => this.translate.instant('Insert a valid Youtube Video URL'));
		this.formlyConfig.addValidatorMessage('url', (err, field: FormlyFieldConfig) => this.translate.instant('Insert a valid URL'));
		this.formlyConfig.addValidatorMessage('number', (err, field: FormlyFieldConfig) => this.translate.instant('Insert a valid number value'));
		this.formlyConfig.addValidatorMessage('bitcoin', (err, field: FormlyFieldConfig) => this.translate.instant('Insert a valid bitcoin value'));

		// this.formlyConfig.addValidatorMessage('min', (err, field: FormlyFieldConfig) =>
		// 	this.translate.instant('The minimum value of this field is') + ' ' + field.templateOptions.min
		// );

		// this.formlyConfig.addValidatorMessage('max', (err, field: FormlyFieldConfig) =>
		// 	this.translate.instant('The maximum value of this field is') + ' ' + field.templateOptions.max
		// );

		/* END TO TEST */

		/* END CUSTOM VALIDATION MESSAGES */

		/* CUSTOM VALIDATORS */

		this.formlyConfig.setValidator({ name: 'password', validation: FormlyServices.customValidators.password });
		this.formlyConfig.setValidator({ name: 'url', validation: FormlyServices.customValidators.url });
		this.formlyConfig.setValidator({ name: 'urlYoutube', validation: FormlyServices.customValidators.urlYoutube });
		this.formlyConfig.setValidator({ name: 'maxFiles', validation: FormlyServices.customValidators.maxFiles });
		this.formlyConfig.setValidator({ name: 'extension', validation: FormlyServices.customValidators.extension });
		this.formlyConfig.setValidator({ name: 'fileSize', validation: FormlyServices.customValidators.fileSize });
		this.formlyConfig.setValidator({ name: 'requiredTags', validation: FormlyServices.customValidators.requiredTags });
		this.formlyConfig.setValidator({ name: 'alphanumeric', validation: FormlyServices.customValidators.alphanumeric });
		this.formlyConfig.setValidator({ name: 'fullName', validation: FormlyServices.customValidators.fullName });
		this.formlyConfig.setValidator({ name: 'bitcoin', validation: FormlyServices.customValidators.bitcoin });

		/* END CUSTOM VALIDATORS */

		/* CUSTOM TYPES */
		//field label
		this.formlyConfig.setType({
			name: 'fieldLabel',
			component: FormlyFieldFieldLabel
		});

		//field group label
		this.formlyConfig.setType({
			name: 'fieldGroupLabel',
			component: FormlyFieldFieldGroupLabel
		});

		//recaptcha
		this.formlyConfig.setType({ name: 'recaptcha', component: FormlyFieldRecaptcha });

		//email
		this.formlyConfig.setType({
			name: 'email',
			extends: 'input',
			defaultOptions: {
				validators: { validation: [Validators.email] },
				templateOptions: {
					label: this.translate.instant('Email'),
					placeholder: this.translate.instant('Email'),
				}
			}
		});

		//password
		this.formlyConfig.setType({
			name: 'password',
			extends: 'input',
			defaultOptions: {
				type: 'input',
				validators: {
					validation: [Validators.minLength(AppSettings.form.length.min.password), 'password']
				},
				templateOptions: {
					type: 'password',
					label: this.translate.instant('Password'),
					placeholder: this.translate.instant('Password')
				}
			}
		});

		this.formlyConfig.setType({
			name: 'password_nolabel',
			extends: 'input',
			defaultOptions: {
				type: 'input',
				validators: {
					validation: []
				},
				templateOptions: {
					type: 'password',
					placeholder: this.translate.instant('Password')
				}
			}
		});

		//url
		this.formlyConfig.setType({
			name: 'url',
			extends: 'input',
			defaultOptions: {
				type: 'input',
				templateOptions: {
					type: 'text',
					required: false,
					disabled: false,
					hideAsterisk: false
				},
				validators: {
					validation: ['url']
				}
			}
		});

		//toggle switch
		// this.formlyConfig.setType({
		// 	name: 'toggleSwitch',
		// 	component: FormlyFieldToggleSwitch
		// });

		//policy consent
		this.formlyConfig.setType({
			name: 'policyConsent',
			component: FormlyFieldPolicyConsent
		});

		//date selector
		// this.formlyConfig.setType({
		// 	name: 'dateSelector',
		// 	component: FormlyFieldDateSelector
		// });

		//dropzone
		// this.formlyConfig.setType({
		// 	name: 'dropzone',
		// 	component: FormlyFieldDropzone,
		// 	defaultOptions: {
		// 		validators: {
		// 			validation: ['maxFiles', 'extension', 'fileSize']
		// 		}
		// 	}
		// });

		//number decimal
		// this.formlyConfig.setType({
		// 	name: 'numberDecimal',
		// 	component: FormlyFieldNumberDecimal
		// });

		//choose element
		// this.formlyConfig.setType({
		// 	name: 'chooseElements',
		// 	component: FormlyFieldChooseElements,
		// 	defaultOptions: {
		// 		templateOptions: {
		// 			config: {
		// 				buttonText: 'Choose One',
		// 				selectedText: 'Element selected:',
		// 				// modalData: {
		// 				// title: 'Choose a project',
		// 				// description: 'Lorem ipsum dolor sit amet.',
		// 				// type: 'project',
		// 				// elements: []
		// 				// }
		// 			}
		// 		}
		// 	}
		// });

		//multi language text
		// this.formlyConfig.setType({
		// 	name: 'multiLanguageText',
		// 	component: FormlyFieldMultiLanguageText,
		// 	defaultOptions: {
		// 		templateOptions: {
		// 			config: {
		// 				type: 'text',
		// 				disabled: false,
		// 				languages: {
		// 					en: { required: true, disabled: false },
		// 					it: { required: false, disabled: false },
		// 					es: { required: false, disabled: false }
		// 				}
		// 			}
		// 		}
		// 	}
		// });

		//phone number
		// this.formlyConfig.setType({
		// 	name: 'phoneNumber',
		// 	component: FormlyFieldPhoneNumber
		// });

		//tags
		// this.formlyConfig.setType({
		// 	name: 'tags',
		// 	component: FormlyFieldTags,
		// 	// defaultOptions: {
		// 	// 	templateOptions: {
		// 	// 		config: {
		// 	// 			options: [{ display: 'label', value: 'myVal' }]
		// 	// 		}
		// 	// 	}
		// 	// }
		// });

		//url youtube
		// this.formlyConfig.setType({
		// 	name: 'urlYoutube',
		// 	component: FormlyFieldUrlYoutube,
		// 	defaultOptions: {
		// 		templateOptions: {
		// 			required: false,
		// 			disabled: false,
		// 			hideAsterisk: false,
		// 			placeholder: 'https://youtu.be/uO4bn4e7A2A'
		// 		},
		// 		validators: { validation: ['urlYoutube'] },
		// 	}
		// });

		//tags buttons
		// this.formlyConfig.setType({
		// 	name: 'tagsButtons',
		// 	component: FormlyFieldTagsButtons,
		// 	defaultOptions: {
		// 		validators: {
		// 			validation: ['requiredTags']
		// 		}
		// 	}
		// });

		//buttons group
		// this.formlyConfig.setType({
		// 	name: 'buttonsGroup',
		// 	component: FormlyFieldButtonsGroup
		// });

		/* END CUSTOM TYPES */

		/* WRAPPERS */

		// Non ho idea di cosa faccia dato che lo setto gia' nel forRoot()
		this.formlyConfig.setWrapper({
			name: 'form-field',
			types: ['input', 'select', 'email', 'password', 'tagsButtons', 'url', 'toggleSwitch', 'policyConsent', 'dateSelector', 'dropzone', 'phoneNumber', 'urlYoutube', 'buttonsGroup', 'multiLanguageText', 'numberDecimal'],
			//TODO questi input sotto sono custom e bisogna inserire la parte dei label e della gestione errori nei loro template
			// types: ['chooseElements', 'tagsButtons'],
			component: FormlyWrapperFormField
		});

		/* END WRAPPERS */
	}
}


