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

import { Component, Input, OnChanges, Output, forwardRef, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
	selector: 'pagination',
	templateUrl: 'pagination.html',
	styleUrls: ['pagination.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PaginationComponent),
			multi: true
		}
	]
})
export class PaginationComponent implements OnChanges {
	@Input() totalItems: number;
	@Input() itemsPerPage: number;
	@Input() maxSize: number;
	@Input() boundaryLinks: boolean;
	@Input() disabled: boolean;
	@Output() change = new EventEmitter<number>();

	currentPage: number;
	totalPages: number;
	pages: number[];

	onChangeHandler = (v: number) => { };
	onTouchedHandler = () => { };

	constructor() { }

	noPrevious() {
		return this.currentPage == 1;
	}
	noNext() {
		return this.currentPage >= this.totalPages;
	}

	generatePages() {
		this.pages = [];
		let start = this.currentPage - Math.floor(this.maxSize / 2);
		if (start < 1)
			start = 1;
		let end = start + this.maxSize;
		if (end > this.totalPages) {
			end = this.totalPages;
			start = (end - 4) > 1 ? end - 4 : 1;
		}

		for (let i = start; i <= end; i++)
			this.pages.push(i);
	}

	selectPage(page: number) {
		setTimeout(() => {
			this.currentPage = page;
			this.change.emit(this.currentPage);
			this.onTouchedHandler();
			this.onChangeHandler(this.currentPage);
			this.generatePages();
		}, 0);
	}

	get value(): number {
		return this.currentPage;
	}

	writeValue(value: number): void {
		this.currentPage = value;
		this.generatePages();
		this.onChangeHandler(this.currentPage);
	}

	registerOnChange(fn: any): void {
		this.onChangeHandler = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouchedHandler = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	ngOnChanges() {
		this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
		this.generatePages();
	}
}
