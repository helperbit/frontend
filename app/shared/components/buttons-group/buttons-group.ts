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

import { Component, forwardRef, EventEmitter, Output, Input, SimpleChanges, OnChanges } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

export interface ButtonsGroupOption {
	value: any;
	tooltip?: string;
	tooltipPosition?: 'top' | 'bottom';
	icon?: string;
	label?: string;
}

export interface ButtonsGroupConfig {
	options: ButtonsGroupOption[];
	fullSize: boolean;
}

@Component({
	selector: 'buttons-group',
	templateUrl: 'buttons-group.html',
	styleUrls: ['buttons-group.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ButtonsGroupComponent),
			multi: true
		}
	]
})
export class ButtonsGroupComponent implements OnChanges { // ControlValueAccessor
	/** TODO: questo utilizzava il controlvalueaccessor, che pero' non triggera l'evento 
	 * change sul writevalue; potrebbe derivare dal fatto che non e' dentro un form. */
	@Input() config: ButtonsGroupConfig;
	@Input() disabled: boolean;
	@Output() change = new EventEmitter<number>();

	private onTouched: () => void;
	private onChange: (v: number) => void;

	buttons: ButtonsGroupOption[];
	fullSize: boolean;
	valueSelected: number;

	constructor() { }

	//when the input has been touched
	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	//when input value change
	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	//disabled the input
	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	//write value to the input
	writeValue(value: number): void {
		this.valueSelected = value;
		// this.onChange(this.valueSelected);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (!changes.config || !changes.config.currentValue)
			return;

		if (!this.config) return;

		if (this.config.options)
			this.buttons = this.config.options;
		if (this.config.fullSize)
			this.fullSize = this.config.fullSize;
	}

	click(value: number) {
		if (!this.disabled && this.valueSelected != value) {
			this.valueSelected = value;
			this.change.emit(value);
			if(this.onChange) this.onChange(this.valueSelected);
		}
	}
}
