import { FormlyFieldConfig } from '@ngx-formly/core';
import { ValidatorFn } from '@angular/forms';
import { isEmpty } from 'app/shared/helpers/utils';

export function buildField(name: string, type: string, required: boolean = true,
	label: string = undefined, placeholder: string = undefined, validators: ValidatorFn[] = [],
	innerType: string = 'text'
): FormlyFieldConfig {
	return {
		name: name,
		type: type,
		templateOptions: {
			type: innerType,
			required: required,
			label: label,
			placeholder: placeholder
		},
		validators: {
			validation: validators
		}
	};
}

export class FormFieldGroup {
	private fieldGroup: FormlyFieldConfig;

	constructor(private className?: string) {
		this.fieldGroup = {
			key: null,
			fieldGroupClassName: this.className || '',
			fieldGroup: []
		};
	}

	serializeFields(): FormlyFieldConfig[] {
		return this.fieldGroup.fieldGroup;
	}

	serialize(): FormlyFieldConfig {
		if(isEmpty(this.fieldGroup.key)) throw Error('You must set the \'key\' attribute of your FormlyFieldGroup object. Use \'setKey\' method');
		return this.fieldGroup;
	}

	addField(field: FormlyFieldConfig) {
		this.fieldGroup.fieldGroup.push(field);
	}

	setKey(key: string) {
		this.fieldGroup.key = key;
	}

	getKey(): string {
		return this.fieldGroup.key;
	}

	addFieldGroupLabel (label: string, helperToolipContent?: string) {
		const fOpts = {
			type: 'fieldGroupLabel',
			key: '',
			templateOptions: {
				label: label
			}
		};
		if(helperToolipContent) 
			(fOpts.templateOptions as any).helperTooltip = { content: helperToolipContent };
	
		this.fieldGroup.fieldGroup.push(fOpts);
	}

	setHideExpression(hideExpression: FormlyFieldConfig["hideExpression"]) {
		this.fieldGroup.hideExpression = hideExpression;
	}

	setClassName(className: string) {
		this.fieldGroup.className = className;
	}
}