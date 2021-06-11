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