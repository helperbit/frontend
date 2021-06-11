import { Component, forwardRef, Input, SimpleChanges, EventEmitter, Output, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Tags } from 'app/models/common';
import { UtilsService } from 'app/services/utils';
import { FieldTagsButtons } from 'app/shared/ngx-formly/fields/tags-button/tags-buttons';
import { objAndSameType } from '@ngx-formly/core/lib/utils';

export interface TagsButtonsConfig {
	tagsAvailable: { [key in Tags]?: { name: string; iconId: string; src: string } };
	tagsAvailableKeys: Tags[];
	onlyOne: boolean;
	disabled: boolean;
}

@Component({
	selector: 'tags-buttons',
	templateUrl: 'tags-buttons.html',
	styleUrls: ['tags-buttons.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TagsButtonsComponent),
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => TagsButtonsComponent),
			multi: true,
		}
	]
})
export class TagsButtonsComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
	@Input() config: TagsButtonsConfig;
	@Input() field: FieldTagsButtons;
	@Output() onClick: EventEmitter<string>;

	private onTouched: () => void;
	private onChange: (tags: Tags[]) => void;

	private lastTag: Tags;
	public selection: { [key in Tags]?: boolean };

	public formControl: FormControl;
	private subscription: Subscription;
	private tags;

	constructor(private utilsService: UtilsService) {
		this.selection = {};
		this.formControl = new FormControl([]);
		this.onClick = new EventEmitter();
	}

	registerOnTouched(fn) {
		this.onTouched = fn;
	}

	registerOnChange(fn: (tags: Tags[]) => void): void {
		this.onChange = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.config.disabled = isDisabled;

		if (this.config.disabled)
			this.formControl.disable();
	}

	// Formatter: Model to View
	//triggered when outside formControl change value
	writeValue(tags: Tags[]): void {
		if (!Array.isArray(tags) || tags.length == 0) return;

		if(this.config.onlyOne) {
			if(tags.length > 1)
				throw Error('If you set onlyOne property to \'true\' of FormlyFieldTagsButtons you can\'t pass more that 1 tag!');
			else
				this.lastTag = tags[0];
		}

		this.selection = this.config.tagsAvailableKeys.reduce((obj: { [key in Tags]?: boolean }, tag: Tags) => {
			obj[tag] = false;

			return obj;
		}, {});

		tags.forEach(tag => this.selection[tag] = true);

		this.formControl.setValue(tags);

		//VALIDATORS
		//if required, almost one tag required
		//if tags already insert, set dirty
	}

	// pass the validation of this component to the outside formControl this component
	validate(_: FormControl) {
		return this.formControl.valid ? null : this.formControl.errors;
	}

	public click(key: Tags) {
		if (this.config.onlyOne) {
			if (this.lastTag) {
				this.formControl.value.splice(this.formControl.value.indexOf(this.lastTag), 1);
				this.selection[this.lastTag] = false;
			}
			if (key != this.lastTag) {
				this.formControl.value.push(key);
				this.lastTag = key
			}
			else
				this.lastTag = null;
		}
		else if (this.selection[key])
			this.formControl.value.push(key);
		else
			this.formControl.value.splice(this.formControl.value.indexOf(key), 1);

		this.formControl.setValue(this.formControl.value);

		if (this.onClick)
			this.onClick.emit(key);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	private initializeConfig () {
		if(!this.config.tagsAvailableKeys)
			this.config.tagsAvailableKeys = <Tags[]>Object.keys(this.config.tagsAvailable);
	
		if(!this.config.onlyOne)
			this.config.onlyOne = false;
		
		if(!this.config.disabled)
			this.config.disabled = false;

		//TODO a che serviva?
		// this.config.tagsAvailable = this.config.tagsAvailableKeys.reduce((obj: { [key in Tags]?: { name: string; iconId: string; src: string } }, tag: Tags) => {
		// 	obj[tag] = this.tags[tag];

		// 	return obj;
		// }, {});
	}
	
	ngOnChanges(changes: SimpleChanges) {
		if (changes.config && changes.config.currentValue)
			this.initializeConfig();
	}

	ngOnInit() {
		this.tags = this.utilsService.tags();
		
		if (!this.config)
			this.config = {
				tagsAvailable: this.tags,
				tagsAvailableKeys: <Tags[]>Object.keys(this.tags),
				onlyOne: false,
				disabled: false
			};
		else
			this.initializeConfig();

		/* FORM CONTROL SUBSCRITIONS */

		//triggered when the formControl of this component change
		this.subscription = this.formControl.valueChanges.subscribe((tags: Tags[]) => {
			if(this.onChange) this.onChange(tags);
		});

		/* END FORM CONTROL SUBSCRITIONS */
	}
}
