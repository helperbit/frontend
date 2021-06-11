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

import { Component, forwardRef, Input, OnChanges, SimpleChanges } from "@angular/core";
import { NG_VALUE_ACCESSOR, FormControl, NG_VALIDATORS } from "@angular/forms";
import { Subscription } from 'rxjs';
import { isEmpty } from "app/shared/helpers/utils";
import { FieldMultiLanguageText } from "app/shared/ngx-formly/fields/multi-language-text/multi-language-text";
import { KeysPipe } from "app/shared/filters/ngForKeys";
import { Language, TString, LanguageText } from "app/models/common";

const LANGUAGES_TEXT: { [key in Language]: LanguageText } = {
	en: 'English',
	it: 'Italian',
	es: 'Spanish'
};

export interface MultiLanguageTextConfig {
	type: 'text' | 'textarea';
	disabled?: boolean;
	languages: { [key in Language]?: { required: boolean; disabled?: boolean } };
}

@Component({
	selector: 'multi-language-text',
	templateUrl: 'multi-language-text.html',
	styleUrls: ['multi-language-text.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MultiLanguageTextComponent),
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => MultiLanguageTextComponent),
			multi: true,
		},
		KeysPipe
	]
})
export class MultiLanguageTextComponent implements OnChanges{
	@Input() config: MultiLanguageTextConfig;
	@Input() field: FieldMultiLanguageText;

	private onTouched: () => void;
	private onChange: (file: any) => void;

	public formControl: { [key in Language]?: FormControl; };
	private subscription: { [key in Language]?: Subscription; };

	public languagesText: { [key in Language]?: LanguageText };
	public activeLanguage: Language;
	public id: string;

	constructor() {
		this.id = Math.random().toString().substring(2);

		this.activeLanguage = 'en';
	}

	registerOnTouched(fn) {
		this.onTouched = fn;
	}

	registerOnChange(fn: (text: TString) => void): void {
		this.onChange = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.config.disabled = isDisabled;

		if (this.config.disabled)
			for(const language in this.formControl) {
				this.formControl[language].disable();
				this.config.languages[language].disabled = true;
			}
	}

	// Formatter: Model to View
	//triggered when outside formControl change value
	writeValue(text: TString): void {
		if (isEmpty(text)) return;

		for(const language in this.formControl)
			if(text[language])
				this.formControl[language].setValue(text[language]);
	}

	// pass the validation of this component to the outside formControl this component
	validate(_: FormControl) {
		if(this.field.templateOptions.minlength)
			for(const language in this.formControl)
				if(this.formControl[language].value && this.formControl[language].value.length < this.field.templateOptions.minlength)
					this.formControl[language].setErrors({ minlength: true });
				else if(this.formControl[language].errors && this.formControl[language].errors.minlength)
					this.formControl[language].setErrors({ minlength: false });

		for(const language in this.formControl)
			if(this.field.templateOptions.required || this.config.languages[language].required) {
				if(!this.formControl[language].value || this.formControl[language].value.length == 0)
					this.formControl[language].setErrors({ required: true });
				else if(this.formControl[language].errors && this.formControl[language].errors.required)
					this.formControl[language].setErrors({ required: false });
			}

		for(const language in this.formControl)
			if(this.formControl[language].invalid)
				return this.formControl[language].errors;

		return null;
	}

	ngOnDestroy() {
		for(const language in this.subscription)
			this.subscription[language].unsubscribe();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.field && changes.field.currentValue)
			this.id = this.field.name + this.id;
		if(changes.config && changes.config.currentValue) {
			// if(changes.config.currentValue.languages != changes.config.previousValue.languages)
			this.initFormControl();
		}
	}

	ngOnInit() {
		this.initFormControl();
	}

	private getModel(): TString {
		const model: TString = {};

		for(const language in this.formControl)
			model[language] = this.formControl[language].value;

		return model;
	}

	private initFormControl () {
		for(const language in this.subscription)
			this.subscription[language].unsubscribe();
			
		this.languagesText = {};
		this.formControl = {};
		this.subscription = {};

		for(const language in this.config.languages) {
			this.languagesText[language] = LANGUAGES_TEXT[language];
			this.formControl[language] = new FormControl();
		}

		/* FORM CONTROL SUBSCRITIONS */

		//triggered when one of the formControl formControl[language] of this component change
		for(const language in this.formControl)
			this.subscription[language] = this.formControl[language].valueChanges.subscribe((text: string) => {
				if(this.onChange)
					this.onChange(this.getModel());
			});

		/* END FORM CONTROL SUBSCRITIONS */
	}
}