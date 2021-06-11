import { Component } from "@angular/core";
import { FieldType, FormlyFieldConfig } from "@ngx-formly/core";

export type FieldTags = FormlyFieldTags & FormlyFieldConfig;

export interface TagsChipsOption {
	display: string;
	value: string;
}

export interface SelectOption {
	label: string;
	value: string;
}

@Component({
	selector: 'formly-field-tags',
	templateUrl: 'tags.html',
	styleUrls: ['tags.scss']
})
export class FormlyFieldTags extends FieldType {
	autocompleteArr: TagsChipsOption[];

	constructor() { super(); }

	onTextChange(text: string) {
		text = text.toLowerCase();

		this.autocompleteArr = (<TagsChipsOption[]>this.field.templateOptions.options).filter((option: TagsChipsOption) => option.display.toLowerCase().indexOf(text) != -1);
	}
}