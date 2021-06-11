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