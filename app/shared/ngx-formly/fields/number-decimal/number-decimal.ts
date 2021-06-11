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

import { Component, OnInit } from "@angular/core";
import { FieldType } from "@ngx-formly/core";


@Component({
	selector: 'formly-field-dropzone',
	templateUrl: 'number-decimal.html',
	styleUrls: ['number-decimal.scss']
})
export class FormlyFieldNumberDecimal extends FieldType implements OnInit {
	public showErrorNumberDeciamal: boolean;
	
	constructor() {
		super();

		this.showErrorNumberDeciamal = false;
	}

	ngOnInit() {
		this.formControl.valueChanges.subscribe((n: number) => {
			let err = false;
			if(typeof this.formControl.errors == 'object' && this.formControl.errors != null) {
				for(const key in this.formControl.errors) {
					if(this.formControl.errors[key]) {
						err = true;
						break;
					}
				}
				
				this.showErrorNumberDeciamal = !this.formControl.pristine && err;
			}
			else
				this.showErrorNumberDeciamal = err;
		});
	}
}