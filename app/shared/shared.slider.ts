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
import { SliderComponent } from './components/mv-slider';


@NgModule({
	imports: [
		RouterModule,
		CommonModule
	],
	exports: [
		SliderComponent
	],
	declarations: [
		SliderComponent
	]
})
export class SharedSliderModule {
	constructor() {
		// const style = document.createElement('link');
		// style.href = 'bootstrap-slider.bundle.css';
		// style.rel = 'stylesheet';
		// document.getElementsByTagName('head')[0].appendChild(style);
		
		// const script = document.createElement('script');
		// script.src = 'bootstrap-slider.bundle.js';
		// script.type = 'text/javascript';
		// script.async = true;
		// script.charset = 'utf-8';
		// document.getElementsByTagName('head')[0].appendChild(script);
	}
} 