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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { SlidershowComponent } from './components/slidershow/slidershow';
import { FileThumbComponent } from './components/file-thumb/file-thumb';
import { LightboxComponent } from './components/lightbox/lightbox';
import { SharedModule } from './shared.module';
import { FileThumb2Component } from './components/file-thumb2/file-thumb2';

@NgModule({
	imports: [
		RouterModule,
		CommonModule,
		TranslateModule,
		SharedModule
	],
	exports: [
		SlidershowComponent,
		FileThumbComponent,
		FileThumb2Component,
		LightboxComponent,
	],
	declarations: [
		SlidershowComponent,
		FileThumbComponent,
		FileThumb2Component,
		LightboxComponent,
	]
})
export class SharedMediaModule {
	constructor() { }
} 