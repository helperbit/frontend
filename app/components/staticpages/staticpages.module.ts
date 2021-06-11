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
import { StaticAdvancedDonationsComponent } from './advanced-donations';
import { StaticAmbassadorComponent } from './ambassador';
import { StaticFundraisingCampaignsComponent } from './fundraising-campaigns';
import { StaticBadgesComponent } from './badges';
import { StaticLegalBodyVerifyComponent } from './legal-body';
import { StaticProjectsComponent } from './projects';
import { StaticTrustLevelComponent } from './trust-level';
import { StaticDonationsComponent } from './donations';
import { StaticProposeNoprofitComponent } from './propose-noprofit';
import { StaticGeolocalizationComponent } from './geolocalization';
import { StaticMultisignatureComponent } from './multisignature';
import { StaticManifestoComponent } from './manifesto';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MetaGuard } from 'ng2-meta';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'manifesto',
				component: StaticManifestoComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Helperbit\'s Manifesto',
						'footerName': 'Helperbit\'s Manifesto',
					}
				}
			},
			{
				path: 'multisignature-wallet',
				component: StaticMultisignatureComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Multisignature Bitcoin Wallet',
						'footerName': 'Multisignature Bitcoin Wallet',
					}
				}
			},
			{
				path: 'donations',
				component: StaticDonationsComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Donations',
						'footerName': 'Donations',
					}
				}
			},
			{
				path: 'advanced-donations',
				component: StaticAdvancedDonationsComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Advanced Donations',
						'footerName': 'Advanced Donations',
					}
				}
			},
			{
				path: 'geolocalization',
				component: StaticGeolocalizationComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Geolocation',
						'footerName': 'Geolocation',
					}
				}
			},
			{
				path: 'propose-noprofit',
				component: StaticProposeNoprofitComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Propose Non-Profit Organizations',
						'footerName': 'Propose Non-Profit Organizations',
					}
				}
			},
			{
				path: 'trust-level',
				component: StaticTrustLevelComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Verification and Trust Level of a single user',
						'footerName': 'Verification and Trust Level of a single user',
					}
				}
			},
			{
				path: 'social-projects',
				component: StaticProjectsComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Create a Social Project',
						'footerName': 'Create a Social Project',
					}
				}
			},
			{
				path: 'fundraising-campaigns',
				component: StaticFundraisingCampaignsComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Fundraising Campaigns',
						'footerName': 'Fundraising Campaigns',
					}
				}
			},
			{
				path: 'legal-body-verify',
				component: StaticLegalBodyVerifyComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Verification process for a Legal Body',
						'footerName': 'Verification process for a Legal Body',
					}
				}
			},
			{
				path: 'ambassador',
				component: StaticAmbassadorComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Ambassador',
						'footerName': 'Ambassador',
					}
				}
			},
			{
				path: 'badges',
				component: StaticBadgesComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Badges',
						'footerName': 'Badges',
					}
				}
			},
		]),
		CommonModule,
		SharedModule,
		PartsModule,
		TranslateModule
	],
	declarations: [
		StaticAdvancedDonationsComponent,
		StaticAmbassadorComponent,
		StaticBadgesComponent,
		StaticFundraisingCampaignsComponent,
		StaticLegalBodyVerifyComponent,
		StaticProjectsComponent,
		StaticTrustLevelComponent,
		StaticDonationsComponent,
		StaticProposeNoprofitComponent,
		StaticGeolocalizationComponent,
		StaticMultisignatureComponent,
		StaticManifestoComponent
	],
	exports: [RouterModule]
})
export class StaticPagesModule {
	constructor() { }
} 