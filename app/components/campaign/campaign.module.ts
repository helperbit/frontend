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
import { CampaignComponent } from './campaign/campaign';
import { MoneyPipe } from '../../shared/filters/money';
import { MoneyToBTCPipe } from '../../shared/filters/money-to-btc';
import { CampaignCreateComponent } from './create/create';
import { Route, RouterModule } from '@angular/router';
import { MetaGuard } from 'ng2-meta';
import { AuthGuard } from '../../shared/helpers/auth-guard';
import { CampaignService } from './campaign.service';
import { TranslateModule } from '@ngx-translate/core';
import { CampaignEditComponent } from './edit/edit';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedFormExModule } from 'app/shared/shared.formex.module';
import { ArchwizardModule } from 'angular-archwizard';



const routes: Route[] = [
	{
		path: 'create',
		component: CampaignCreateComponent,
		canActivate: [MetaGuard, AuthGuard],
		data: {
			meta: {
				'title': 'Your campaigns',
				'footerName': 'My Fundraising Campaigns',
				'showWizardProcedure': true
			},
			auth: {
				status: 'logged',
				// allowedUserType: ['singleuser', 'company'],
				redirect: {
					default: '/auth/login',
					wrongUserType: '/user/me'
				}
			}
		}
	},
	{
		path: ':id',
		component: CampaignComponent,
		canActivate: [MetaGuard],
		data: {
			meta: {
				'title': 'Campaign',
				'footerName': 'Fundraising Campaign',
			}
		}
	},
	{
		path: ':id/edit',
		component: CampaignEditComponent,
		canActivate: [MetaGuard],
		data: {
			meta: {
				'title': 'Edit Campaign',
				'footerName': 'Edit Campaign',
				'showWizardProcedure': true
			},
			auth: {
				status: 'logged',
				// allowedUserType: ['singleuser', 'company', 'npo'],
				redirect: {
					default: '/auth/login',
					wrongUserType: '/user/me'
				}
			}
		}
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		SharedModule,
		TranslateModule,
		ReactiveFormsModule,
		FormlyModule,
		ArchwizardModule,
		NgbModalModule,
		SharedFormExModule,
	],
	exports: [
		RouterModule,
		CampaignComponent,
		CampaignCreateComponent,
		CampaignEditComponent
	],
	declarations: [
		CampaignComponent,
		CampaignCreateComponent,
		CampaignEditComponent
	],
	providers: [
		CampaignService,
		MoneyPipe,
		MoneyToBTCPipe
	]
})
export class CampaignModule {
	constructor() { }
} 