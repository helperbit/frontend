// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import {} from 'jasmine';
import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import * as $ from 'jquery';

declare const require: any;

declare global {
	interface Window {
		$: any;
		jQuery: any;
		ga: any;
		HBDonateButton: any;
	}
}

window.ga = function(w, d) {}
window.jQuery = window.$ = $;

// import('babel-polyfill');
import('bootstrap/dist/js/bootstrap');

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
