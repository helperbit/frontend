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
import { SharedModule } from '../../shared/shared.module';
import { MeComponent } from './me';
import { MeProfileOperatingCountriesComponent } from './modals/operating-countries/operating-countries';
import { UserComponent } from './profile';
import { QRCodeModule } from 'angularx-qrcode';
import { NgbModalModule, NgbTabsetModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { RouterModule } from '@angular/router';
import { MetaGuard } from 'ng2-meta';
import { AuthGuard } from '../../shared/helpers/auth-guard';
import { MoneyPipe } from '../../shared/filters/money';
import { TranslateModule } from '@ngx-translate/core';
import { SharedChartModule } from '../../shared/shared.chart.module';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'me',
				component: MeComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Profile',
						'footerName': 'User Information',
						'showWizardProcedure': true
					},
					auth: {
						status: 'logged',
						allowedUserType: ['singleuser', 'npo', 'municipality', 'company'],
						redirect: {
							default: '/auth/login'
						}
					}
				}
			},
			{
				path: ':username',
				component: UserComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'User',
						'footerName': 'User Information',
					}
				}
			},
		]),
		CommonModule,
		SharedModule,
		SharedChartModule,
		LeafletModule,
		NgbTabsetModule,
		NgbModalModule,
		NgbDropdownModule,
		QRCodeModule,
		LoadingBarHttpClientModule,
		// LoadingBarRouterModule,
		LoadingBarModule,
		TranslateModule
	],
	exports: [
		RouterModule,

		MeComponent,
		MeProfileOperatingCountriesComponent,
		UserComponent
	],
	declarations: [
		MeComponent,
		MeProfileOperatingCountriesComponent,
		UserComponent
	],
	entryComponents: [
		MeProfileOperatingCountriesComponent
	],
	providers: [
		MoneyPipe
	]
})
export class ProfileModule {
	constructor() { }
} 