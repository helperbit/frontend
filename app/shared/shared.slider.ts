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