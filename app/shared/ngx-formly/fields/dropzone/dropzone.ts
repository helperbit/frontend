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

import { Component } from "@angular/core";
import { FieldType, FormlyFieldConfig } from "@ngx-formly/core";

export type FieldDropzone = FormlyFieldDropzone & FormlyFieldConfig;

@Component({
	selector: 'formly-field-dropzone',
	templateUrl: 'dropzone.html',
	styleUrls: ['dropzone.scss']
})
export class FormlyFieldDropzone extends FieldType {	
	constructor() { super(); }

	onAdd(file: File) {
		if(this.field.templateOptions.config && this.field.templateOptions.config.onAdd)
			this.field.templateOptions.config.onAdd(file);
	}

	onDelete(file: File) {
		if(this.field.templateOptions.config && this.field.templateOptions.config.onDelete)
			this.field.templateOptions.config.onDelete(file);
	}
}