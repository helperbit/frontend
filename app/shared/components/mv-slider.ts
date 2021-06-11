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

import { Component, OnInit, forwardRef, AfterViewInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import * as Slider from 'bootstrap-slider';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
// import "bootstrap-slider/dist/css/bootstrap-slider.min.css";

@Component({
	selector: 'mv-slider',
	template: `<input #slider>`,
	styles: [``],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SliderComponent),
			multi: true
		}
	]
})
export class SliderComponent implements AfterViewInit, ControlValueAccessor {
	// The slider HTML element
	@ViewChild('slider') sliderElement;

	// The slider object
	slider: any;

	onChangeHandler = (v: number) => { };
	onTouchedHandler = () => { };

	initialOptions: any = {};
	initialStyle: any;

	// This property is not applied to the underlying slider element
	@Input()
	set style(value: any) {
		if (this.slider) {
			this.slider.getElement().setAttribute('style', value);
		} else {
			this.initialStyle = value;
		}
	}

	// Handle the value (two-way)
	@Input()
	set value(value: number | any[]) {
		if (this.slider) {
			this.slider.setValue(value);
		} else {
			this.initialOptions.value = value;
		}
	}
	get value(): number | any[] {
		return this.slider.getValue();
	}
	writeValue(value: any): void {
		if (this.slider) {
			this.slider.setValue(value);
		} else {
			this.initialOptions.value = value;
		}
	}
	@Output() valueChange = new EventEmitter();

	// The following properties are applied to the underlying slider element
	@Input()
	set min(value: number) {
		this.changeAttribute('min', value);
	}

	@Input()
	set max(value: number) {
		this.changeAttribute('max', value);
	}

	@Input()
	set step(value: number) {
		this.changeAttribute('step', value);
	}

	@Input()
	set precision(value: number) {
		this.changeAttribute('precision', value);
	}

	@Input()
	set orientation(value: string) {
		this.changeAttribute('orientation', value);
	}

	@Input()
	set range(value: boolean) {
		this.changeAttribute('range', value);
	}

	@Input()
	set selection(value: string) {
		this.changeAttribute('selection', value);
	}

	@Input()
	set tooltipType(value: string) {
		this.changeAttribute('tooltip', value);
	}

	@Input()
	set tooltipSplit(value: boolean) {
		this.changeAttribute('tooltip_split', value);
	}

	@Input()
	set tooltipPosition(value: boolean) {
		this.changeAttribute('tooltipPosition', value);
	}

	@Input()
	set handle(value: string) {
		this.changeAttribute('handle', value);
	}

	@Input()
	set reversed(value: boolean) {
		this.changeAttribute('reversed', value);
	}

	@Input()
	set rtl(value: boolean) {
		this.changeAttribute('rtl', value);
	}

	@Input()
	set enabled(value: boolean) {
		this.changeAttribute('enabled', value);
	}

	@Input()
	set naturalArrowKeys(value: boolean) {
		this.changeAttribute('natural_arrow_keys', value);
	}

	@Input()
	set ticks(value: any[]) {
		this.changeAttribute('ticks', value);
	}

	@Input()
	set ticksPositions(value: number[]) {
		this.changeAttribute('ticks_positions', value);
	}

	@Input()
	set ticksLabels(value: string[]) {
		this.changeAttribute('ticks_labels', value);
	}

	@Input()
	set ticksSnapBounds(value: number) {
		this.changeAttribute('ticks_snap_bounds', value);
	}

	@Input()
	set ticksTooltip(value: boolean) {
		this.changeAttribute('ticks_tooltip', value);
	}

	@Input()
	set scale(value: string) {
		this.changeAttribute('scale', value);
	}

	@Input()
	set labelledBy(value: string[]) {
		this.changeAttribute('labelledby', value);
	}

	@Input()
	set rangeHighlights(value: any[]) {
		this.changeAttribute('rangeHighlights', value);
	}

	@Input()
	set formatter(value: Function) {
		this.changeAttribute('formatter', value);
	}

	// The following events are emitted
	@Output() slide = new EventEmitter();

	@Output() slideStart = new EventEmitter();

	@Output() slideStop = new EventEmitter();

	@Output() change = new EventEmitter();

	constructor() { }

	private addChangeListeners() {
		this.slider.on('slide', (value: any) => {
			this.slide.emit(value);
			this.onChangeHandler(value);
			this.onTouchedHandler();
		});

		this.slider.on('slideStart', (value: any) => {
			this.slideStart.emit(value);
			this.onChangeHandler(value);
			this.onTouchedHandler();
		});

		this.slider.on('slideStop', (value: any) => {
			this.slideStop.emit(value);
			this.onChangeHandler(value);
			this.onTouchedHandler();
		});

		this.slider.on('change', (event: any) => {
			this.change.emit(event);
			this.valueChange.emit(event.newValue);
			this.onChangeHandler(event.newValue);
			this.onTouchedHandler();
		});
	}

	private prepareSlider() {
		// We need to add the change listeners again after each refresh
		this.addChangeListeners();

		// Add the styling to the element
		this.slider.getElement().setAttribute('style', this.initialStyle);
	}

	private changeAttribute(name: string, value: any) {
		if (this.slider) {
			this.slider.setAttribute(name, value);
			this.slider.refresh();
			this.prepareSlider();
		} else {
			this.initialOptions[name] = value;
		}
	}

	ngAfterViewInit() {
		// Don't set the value over the initial options, because it will alway
		// be reset. This option seems to be a little buggy.
		let value = undefined;

		if (this.initialOptions.value) {
			value = this.initialOptions.value;
			delete this.initialOptions['value'];
		}

		this.slider = new Slider(this.sliderElement.nativeElement, this.initialOptions);

		if (value) {
			this.slider.setValue(value);
		}

		this.prepareSlider();
	}



	registerOnChange(fn: any): void {
		this.onChangeHandler = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouchedHandler = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.enabled = !isDisabled
	}
}
