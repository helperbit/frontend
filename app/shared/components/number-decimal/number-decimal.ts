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

import { normalizeNumber, isEmpty, getMaxRoundNumber } from '../../../shared/helpers/utils';
import { Component, forwardRef, OnInit, OnChanges, OnDestroy, Input, ViewChild, ElementRef, SimpleChanges, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FieldDropzone } from '../../../shared/ngx-formly/fields/dropzone/dropzone';

/*
	TODO IMPROVEMENTS

	- gestire la correzione automatica del numero quando si utilizzano le frecce su/giù
	- se l'utente inserisce il valore senza utilizzare le frecce, permettere l'inserimento di valori sbagliato mostrando però un messaggio di errore
	- aggiungere i pulsanti per incrementare/decrementare l'input
	- migliorare la validazione del model con $parsers e $formatters
	- https://docs.angularjs.org/api/ng/type/ngModel.NgModelController

*/

export class NumberDecimalConfig {
	max?: number;
	min?: number;
	step?: any;
	exponential?: boolean;
	disabled?: boolean;
}

@Component({
	selector: 'number-decimal',
	templateUrl: 'number-decimal.html',
	styleUrls: ['number-decimal.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => NumberDecimalComponent),
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => NumberDecimalComponent),
			multi: true,
		}
	]
})
export class NumberDecimalComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit, ControlValueAccessor {
	@Input() config: NumberDecimalConfig;
	@Input() field: FieldDropzone;

	@ViewChild('numberDecimal', { static: true }) element: ElementRef;

	private onTouched: () => void;
	private onChange: (file: any) => void;

	formControl: FormControl;
	subscription: Subscription;

	private oldValue: number;
	private maxRound: number;
	private allowedKeys: number[];

	constructor() {
		// 8 				=	delete
		// 37, 38, 39, 40	=	arrows (left, up, right, down)
		// 46				=	canc
		// from	48 to 57	=	from 0 to 9 (large)
		// from 96 to 105	=	from 0 to 9 (little)
		// 110				=	dot (small)
		// 190				=	dot (large)
		this.allowedKeys = [8, 37, 38, 39, 40, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 190];
	
		this.formControl = new FormControl();
	}

	registerOnTouched(fn) {
		this.onTouched = fn;
	}

	registerOnChange(fn: (n: number) => void): void {
		this.onChange = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.config.disabled = isDisabled;

		if (this.config.disabled)
			this.formControl.disable();
	}

	// Formatter: Model to View
	//triggered when outside formControl change value
	writeValue(n: number): void {
		if (isEmpty(n) || isNaN(n)) return;

		n = this.normalizeNumber(n);

		this.formControl.setValue(n);
		this.oldValue = Number(n);
	}

	// pass the validation of this component to the outside formControl this component
	validate(_: FormControl) {
		return this.formControl.valid ? null : this.formControl.errors;
	}

	//transforms the input text value into a correctly written number (String type)
	private normalizeNumber(number) {
		//check number after dot
		if (this.config.max && number > this.config.max)
			number = this.config.max;
		else if (this.config.min && number < this.config.min)
			number = this.config.min;

		return normalizeNumber(number, this.maxRound);
	};

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
	
	ngOnChanges(changes: SimpleChanges) {
		if (changes.config && changes.config.currentValue) {
			if (!this.config.step)
				this.config.step = 1;

			// if(this.formControl.pristine && this.config.min) {
			// 	this.formControl.setValue(this.config.min)
			// 	this.formControl.markAsDirty();
			// }

			this.maxRound = getMaxRoundNumber(this.config.step);
		}
	}

	ngOnInit() {
		if (!this.config) this.config = { max: Infinity, min: -Infinity, step: 0.01 };

		/* FORM CONTROL SUBSCRITIONS */

		//triggered when the formControl formControl of this component change
		this.subscription = this.formControl.valueChanges.subscribe((n: number) => {
			if(this.onChange) this.onChange(n);
		});

		/* END FORM CONTROL SUBSCRITIONS */

		//called when ngModel value change without DOM interraction
		// this.ngModelCtrl.$formatters.push(modelValue => {
		// 	let number = Number(modelValue);

		// 	number = this.normalizeNumber(number);

		// 	this.value = number;
		// 	this.oldValue = Number(number);
		// 	return this.value;
		// });

		//called when ngModel value change with DOM interraction (like user that change value with input)
		// this.ngModelCtrl.$parsers.push(viewValue => {
		// 	return viewValue;
		// });

		//TODO nell'utilizzo in lightning invoice, c'è hideExpression che ogni volta fa scomparire l'input e poi lo fa ricomparire.
		//bisogna pensare ad una soluzione che gestisca casi del genere, questa è una modifica temporanea
		// if (this.ngModel) {
		// 	let number = Number(this.ngModel);

		// 	number = this.normalizeNumber(number);

		// 	this.value = number;
		// 	this.oldValue = Number(number);

		// 	this.updateNgModel(number);
		// }
	}

	ngAfterViewInit() {
		/* ELEMENT EVENTS */

		$(this.element.nativeElement).on('keydown', (event: JQueryEventObject) => {
			if (this.allowedKeys.indexOf(event.keyCode) == -1) {
				event.preventDefault();
				return;
			}

			if (event.keyCode == 38 || event.keyCode == 40) {
				let n = Number(this.formControl.value);

				if (isNaN(n))
					n = this.oldValue;

				if (event.keyCode == 38)
					n += this.config.step;
				else if (event.keyCode == 40)
					n -= this.config.step;

				n = this.normalizeNumber(n);

				this.formControl.setValue(n);
				this.oldValue = Number(n);
			}

			//se l'utente non preme numeri, allora il numero che stà inserendo va semplicemente validato con il validate di angular js
		});

		$(this.element.nativeElement).on('keyup', (event: JQueryEventObject) => {
			if (this.allowedKeys.indexOf(event.keyCode) == -1) {
				event.preventDefault();
				return;
			}

			if (event.keyCode != 38 && event.keyCode != 40) {
				if (this.formControl.valid) {
					let n = Number(this.formControl.value);

					if (isNaN(n)) {
						this.formControl.setValue(this.oldValue)

						return;
					}

					n = this.normalizeNumber(n);

					this.formControl.setValue(n);
					this.oldValue = Number(n);
				}
			}
		});

		/* END ELEMENT EVENTS */
	}
}