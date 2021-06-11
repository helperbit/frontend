import { Component } from "@angular/core";
import { FieldWrapper } from '@ngx-formly/core';

@Component({
	selector: 'formly-wrapper-form-field',
	templateUrl: 'form-field.html',
	styleUrls: ['form-field.scss']
})
export class FormlyWrapperFormField extends FieldWrapper {}