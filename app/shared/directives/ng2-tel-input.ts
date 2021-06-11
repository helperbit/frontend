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

/*
	This directive was toke from https://github.com/gauravsoni119/ng2-tel-input/blob/master/src/ng2-tel-input.ts
	The current directive is edited to improve error managing and validation
*/

import { Directive, ElementRef, EventEmitter, HostListener, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare const window: any;
const defaultUtilScript = 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/16.0.1/js/utils.js';
// const defaultUtilScript = './ng2-tel-input-utils.js';

export interface IntlTelInputValidity {
	valid: boolean;
	error?: 0 | 1 | 2 | 3 | 4;
}

//error? could be a number (0, 1, 2, 3, 4) and the number referers to index of the under array error messages
//["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"]

@Directive({
	selector: '[ng2TelInput]'
})
export class Ng2TelInputDirective implements OnInit {
	@Input('ng2TelInputOptions') ng2TelInputOptions: any = {};
	@Output('isInputValid') isInputValid: EventEmitter<IntlTelInputValidity> = new EventEmitter();
	@Output('ng2TelOutput') ng2TelOutput: EventEmitter<any> = new EventEmitter();
	@Output('countryChange') countryChange: EventEmitter<any> = new EventEmitter();
	@Output('intlTelInputObject') intlTelInputObject: EventEmitter<any> = new EventEmitter();

	ngTelInput: any;

	constructor(private el: ElementRef,
		@Inject(PLATFORM_ID) private platformId: string) {
	}

	ngOnInit() {
		if (isPlatformBrowser(this.platformId)) {
			this.ng2TelInputOptions = {
				...this.ng2TelInputOptions,
				utilsScript: this.getUtilsScript(this.ng2TelInputOptions)
			};
			this.ngTelInput = window.intlTelInput(this.el.nativeElement, {
				...this.ng2TelInputOptions
			});

			this.el.nativeElement.addEventListener("countrychange", () => {
				this.countryChange.emit(this.ngTelInput.getSelectedCountryData());
			});

			this.intlTelInputObject.emit(this.ngTelInput);
		}
	}

	@HostListener('blur') onBlur() {
		const inputValidity: IntlTelInputValidity = this.checkValidity();
		if (inputValidity.valid) {
			const telOutput = this.ngTelInput.getNumber();
			this.isInputValid.emit(inputValidity);
			this.ng2TelOutput.emit(telOutput);
		} else {
			this.isInputValid.emit(inputValidity);
		}
	}

	checkValidity(): IntlTelInputValidity {
		if(this.ngTelInput.isValidNumber())
			return { valid: true };
		else
			return { valid: false, error: this.ngTelInput.getValidationError() }
	}

	setCountry(country: any) {
		this.ngTelInput.setCountry(country);
	}

	getUtilsScript(options: any) {
		return options.utilsScript || defaultUtilScript;
	}
}