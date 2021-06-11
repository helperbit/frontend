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