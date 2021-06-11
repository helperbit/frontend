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

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app.module';

import * as $ from 'jquery';
import AppSettings from './app.settings';
declare global {
	interface Window {
		$: any;
		jQuery: any;
		ga: any;
		HBDonateButton: any;
		dateLocale: any;
	}
}

window.jQuery = window.$ = $;
// window.gaWrapper = function(w, d) {
// 	if ('ga' in window)
// 		window.ga(w,d);
// };


import('bootstrap/dist/js/bootstrap');

if (AppSettings.production)
	enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule, []).catch(err => {
	// eslint-disable-next-line no-console
	console.log(err);
});