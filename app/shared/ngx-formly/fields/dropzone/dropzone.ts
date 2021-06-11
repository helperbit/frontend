import { Component } from "@angular/core";
import { FieldType, FormlyFieldConfig } from "@ngx-formly/core";

export type FieldDropzone = FormlyFieldDropzone & FormlyFieldConfig;

@Component({
	selector: 'formly-field-dropzone',
	templateUrl: 'dropzone.html',
	styleUrls: ['dropzone.scss']
})
export class FormlyFieldDropzone extends FieldType {	
	constructor() { super(); }

	onAdd(file: File) {
		if(this.field.templateOptions.config && this.field.templateOptions.config.onAdd)
			this.field.templateOptions.config.onAdd(file);
	}

	onDelete(file: File) {
		if(this.field.templateOptions.config && this.field.templateOptions.config.onDelete)
			this.field.templateOptions.config.onDelete(file);
	}
}