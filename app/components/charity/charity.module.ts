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
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ProposednpoComponent } from './proposednpo/proposednpo';
import { MoneyPipe } from '../../shared/filters/money';
import { NgbModalModule, NgbTabsetModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { RouterModule } from '@angular/router';
import { MetaGuard } from 'ng2-meta';
import { CharityTableComponent } from './table/table';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSliderModule } from 'app/shared/shared.slider';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'proposed/:propose?',
				component: ProposednpoComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Propose an organization',
						'footerName': 'Proposed NPO',
					}
				}
			},
			{
				path: 'list',
				component: CharityTableComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Organization list',
						'footerName': 'Organization list',
					}
				}
			},
			{
				path: 'list/:page',
				component: CharityTableComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Organization list',
						'footerName': 'Organization list',
					}
				}
			},
			{
				path: 'proposed',
				component: ProposednpoComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Propose an organization',
						'footerName': 'Proposed NPO',
					}
				}
			}
		]),
		CommonModule,
		SharedModule,
		LeafletModule,
		FormsModule,
		NgbTabsetModule,
		NgbModalModule,
		NgbDropdownModule,
		ReactiveFormsModule,
		FormlyModule,
		LoadingBarHttpClientModule,
		// LoadingBarRouterModule,
		LoadingBarModule,
		TranslateModule,
		SharedSliderModule
	],
	exports: [
		RouterModule,

		CharityTableComponent,
		ProposednpoComponent
	],
	declarations: [
		CharityTableComponent,
		ProposednpoComponent,
	],
	providers: [
		MoneyPipe
	]
})
export class CharityModule {
	constructor() { }
} 