import { Component, OnInit } from "@angular/core";
import { FieldType, FormlyFieldConfig, FormlyConfig } from "@ngx-formly/core";
import { Tags } from "app/models/common";

export type FieldTagsButtons = FormlyFieldTagsButtons & FormlyFieldConfig;

@Component({
	selector: 'formly-field-tags-buttons',
	templateUrl: 'tags-buttons.html',
	styleUrls: ['tags-buttons.scss']
})
export class FormlyFieldTagsButtons extends FieldType implements OnInit {
	constructor() { super(); }

	ngOnInit() {
		this.formControl.valueChanges.subscribe((tags: Tags[]) => {
			this.field.model[this.field.key] = tags;

			//check if required is set,
			//in that case check if we have a requiredTags error
			// in that case remove required error and leave just required tags
			//to show the specific error message
			if(typeof this.formControl.errors == 'object' && this.formControl.errors != null)
				if(this.formControl.errors.required && this.formControl.errors.requiredTags)
					delete this.formControl.errors['required'];
		});
	}

	onClick(tag: Tags) {
		if(this.field.templateOptions.config && this.field.templateOptions.config.onClick)
			this.field.templateOptions.config.onClick(tag);
	}
}