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

import { AfterViewInit, Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CurrencyService } from "app/services/currency";
import { MoneyPipe } from "../filters/money";

@Directive({
	selector: 'input[moneyInput]',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MoneyInputDirective),
			multi: true
		}
	]
})
export class MoneyInputDirective implements ControlValueAccessor, AfterViewInit {
	@Input() rounding: string = 'full';

	protected inputElement: HTMLInputElement;
	private onTouch: Function;
	private onModelChange: Function;
	private modelValue: string;

	constructor(
		private element: ElementRef,
		currencyService: CurrencyService,
		private moneyPipe: MoneyPipe
	) {
		currencyService.onCurrencyChange.subscribe(curr => {
			this.writeValue(this.modelValue);
		});
	}

	registerOnTouched(fn) {
		this.onTouch = fn;
	}

	registerOnChange(fn) {
		this.onModelChange = fn;
	}

	ngAfterViewInit(): void {
		this.inputElement = this.getInputElementRef();
	}

	// Parser: View to Model
	@HostListener('input', ['$event'])
	onControlInput($event: KeyboardEvent) {
		const rawValue: any = this.inputElement.value;

		if (this.onTouch) {
			this.onTouch();
		}

		this.modelValue = this.moneyPipe.transform(parseFloat(rawValue), 8, false, true);
		this.onModelChange(this.modelValue);
	}

	// Formatter: Model to View
	writeValue(modelValue: any): void {
		this.modelValue = modelValue;

		if (this.inputElement) {
			this.inputElement.value = this.moneyPipe.transform(parseFloat(this.modelValue), this.rounding, false, false);
		}
	}


	// get a safe ref to the input element
	private getInputElementRef(): HTMLInputElement {
		let input: HTMLInputElement;
		if (this.element.nativeElement.tagName === 'INPUT') {
			// `textMask` directive is used directly on an input element
			input = this.element.nativeElement;
		} else {
			// `formatterParser` directive is used on an abstracted input element, `ion-input`, `md-input`, etc
			input = this.element.nativeElement.getElementsByTagName('INPUT')[0];
		}

		if (!input) {
			throw new Error('You can applied the "formatterParser" directive only on inputs or elements containing inputs');
		}

		return input;
	}
}