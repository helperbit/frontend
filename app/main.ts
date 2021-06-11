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