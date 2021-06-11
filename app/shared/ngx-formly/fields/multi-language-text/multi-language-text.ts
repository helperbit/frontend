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

export type FieldMultiLanguageText = FormlyFieldMultiLanguageText & FormlyFieldConfig;

@Component({
	selector: 'formly-field-multi-language-text',
	templateUrl: 'multi-language-text.html',
	styleUrls: ['multi-language-text.scss']
})
export class FormlyFieldMultiLanguageText extends FieldType {
	constructor() { super(); }

	public showErrorMessages () {
		let almostOneRequired = false;

		if(this.field.templateOptions.config.languages)
			for(const language in this.field.templateOptions.config.languages)
				if(this.field.templateOptions.config.languages[language].required) {
					almostOneRequired = true;
					break;
				}
		
		return this.formControl.errors != null && !this.formControl.pristine &&
			(this.field.templateOptions.required || almostOneRequired || this.field.model[this.field.key] && this.field.model[this.field.key].length > 0)
	}
}