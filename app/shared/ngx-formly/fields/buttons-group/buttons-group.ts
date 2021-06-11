import { Component } from "@angular/core";
import { FieldType, FormlyFieldConfig } from "@ngx-formly/core";

export type FieldButtonsGroup = FormlyFieldButtonsGroup & FormlyFieldConfig;

@Component({
	selector: 'formly-field-buttons-group',
	templateUrl: 'buttons-group.html',
	styleUrls: ['buttons-group.scss']
})
export class FormlyFieldButtonsGroup extends FieldType {}