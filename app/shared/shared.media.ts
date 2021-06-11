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