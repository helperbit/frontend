import { Component } from "@angular/core";
import { FieldType, FormlyConfig } from "@ngx-formly/core";
import AppSettings from "app/app.settings";
import { FormlyServices } from "app/services/formly-init2";
import { IntlTelInputValidity } from "app/shared/directives/ng2-tel-input";
@Component({
	selector: 'formly-field-phone-number',
	templateUrl: 'phone-number.html',
	styleUrls: ['phone-number.scss']
})
export class FormlyFieldPhoneNumber extends FieldType {
	field: {
		templateOptions: {
			config: {
				country: string;
			};
		};
	};
	
	constructor(private formlyConfig: FormlyConfig) { super(); }

	checkValidity(validity: IntlTelInputValidity) {
		let error = null;
		if(!validity.valid) {
			const key = 'phoneNumber' + validity.error;
			error = {};
			error[key] = true;
		}

		this.formControl.setErrors(error);
	}

	getNumber(number) {
		this.formControl.setValue(number);
	}
}