import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CookieComponent } from './cookie/cookie';
import { PartsModule } from '../parts/parts.module';
import { FaqComponent } from './faq/faq';
// import { JobsComponent } from './jobs/jobs';
import { AboutSectionContactComponent } from './about/sections/contact';
import { AboutSectionAwardComponent } from './about/sections/award';
import { AboutSectionBenefitComponent } from './about/sections/benefit';
import { AboutSectionPressComponent } from './about/sections/press';
import { AboutSectionPartnersComponent } from './about/sections/partners';
import { AboutSectionWhysignupComponent } from './about/sections/whysignup';
import { AboutSectionWhyhelperbitComponent } from './about/sections/whyhelperbit';
import { AboutSectionTopComponent } from './about/sections/top';
import { AboutSectionTeamComponent } from './about/sections/team';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { AboutComponent } from './about/about';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { MetaGuard } from 'ng2-meta';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				component: AboutComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'About',
						'footerName': 'About',
					}
				}
			},
			// {
			// 	path: 'jobs',
			// 	component: JobsComponent,
			// 	canActivate: [MetaGuard],
			// 	data: {
			// 		meta: {
			// 			'title': 'Open job positions',
			// 			'footerName': 'Jobs',
			// 		}
			// 	}
			// },
			{
				path: 'faq',
				component: FaqComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Faq',
						'footerName': 'Faq',
					}
				}
			},
			{
				path: 'cookies',
				component: CookieComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Cookies',
						'footerName': 'Cookies Policy',
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
	declarations: [
		CookieComponent,
		FaqComponent,
		// JobsComponent,
		AboutSectionContactComponent,
		AboutSectionAwardComponent,
		AboutSectionBenefitComponent,
		AboutSectionPressComponent,
		AboutSectionWhysignupComponent,
		AboutSectionWhyhelperbitComponent,
		AboutSectionTeamComponent,
		AboutSectionPartnersComponent,
		AboutSectionTopComponent,
		AboutComponent
	],
	exports: [RouterModule]
})
export class AboutModule {
	constructor() { }
} 