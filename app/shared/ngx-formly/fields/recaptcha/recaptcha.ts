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