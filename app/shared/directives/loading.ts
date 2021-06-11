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

import { Directive, ElementRef, Input, OnChanges, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Directive({
	selector: '[loading]'
})
export class LoadingDirective implements AfterViewInit, OnChanges {
	@Input() loading: boolean;
	private content: string;

	constructor(
		private translate: TranslateService,
		private element: ElementRef
	) {}

	ngOnChanges(changes) {
		if(!this.content) 
			return;

		if (this.loading) {
			this.element.nativeElement.innerHTML = `<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> <span translate>${this.translate.instant('Loading')}</span>...`;
			this.element.nativeElement.disabled = true;
		} else {
			this.element.nativeElement.innerHTML = this.content;
			this.element.nativeElement.disabled = false;
		}
	}

	ngAfterViewInit() {
		this.content = this.element.nativeElement.innerHTML;
	}
}
