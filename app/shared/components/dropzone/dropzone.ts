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

import { getMimeTypesFromExtensions, byteSize, isInArray } from '../../../shared/helpers/utils';
import { getBase64 } from '../../../shared/helpers/utils';
import { Component, OnDestroy, OnChanges, OnInit, forwardRef, Input, Output, ElementRef, ViewChild, EventEmitter, AfterViewInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, NG_VALIDATORS } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TextLimitPipe } from '../../../shared/filters/text-limit';
import { DecimalPipe } from '@angular/common';
import { FieldDropzone } from '../../ngx-formly/fields/dropzone/dropzone';
import { FileCustom, FileBase64 } from '../../../shared/types/input-file';
import { LoadingBarService } from '@ngx-loading-bar/core';

export interface FilesEvent {
	dataTransfer?: DataTransfer;
	originalEvent?: { dataTransfer?: DataTransfer };
}

export interface DropzoneConfig {
	maxSize?: number;
	maxFiles?: number;
	minFiles?: number;
	exts?: string[];
	extsAccepted?: string;
	disabled?: boolean;
	description?: string;
}

export interface DropzoneFile extends FileCustom {
	base64?: string | ArrayBuffer;
	class?: string;
}

@Component({
	selector: 'dropzone',
	templateUrl: 'dropzone.html',
	styleUrls: ['dropzone.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DropzoneComponent),
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => DropzoneComponent),
			multi: true,
		},
		TextLimitPipe
	]
})
export class DropzoneComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit, ControlValueAccessor {
	@Input() config: DropzoneConfig;
	@Input() field: FieldDropzone;
	@Output() onAdd: EventEmitter<DropzoneFile>;
	@Output() onDelete: EventEmitter<DropzoneFile>;

	@ViewChild('dropzone', { static: true }) elementDropzone: ElementRef;

	private onTouched: () => void;
	private onChange: (files: DropzoneFile[]) => void;

	private faClasses: { [key: string]: string };

	public formControlFiles: FormControl;
	public formControlFilesInput: FormControl;
	private subscriptionFiles: Subscription;
	private subscriptionFilesInput: Subscription;

	constructor(
		// private cfpLoadingBar: ICfpLoadingBar,
		private loadingBar: LoadingBarService,
		private textLimitPipe: TextLimitPipe,
		private numberPipe: DecimalPipe
	) {
		this.faClasses = {
			'image/jpeg': 'fa-file-image-o',
			'image/png': 'fa-file-image-o',
			'image/webp': 'fa-file-image-o',
			'application/msword': 'fa-file-word-o',
			'application/pdf': 'fa-file-pdf-o'
		};

		this.formControlFiles = new FormControl([]);
		this.formControlFilesInput = new FormControl([]);

		this.onAdd = new EventEmitter<DropzoneFile>();
		this.onDelete = new EventEmitter<DropzoneFile>();
	}

	registerOnTouched(fn) {
		this.onTouched = fn;
	}

	registerOnChange(fn: (files: DropzoneFile[]) => void): void {
		this.onChange = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.config.disabled = isDisabled;

		if (this.config.disabled)
			this.formControlFiles.disable();
	}

	// Formatter: Model to View
	//triggered when outside formControl change value
	writeValue(files: DropzoneFile[]): void {
		if (!Array.isArray(files) || files.length == 0) return;

		this.formControlFiles.setValue([]);

		for (let i = 0; i < files.length; i++)
			this.checkAndAddFile(files[i]);
	}

	// pass the validation of this component to the outside formControl this component
	validate(_: FormControl) {
		if(this.formControlFiles.value) {
			//CHECK FILES NUMBER

			if (this.config.maxFiles && this.formControlFiles.value.length > this.config.maxFiles)
				this.formControlFiles.setErrors({ ...this.formControlFiles.errors, maxFiles: true });
			else if(this.formControlFiles.errors && this.formControlFiles.errors.maxFiles) {
				delete this.formControlFiles.errors['maxFiles'];
				this.formControlFiles.setErrors({ ...this.formControlFiles.errors });
			}

			for (let i=0; i<this.formControlFiles.value.length; i++) {
				const dropzoneFile: DropzoneFile = this.formControlFiles.value[i];

				//CHECK EXTS
				const splitted = dropzoneFile.file.name.split('.');
				const ext = splitted[splitted.length - 1];

				if (this.config.exts && !isInArray(ext.toLowerCase(), this.field.templateOptions.config.exts)) {
					this.formControlFiles.setErrors({ ...this.formControlFiles.errors, extension: true });
					break
				}
				else if(this.formControlFiles.errors && this.formControlFiles.errors.extension) {
					delete this.formControlFiles.errors['extension'];
					this.formControlFiles.setErrors({ ...this.formControlFiles.errors });
				}

				//CHECK SIZE
				if(this.config.maxSize && dropzoneFile.file.size > this.config.maxSize) {
					this.formControlFiles.setErrors({ ...this.formControlFiles.errors, fileSize: true });
					break;
				}
				else if(this.formControlFiles.errors && this.formControlFiles.errors.fileSize) {
					delete this.formControlFiles.errors['fileSize'];
					this.formControlFiles.setErrors({ ...this.formControlFiles.errors });
				}
			}
		}
		
		return this.formControlFiles.valid ? null : this.formControlFiles.errors;
	}

	public getFileTooltip(file) {
		let text = '';

		text += 'name: '
		text += this.textLimitPipe.transform(file.file.name, 12);
		text += '<br> size: ';
		// parameter of numberPipe '{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}'
		text += this.numberPipe.transform(file.file.size / 1024, '2.0-0');
		text += 'kb <br> type: ';
		text += file.file.type;

		return text;
	}

	public getInfoTooltip(): string {
		let str = '';
		str += 'Max file size: ' + byteSize(this.config.maxSize) + '<br>';
		str += 'Max files: ' + this.config.maxFiles + '<br>';
		str += 'Extensions allowed: ' + this.config.exts.join();

		return str;
	}

	private checkAndAddFile(dropzoneFile: DropzoneFile) {
		this.loadingBar.start();

		getBase64(dropzoneFile.file).then((res: FileBase64 ) => {
			dropzoneFile.base64 = res.base64;
			dropzoneFile.class = this.faClasses[dropzoneFile.file.type];

			this.formControlFiles.setValue(this.formControlFiles.value.concat([dropzoneFile]));
			
			if (this.onAdd.observers.length > 0 && this.formControlFiles.errors == null)
				this.onAdd.emit(dropzoneFile);

			this.loadingBar.complete();
		}).catch(err => { });
	}

	public removeFile(index) {
		const deleted: DropzoneFile = this.formControlFiles.value.splice(index, 1)[0];
		this.formControlFiles.setValue(this.formControlFiles.value);

		if (this.onDelete.observers.length > 0)
			this.onDelete.emit(deleted);
	}

	ngOnDestroy() {
		this.subscriptionFiles.unsubscribe();
		this.subscriptionFilesInput.unsubscribe();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.config && changes.config.currentValue)
			this.config.extsAccepted = getMimeTypesFromExtensions(this.config.exts).join(',');
	}

	ngOnInit() {
		if (!this.config) this.config = {};

		/* FORM CONTROL SUBSCRITIONS */

		//triggered when the formControl formControlFiles of this component change
		this.subscriptionFiles = this.formControlFiles.valueChanges.subscribe((files: DropzoneFile[]) => {
			if(this.onChange) this.onChange(files);
		});

		//called when user use input fyle button to upload files
		//triggered when the formControl formControlFilesInput of this component change
		this.subscriptionFilesInput = this.formControlFilesInput.valueChanges.subscribe((fileList: FileList) => {
			for (let i = 0; i < fileList.length; i++)
				this.checkAndAddFile({ file: fileList[i] });
		});

		/* END FORM CONTROL SUBSCRITIONS */
	}

	ngAfterViewInit() {
		/* ELEMENT EVENTS */

		//manage remove class
		$(this.elementDropzone.nativeElement).bind('dragleave', (event) => {
			if (event != null) event.preventDefault();
			this.elementDropzone.nativeElement.childNodes[0].classList.remove('dropzone-hover');
		});

		//manage add class
		$(this.elementDropzone.nativeElement).bind('dragover', (event) => {
			if (event != null) event.preventDefault();
			this.elementDropzone.nativeElement.childNodes[0].classList.add('dropzone-hover');
		});

		//manage adding files
		$(this.elementDropzone.nativeElement).bind('drop', (event: any & FilesEvent) => {
			if (event != null) event.preventDefault();
			this.elementDropzone.nativeElement.childNodes[0].classList.remove('dropzone-hover');

			const dataTransfer = event.dataTransfer || event.originalEvent.dataTransfer;

			if (dataTransfer.items) {
				// Use DataTransferItemList interface to access the file(s)
				for (let i = 0; i < dataTransfer.items.length; i++)
					// If dropped items aren't files, reject them
					if (dataTransfer.items[i].kind === 'file')
						this.checkAndAddFile({ file: dataTransfer.items[i].getAsFile() });
					else
						// Use DataTransfer interface to access the file(s)
						for (let i = 0; i < dataTransfer.files.length; i++)
							this.checkAndAddFile({ file: dataTransfer.files[i] });
			}
		});

		/* END ELEMENT EVENTS */
	}
}