import { Component } from "@angular/core";
import { FieldType } from "@ngx-formly/core";

@Component({
	selector: 'formly-field-date-selector',
	templateUrl: 'date-selector.html',
	styleUrls: ['date-selector.scss']
})
export class FormlyFieldDateSelector extends FieldType { }