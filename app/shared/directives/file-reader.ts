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

import { Directive } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
	// tslint:disable-next-line
	selector: 'input[type=file]',
	host: {
		'(change)': 'onChange($event.target.files)',
		'(blur)': 'onTouched()',
	},
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: FileValueAccessorDirective, multi: true },
	],
})
// https://github.com/angular/angular/issues/7341
export class FileValueAccessorDirective implements ControlValueAccessor {
	value: any;
	onChange = () => { };
	onTouched = () => { };

	writeValue(value) { }
	registerOnChange(fn: any) { this.onChange = fn; }
	registerOnTouched(fn: any) { this.onTouched = fn; }
}