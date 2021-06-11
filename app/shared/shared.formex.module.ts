import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { DropzoneComponent } from './components/dropzone/dropzone';
import { FormlyFieldDropzone } from './ngx-formly/fields/dropzone/dropzone';
import { FormlyConfig, FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from './shared.module';
import { TagsButtonsComponent } from './components/tags-buttons/tags-buttons';
import { FormlyFieldTags } from './ngx-formly/fields/tags/tags';
import { FormlyFieldUrlYoutube } from './ngx-formly/fields/url-youtube/url-youtube';
import { FormlyFieldPhoneNumber } from './ngx-formly/fields/phone-number/phone-number';
import { Ng2TelInputDirective } from './directives/ng2-tel-input';
import { MultiLanguageTextComponent } from './components/multi-language-text/multi-language-text';
import { DateSelectorComponent } from './components/date-selector/date-selector';
import { TagInputModule } from 'ngx-chips';
import { NumberDecimalComponent } from './components/number-decimal/number-decimal';
import { ChooseElementsModalComponent } from './components/choose-elements/choose-elements';
import { FileValueAccessorDirective } from './directives/file-reader';
// import { FileSelectDirective } from './directives/file-select';
// import { MoneyInputDirective } from './directives/money-input';
import { FormlyFieldButtonsGroup } from './ngx-formly/fields/buttons-group/buttons-group';
import { FormlyFieldTagsButtons } from './ngx-formly/fields/tags-button/tags-buttons';
import { FormlyFieldToggleSwitch } from './ngx-formly/fields/toggle-switch/toggle-switch';
import { FormlyFieldMultiLanguageText } from './ngx-formly/fields/multi-language-text/multi-language-text';
import { FormlyFieldDateSelector } from './ngx-formly/fields/date-selector/date-selector';
import { FormlyFieldNumberDecimal } from './ngx-formly/fields/number-decimal/number-decimal';
import { FormlyFieldChooseElements } from './ngx-formly/fields/choose-elements/choose-elements';

@NgModule({
	imports: [
		RouterModule,
		CommonModule,
		TranslateModule,
		FormsModule,
		ReactiveFormsModule,
		FormlyModule,
		SharedModule,
		TagInputModule
	],
	exports: [
		DropzoneComponent,
		FormlyFieldDropzone,

		TagsButtonsComponent,
		FormlyFieldTagsButtons,

		FormlyFieldTags,
		FormlyFieldUrlYoutube,
		FormlyFieldToggleSwitch,
		FormlyFieldButtonsGroup,

		MultiLanguageTextComponent,
		FormlyFieldMultiLanguageText,

		DateSelectorComponent,
		FormlyFieldDateSelector,

		Ng2TelInputDirective,
		FormlyFieldPhoneNumber,

		NumberDecimalComponent,
		FormlyFieldNumberDecimal,

		ChooseElementsModalComponent,
		FormlyFieldChooseElements,

		FileValueAccessorDirective,
		// FileSelectDirective,
		// MoneyInputDirective,
	],
	entryComponents: [
		FormlyFieldDropzone,
		FormlyFieldTagsButtons,
		FormlyFieldTags,
		FormlyFieldUrlYoutube,
		FormlyFieldPhoneNumber,
		FormlyFieldDateSelector,
		FormlyFieldNumberDecimal,
		FormlyFieldChooseElements,
		FormlyFieldToggleSwitch,
		FormlyFieldButtonsGroup,
		FormlyFieldMultiLanguageText,
		ChooseElementsModalComponent
	],
	declarations: [
		DropzoneComponent,
		FormlyFieldDropzone,

		TagsButtonsComponent,
		FormlyFieldTagsButtons,

		FormlyFieldTags,
		FormlyFieldUrlYoutube,
		FormlyFieldToggleSwitch,
		FormlyFieldButtonsGroup,

		MultiLanguageTextComponent,
		FormlyFieldMultiLanguageText,

		DateSelectorComponent,
		FormlyFieldDateSelector,

		Ng2TelInputDirective,
		FormlyFieldPhoneNumber,

		NumberDecimalComponent,
		FormlyFieldNumberDecimal,

		ChooseElementsModalComponent,
		FormlyFieldChooseElements,

		FileValueAccessorDirective,
		// FileSelectDirective,
		// MoneyInputDirective,
	]
})
export class SharedFormExModule {
	constructor(private formlyConfig: FormlyConfig) {
		//dropzone
		this.formlyConfig.setType({
			name: 'dropzone',
			component: FormlyFieldDropzone,
			defaultOptions: {
				validators: {
					validation: ['maxFiles', 'extension', 'fileSize']
				}
			}
		});


		//tags buttons
		this.formlyConfig.setType({
			name: 'tagsButtons',
			component: FormlyFieldTagsButtons,
			defaultOptions: {
				validators: {
					validation: ['requiredTags']
				}
			}
		});

		//tags
		this.formlyConfig.setType({
			name: 'tags',
			component: FormlyFieldTags,
			// defaultOptions: {
			// 	templateOptions: {
			// 		config: {
			// 			options: [{ display: 'label', value: 'myVal' }]
			// 		}
			// 	}
			// }
		});


		//url youtube
		this.formlyConfig.setType({
			name: 'urlYoutube',
			component: FormlyFieldUrlYoutube,
			defaultOptions: {
				templateOptions: {
					required: false,
					disabled: false,
					hideAsterisk: false,
					placeholder: 'https://youtu.be/uO4bn4e7A2A'
				},
				validators: { validation: ['urlYoutube'] },
			}
		});

		// phone number
		this.formlyConfig.setType({
			name: 'phoneNumber',
			component: FormlyFieldPhoneNumber
		});


		//multi language text
		this.formlyConfig.setType({
			name: 'multiLanguageText',
			component: FormlyFieldMultiLanguageText,
			defaultOptions: {
				templateOptions: {
					config: {
						type: 'text',
						disabled: false,
						languages: {
							en: { required: true, disabled: false },
							it: { required: false, disabled: false },
							es: { required: false, disabled: false }
						}
					}
				}
			}
		});


		//date selector
		this.formlyConfig.setType({
			name: 'dateSelector',
			component: FormlyFieldDateSelector
		});

		//number decimal
		this.formlyConfig.setType({
			name: 'numberDecimal',
			component: FormlyFieldNumberDecimal
		});


		//choose element
		this.formlyConfig.setType({
			name: 'chooseElements',
			component: FormlyFieldChooseElements,
			defaultOptions: {
				templateOptions: {
					config: {
						buttonText: 'Choose One',
						selectedText: 'Element selected:',
						// modalData: {
						// title: 'Choose a project',
						// description: 'Lorem ipsum dolor sit amet.',
						// type: 'project',
						// elements: []
						// }
					}
				}
			}
		});


		//toggle switch
		this.formlyConfig.setType({
			name: 'toggleSwitch',
			component: FormlyFieldToggleSwitch
		});


		//buttons group
		this.formlyConfig.setType({
			name: 'buttonsGroup',
			component: FormlyFieldButtonsGroup
		});
	}
} 