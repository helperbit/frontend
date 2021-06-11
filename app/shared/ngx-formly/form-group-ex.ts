import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup, AbstractControl, ValidatorFn, AbstractControlOptions, AsyncValidatorFn, FormControl } from '@angular/forms';
import { ResponseMessageConfig } from '../../shared/components/response-messages/response-messages';
import { FormFieldGroup } from './form-field-group';
import AppSettings from 'app/app.settings';

declare const grecaptcha: any;

export class FormGroupEx<T> extends FormGroup {
	public responseMessage: ResponseMessageConfig;
	public model: T;
	public fields: FormlyFieldConfig[];
	public loading: boolean;

	constructor(
		controls: { [key: string]: AbstractControl } = {},
		validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
		asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
	) {
		super(controls, validatorOrOpts, asyncValidator);
		(this.model as any) = {};
		this.fields = [];
		this.responseMessage = {};
	}

	/* Initialize the form model */
	public initializeModel(model: T): void {
		this.model = model;
	}

	public setModelField(key: string, value: any, fieldGroupKey?: string) {
		//TODO assicurarsi che usando il setValue nel caso di un FieldGroup, il writeValue dei custom field venga triggerato
		if (fieldGroupKey)
			(<FormGroup>this.controls[fieldGroupKey]).controls[key].setValue(value);
		else
			this.controls[key].setValue(value);
	}

	/* Set the response of the form */
	public setResponse(type: 'error' | 'success', data: any): void {
		this.responseMessage = { ...data, type: type };
	}

	/* Reset the form response */
	public resetResponse(): void {
		this.responseMessage = {};
	}

	/* Add a field to the form */
	public addField(field: FormlyFieldConfig) {
		if (!field.className)
			field.className = 'col-lg-12 col-md-12 col-sm-12 col-xs-12';
		this.fields.push(field);
	}

	public getField(key: string, fieldGroupKey?: string): FormlyFieldConfig {
		let fields = this.fields;

		if (fieldGroupKey) {
			fields = this.fields.filter(field => field.key == fieldGroupKey)[0].fieldGroup;
			//find fieldGroup, filter it and return field
		}

		const res = fields.filter((field: FormlyFieldConfig) => field.key == key);

		if (res.length == 1)
			return res[0]
		else
			return null;
	}

	public getFieldFormControl(key: string, fieldGroupKey?: string): FormControl {
		//in this case is a FormGroup
		if (fieldGroupKey)
			return <FormControl>(<FormGroup>this.controls[fieldGroupKey]).controls[key];
		else
			return <FormControl>this.controls[key];
	}

	/* Add a group containing fields */
	public addFieldGroup(group: FormFieldGroup) {
		this.fields.push(group.serialize());
	}

	public reset() {
		super.reset();
		if (AppSettings.features.captcha)
			grecaptcha.reset();
	}

	public captchaExpire() {
		if (AppSettings.features.captcha)
			grecaptcha.reset();
	}
}