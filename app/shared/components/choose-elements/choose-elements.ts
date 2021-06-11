import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, ControlValueAccessor } from '@angular/forms';
import { ProgressBarConfig } from '../progress-bar/progress-bar';
import { NgbModal, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TString } from 'app/models/common';
import { Subscription } from 'rxjs';

export interface ChooseElementElement {
	id?: string;
	title: TString;
	imgUrl: string;
	href: string;
	imgAlt?: string;
	progressBarConfig?: ProgressBarConfig;
}

export interface ModalChooseElementsConfig {
	title?: string;
	description?: string;
	type: 'image' | 'avatar' | 'project';
	//progressBar only for project type
	elements: ChooseElementElement[];
	onChange?: (element: ChooseElementElement) => void;
	disabled?: boolean;
}

export function openChooseElementsModal(modalService: NgbModal, config?: ModalChooseElementsConfig): NgbModalRef {
	const modalRef = modalService.open(ChooseElementsModalComponent, {
		size: 'xl',
		backdrop: 'static',
		// keyboard: false,
		windowClass: 'modalOverModal',
	});

	// debugger
	
	if(config && !modalRef.componentInstance.config)
		modalRef.componentInstance.config = config;
	
	modalRef.result.then((v) => { }, () => { });

	return modalRef;
}

@Component({
	selector: 'choose-elements',
	templateUrl: 'choose-elements.html',
	styleUrls: ['choose-elements.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ChooseElementsModalComponent),
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => ChooseElementsModalComponent),
			multi: true,
		}
	]
})
export class ChooseElementsModalComponent implements OnInit, ControlValueAccessor {
	@Input() config: ModalChooseElementsConfig;
	selected: ChooseElementElement | { progressBarConfig: ProgressBarConfig } & ChooseElementElement;

	private onTouched: () => void;
	private onChange: (file: any) => void;

	private formControl: FormControl;
	private subscription: Subscription;

	constructor(public modal: NgbActiveModal) {
		this.formControl = new FormControl();
	}

	registerOnTouched(fn) {
		this.onTouched = fn;
	}

	registerOnChange(fn: (element: ChooseElementElement) => void): void {
		this.onChange = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.config.disabled = isDisabled;

		if (this.config.disabled)
			this.formControl.disable();
	}

	// Formatter: Model to View
	//triggered when outside formControl change value
	writeValue(element: ChooseElementElement): void {
		if (!Array.isArray(element) || element.length == 0) return;
	}

	// pass the validation of this component to the outside formControl this component
	validate(_: FormControl) {
		return this.formControl.valid ? null : this.formControl.errors;
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	ngOnInit() {
		if(!this.config)
			this.config = {
				type: 'image',
				elements: [],
				disabled: false
			}

		// debugger

		/* FORM CONTROL SUBSCRITIONS */

		//triggered when the formControl formControlFiles of this component change
		this.subscription = this.formControl.valueChanges.subscribe((element: ChooseElementElement) => {
			if(this.onChange) this.onChange(element);
		});

		/* END FORM CONTROL SUBSCRITIONS */
	}

	dismiss() {
		this.modal.dismiss('cancel');
	}

	confirm() {
		this.modal.close(this.selected);
	}
}