import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import { TranslateService } from '@ngx-translate/core';
import { Component, Input, forwardRef, SimpleChanges, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormBuilder, FormGroup, ControlValueAccessor, FormControl } from '@angular/forms';
import { isEmpty } from 'app/shared/helpers/utils';
import { Subscription } from 'rxjs';
import { FormlyAttributes } from '@ngx-formly/core';

export interface InputSelectDateNumber {
	day: number;
	month: number;
	year: number;
}

export function getDateSelectorModelFromDate(date: Date) {
	return {
		year: date.getFullYear(),
		month: date.getMonth(),
		day: date.getDate()
	}
}

export function getDateFromDateSelectorModel(date: InputSelectDateNumber) {
	if (!date)
		return null;
		
	return new Date(date.year + '-' + (date.month + 1) + '-' + (date.day) + ' 01:00');
}

@Component({
	selector: 'date-selector-component',
	templateUrl: 'date-selector.html',
	styleUrls: ['date-selector.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DateSelectorComponent),
			multi: true
		}
	]
})
export class DateSelectorComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
	@Input() name: string;
	@Input() maxDate: Date;
	@Input() minDate: Date;
	@Input() formlyAttributes: FormlyAttributes;

	private onTouched: () => void;
	private onChange: (date: InputSelectDateNumber) => void;

	formControlYear: FormControl;
	formControlMonth: FormControl;
	formControlDay: FormControl;

	subscriptionYear: Subscription;
	subscriptionMonth: Subscription;
	subscriptionDay: Subscription;

	ranges: { years: number[]; months: { [key: number]: { name: string; days: number } }; days: number[] };
	config: {
		max: InputSelectDateNumber;
		min: InputSelectDateNumber;
		today: Date;
		months: any;
		disabled: boolean;
	};

	constructor(
		private translate: TranslateService,
		private formBuilder: FormBuilder
	) {
		this.formControlYear = new FormControl('');
		this.formControlMonth = new FormControl('');
		this.formControlDay = new FormControl('');

		this.config = {
			max: {
				year: new Date().getFullYear() + 100,
				month: 11,
				day: 31
			},
			min: {
				year: 1900,
				month: 0,
				day: 1
			},
			today: new Date(),
			months: {
				0: { name: translate.instant('January'), days: 31 },
				1: { name: translate.instant('February'), days: 28 },
				2: { name: translate.instant('March'), days: 31 },
				3: { name: translate.instant('April'), days: 30 },
				4: { name: translate.instant('May'), days: 31 },
				5: { name: translate.instant('June'), days: 30 },
				6: { name: translate.instant('July'), days: 31 },
				7: { name: translate.instant('August'), days: 31 },
				8: { name: translate.instant('September'), days: 30 },
				9: { name: translate.instant('October'), days: 31 },
				10: { name: translate.instant('November'), days: 30 },
				11: { name: translate.instant('December'), days: 31 }
			},
			disabled: false
		};

		this.ranges = { years: [], months: {}, days: [] };
	}

	registerOnTouched(fn) {
		this.onTouched = fn;
	}

	registerOnChange(fn: (date: InputSelectDateNumber) => void): void {
		this.onChange = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.config.disabled = isDisabled;

		if (this.config.disabled) {
			this.formControlYear.disable();
			this.formControlMonth.disable();
			this.formControlDay.disable();
		}
	}

	// Formatter: Model to View
	//triggered when formControl outside change value
	writeValue(value: InputSelectDateNumber): void {
		if (isEmpty(value)) return;
		const maxDate = new Date(this.config.max.year, this.config.max.month, this.config.max.day);
		const minDate = new Date(this.config.min.year, this.config.min.month, this.config.min.day);
		const date = new Date(value.year, value.month, value.day);

		// if (date.isAfter(maxDate)) throw new Error('Date is over the maximum date!');
		// if (date.isBefore(minDate)) throw new Error('Date is over the minimum date!');

		if (isAfter(date, maxDate) || isBefore(date, minDate)) return;

		this.formControlYear.setValue(value.year.toString());
		this.formControlMonth.setValue(value.month.toString());
		this.formControlDay.setValue(value.day.toString());
	}

	/* RANGES */

	//called when subscription of formControlYear is triggered
	private getYearsRange() {
		const years = [];
		for (let year = this.config.min.year; year <= this.config.max.year; year++)
			years.push(year);
		return years;
	}

	//called when subscription of formControlMonth is triggered
	private getMonthsRange() {
		if (this.formControlYear.value == '') return [];

		const localYear = parseInt(this.formControlYear.value);

		//quando l'anno selezionato è lo stesso di min.year o max.year, verrà settato il mese limiti rispettivamente alla tipologia di mese
		//mese minimo, da quel mese a Dicembre
		//mese massimo, da Gennaio a quel mese

		const months = {};
		let min = 0;
		let max = 11;

		//check months available if same year
		if (localYear == this.config.min.year && localYear == this.config.max.year) {
			min = this.config.min.month;
			max = this.config.max.month;
		}
		else if (localYear == this.config.min.year)
			min = this.config.min.month;
		else if (localYear == this.config.max.year)
			max = this.config.max.month;

		//save months
		for (let month = min; month <= max; month++)
			months[month] = this.config.months[month];

		return months;
	}

	//called when subscription of formControlDay is triggered
	private getDaysRange() {
		if (this.formControlMonth.value == '') return [];

		const localYear = parseInt(this.formControlYear.value);
		const localMonth = parseInt(this.formControlMonth.value);

		let min = 1;
		let max = this.config.months[this.formControlMonth.value].days;

		//check min and max days available just when some oof this combo are verified, also will be use deafult values
		if (localYear == this.config.min.year && localMonth == this.config.min.month && localYear == this.config.max.year && localMonth == this.config.max.month) {
			min = this.config.min.day;
			max = this.config.max.day;
		}
		else if (localYear == this.config.min.year && localMonth == this.config.min.month)
			min = this.config.min.day;
		else if (localYear == this.config.max.year && localMonth == this.config.max.month)
			max = this.config.max.day;

		const days = [];

		for (let day = min; day <= max; day++)
			days.push(day);

		//check leap year
		if (localMonth == 1 && localYear % 4 === 0 && max == 28)
			days.push(29);

		return days;
	}

	/* END RANGES */

	//check if all values are ready to create the outside binding
	private isModelReady() {
		return !isEmpty(this.formControlDay.value) && !isEmpty(this.formControlMonth.value) && !isEmpty(this.formControlYear.value);
	}

	//return the model that we have to be binding outside
	private getModel() {
		return {
			year: Number(this.formControlYear.value),
			month: Number(this.formControlMonth.value),
			day: Number(this.formControlDay.value)
		}
	}

	/* BINDING METHODS */

	//update max date configuration
	private updateBindingMaxDate() {
		this.config.max.year = this.maxDate.getFullYear();
		this.config.max.month = this.maxDate.getMonth();
		this.config.max.day = this.maxDate.getDate();
	}

	//update min date configuration
	private updateBindingMinDate() {
		this.config.min.year = this.minDate.getFullYear();
		this.config.min.month = this.minDate.getMonth();
		this.config.min.day = this.minDate.getDate();
	}

	/* END BINDING METHODS */

	ngOnDestroy() {
		this.subscriptionYear.unsubscribe();
		this.subscriptionMonth.unsubscribe();
		this.subscriptionDay.unsubscribe();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.maxDate && changes.maxDate.currentValue)
			this.updateBindingMaxDate();
		if (changes.minDate && changes.minDate.currentValue)
			this.updateBindingMinDate();
	}

	ngOnInit() {
		this.ranges.years = this.getYearsRange();
		this.formControlMonth.disable();
		this.formControlDay.disable();

		// this.formControlDay.setValidators()

		//update day ranges and check validation
		const updateDay = () => {
			this.ranges.days = this.getDaysRange();

			//to check if reset day value after calculate range
			if (this.ranges.days.indexOf(parseInt(this.formControlDay.value)) == -1) {
				this.formControlDay.setValue('');
			}
		};

		//triggered when the formControl formControlYear of this component change
		this.subscriptionYear = this.formControlYear.valueChanges.subscribe((year: string) => {
			//update months
			this.ranges.months = this.getMonthsRange();

			if (year == '' && !this.formControlMonth.disabled) this.formControlMonth.disable();
			else if (this.formControlMonth.disabled && !this.config.disabled) this.formControlMonth.enable();

			//to check if reset month value after calculate range
			if (!this.ranges.months[this.formControlMonth.value])
				this.formControlMonth.setValue('');

			//update days
			updateDay();

			//update model
			if (this.isModelReady()) this.onChange && this.onChange(this.getModel());
		});

		//triggered when the formControl formControlMonth of this component change
		this.subscriptionMonth = this.formControlMonth.valueChanges.subscribe((month: string) => {
			if (month == '' && !this.formControlDay.disabled) this.formControlDay.disable();
			else if (this.formControlDay.disabled && !this.config.disabled) this.formControlDay.enable();

			//update days
			updateDay();

			//update model
			if (this.isModelReady()) this.onChange && this.onChange(this.getModel());
		});

		//triggered when the formControl formControlDay of this component change
		this.subscriptionDay = this.formControlDay.valueChanges.subscribe((day: string) => {
			//update model
			if (this.isModelReady()) this.onChange && this.onChange(this.getModel());
		});
	}
}
