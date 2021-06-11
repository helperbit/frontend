import { Component } from "@angular/core";
import { FieldType, FormlyFieldConfig } from "@ngx-formly/core";
import { getLocalStorage } from 'app/shared/helpers/utils';

@Component({
	selector: 'formly-field-recaptcha',
	templateUrl: 'recaptcha.html',
	styleUrls: ['recaptcha.scss']
	
})
export class FormlyFieldRecaptcha extends FieldType {
	private hasToken: boolean = false;

	constructor() { super(); }

	submit(captchaResponse: string) {
		if (captchaResponse == null) {
			getLocalStorage().removeItem('captcha');
			this.hasToken = false;
		} else {
			getLocalStorage().setItem('captcha', captchaResponse);
			this.hasToken = true;
		}

		// TODO: this fix the model updating, but does not fix the reset
		this.field.model[this.field.key] = this.hasToken;
		this.field.formControl.updateValueAndValidity({onlySelf: false, emitEvent: true});
	}

	prePopulate(field: FormlyFieldConfig) {
		field.validators = {
			captcha: () => field.model[field.key] // this.hasToken
		};
	}

	// postPopulate(field: FormlyFieldConfig) {
	// 	field.model[field.key] = false;
	// }
}