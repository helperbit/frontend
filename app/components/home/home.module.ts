import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
// import { HomeNewsAmbassadorComponent } from './home/news/ambassador/ambassador';
import { CarouselComponent } from './widgets/carousel/carousel';
import { PartsModule } from '../parts/parts.module';
// import {OldBrowserComponent} from './old-browser/old-browser';
import { HomeComponent } from './home/home';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { MetaGuard } from 'ng2-meta';
import { ErrorComponent } from './error/error';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'error',
				component: ErrorComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Error',
						'footerName': 'Error',
					}
				}
			},
			{
				path: '',
				component: HomeComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Home',
						'footerName': 'Home',
					}
				}
			}
		]),
		CommonModule,
		SharedModule,
		PartsModule,
		FormsModule,
		ReactiveFormsModule,
		FormlyModule,
		NgbModalModule,
		TranslateModule
	],
	entryComponents: [],
	declarations: [
		// HomeNewsAmbassadorComponent,
		ErrorComponent,
		CarouselComponent,
		// OldBrowserComponent,
		HomeComponent
	],
	exports: [RouterModule]
})
export class HomeModule {
	constructor() { }
} 