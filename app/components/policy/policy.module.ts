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
import { PartsModule } from '../parts/parts.module';
import { TermsComponent, TermsContentComponent } from '../policy/terms';
import { PrivacyComponent, PrivacyContentComponent } from '../policy/privacy';
import { PrivacyContentHistory2Component } from '../policy/history/history';
import { PrivacyHistoryComponent } from '../policy/privacy-history';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { PolicyModalComponent } from '../policy/policy';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { MetaGuard } from 'ng2-meta';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'privacy/history',
				component: PrivacyHistoryComponent,
				canActivate: [MetaGuard],

				data: {
					meta: {
						'title': 'Privacy policy history',
						'footerName': 'Privacy policy history',
					}
				}
			},
			{
				path: 'terms',
				component: TermsComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Terms of service',
						'footerName': 'Terms',
					}
				}
			},
			{
				path: 'privacy',
				component: PrivacyComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Privacy policy',
						'footerName': 'Privacy',
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
	entryComponents: [
		PolicyModalComponent
	],
	declarations: [
		TermsComponent,
		TermsContentComponent,
		PolicyModalComponent,
		PrivacyComponent,
		PrivacyContentComponent,
		PrivacyContentHistory2Component,
		PrivacyHistoryComponent,
	],
	exports: [RouterModule]
})
export class PolicyModule {
	constructor() { }
} 