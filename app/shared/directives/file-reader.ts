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