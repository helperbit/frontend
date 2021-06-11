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
import { NgbModalModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MeNotificationsComponent } from './notifications/notifications';
import { MeBadgesComponent } from './badges/badges';
import { MeInvoiceableComponent } from './invoiceable/invoiceable';
import { MeDeleteComponent } from './delete/delete';
import { MeControlPanelComponent } from './controlpanel/controlpanel';
import { MeAdminComponent } from './admin/admin';
import { MePrivacyComponent } from './privacy/privacy';
import { FormlyModule } from '@ngx-formly/core';
import { ArchwizardModule } from 'angular-archwizard';
import { MeVerifyComponent } from './verify/verify';
import { MeGeolocalizationComponent } from './geolocalization/geolocalization';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { RouterModule } from '@angular/router';
import { MetaGuard } from 'ng2-meta';
import { AuthGuard } from '../../shared/helpers/auth-guard';
import { MeEditComponent } from './edit/edit';
import { ModalNotSavedComponent } from './edit/modals/not-saved/not-saved';
import { MeSecurityComponent } from './security/security';
import { GoalsBarComponent } from './widgets/goals-bar/goals-bar';
import { MeAmbassadorComponent } from './ambassador/ambassador';
import { ModalMeVerifyProviderCompanyComponent } from './verify/providers/company/company';
import { ModalMeVerifyProviderDocumentComponent } from './verify/providers/document/document';
import { ModalMeVerifyProviderGpsComponent } from './verify/providers/gps/gps';
import { ModalAddressComponent } from './geolocalization/modals/address/address';
import { ModalMeVerifyProviderNpoMemorandumComponent } from './verify/providers/npo/memorandum/memorandum';
import { ModalMeVerifyProviderNpoStatuteComponent } from './verify/providers/npo/statute/statute';
import { ModalMeVerifyProviderResidencyComponent } from './verify/providers/residency/residency';
import { ModalMeVerifyProviderOtcComponent } from './verify/providers/otc/otc';
import { ModalMeVerifyProviderNpoAdminsComponent } from './verify/providers/npo/admins/admins';
import { TranslateModule } from '@ngx-translate/core';
import { MeSocialEditComponent } from './socialedit/socialedit';
import { SharedFormExModule } from 'app/shared/shared.formex.module';
import { SharedMediaModule } from 'app/shared/shared.media';
import { MeRorCreateComponent } from './rors/create/create';
import { ModalRorDetailsComponent } from './rors/modals/details/details';
import { MeRorsComponent } from './rors/rors';
// import AlertComponent from './alert/alert';


@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'socialedit',
				component: MeSocialEditComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Profile edit',
						'footerName': 'User Information',
						'showWizardProcedure': true
					},
					auth: {
						status: 'logged',
						allowedUserType: ['singleuser'],
						redirect: {
							default: '/auth/login',
							wrongUserType: '/user/me'
						}
					}
				}
			},
			{
				path: 'ambassador',
				component: MeAmbassadorComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Ambassador',
						'footerName': 'Ambassador',
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
				path: 'controlpanel',
				component: MeControlPanelComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Control panel',
						'footerName': 'Control Panel',
						'showWizardProcedure': true
					},
					auth: {
						status: 'logged',
						allowedUserType: ['singleuser'],
						redirect: {
							default: '/user/me'
						}
					}
				}
			},
			{
				path: 'notifications',
				component: MeNotificationsComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Notifications',
						'footerName': 'Notifications',
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
				path: 'badges/:badge',
				component: MeBadgesComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Badges',
						'footerName': 'Badges',
						'showWizardProcedure': true
					},
					auth: {
						status: 'logged',
						allowedUserType: ['singleuser'],
						redirect: {
							default: '/auth/login',
							wrongUserType: '/user/me'
						}
					}
				}
			},
			{
				path: 'badges',
				component: MeBadgesComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Badges',
						'footerName': 'Badges',
						'showWizardProcedure': true
					},
					auth: {
						status: 'logged',
						allowedUserType: ['singleuser'],
						redirect: {
							default: '/auth/login',
							wrongUserType: '/user/me'
						}
					}
				}
			},
			{
				path: 'privacy',
				component: MePrivacyComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Profile privacy',
						'footerName': 'Privacy',
						'showWizardProcedure': true
					},
					auth: {
						status: 'logged',
						allowedUserType: ['singleuser'],
						redirect: {
							default: '/auth/login',
							wrongUserType: '/user/me'
						}
					}
				}
			},
			{
				path: 'verify',
				component: MeVerifyComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Profile verification',
						'footerName': 'Verification',
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
				path: 'invoiceable',
				component: MeInvoiceableComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Invoiceable donations',
						'footerName': 'Invoiceable Donations',
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
				path: 'geoloc',
				component: MeGeolocalizationComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Profile geolocalization',
						'footerName': 'Geolocalization',
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
				path: 'admin',
				component: MeAdminComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Profile admins',
						'footerName': 'Administration',
						'showWizardProcedure': true
					},
					auth: {
						status: 'logged',
						allowedUserType: ['npo', 'municipality'],
						redirect: {
							default: '/auth/login',
							wrongUserType: '/user/me'
						}
					}
				}
			},
			{
				path: 'delete',
				component: MeDeleteComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Profile delete',
						'footerName': 'Delete Account',
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
				path: 'edit',
				component: MeEditComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Profile edit',
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
				path: 'security',
				component: MeSecurityComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Profile security',
						'footerName': 'Security',
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
				path: 'rors',
				component: MeRorsComponent,
				data: {
					meta: {
						'title': 'Requests of refund',
						'footerName': 'Refund Claims',
						'showWizardProcedure': true
					},
					auth: {
						status: 'logged',
						allowedUserType: ['npo', 'municipality', 'company', 'singleuser'],
						redirect: {
							default: '/auth/login',
							wrongUserType: '/user/me'
						}
					}
				}
			},
			{
				path: 'rors/create',
				component: MeRorCreateComponent,
				data: {
					meta: {
						'title': 'Requests of refund',
						'footerName': 'Refund Claims',
						'showWizardProcedure': true
					},
					auth: {
						status: 'logged',
						allowedUserType: ['npo', 'municipality', 'company', 'singleuser'],
						redirect: {
							default: '/auth/login',
							wrongUserType: '/user/me'
						}
					}
				}
			}
		]),
		CommonModule,
		SharedModule,
		FormsModule,
		ReactiveFormsModule,
		FormlyModule,
		NgbModalModule,
		NgbTabsetModule,
		ArchwizardModule,
		LeafletModule,
		TranslateModule,
		SharedFormExModule,
		SharedMediaModule
	],
	exports: [
		RouterModule
	],
	providers: [
	],
	entryComponents: [
		//verify
		ModalAddressComponent,

		//verify provider
		ModalMeVerifyProviderCompanyComponent,
		ModalMeVerifyProviderDocumentComponent,
		ModalMeVerifyProviderGpsComponent,
		ModalMeVerifyProviderNpoMemorandumComponent,
		ModalMeVerifyProviderNpoStatuteComponent,
		ModalMeVerifyProviderResidencyComponent,
		ModalMeVerifyProviderOtcComponent,
		ModalMeVerifyProviderNpoAdminsComponent,

		MeAmbassadorComponent,
		ModalNotSavedComponent,

		ModalRorDetailsComponent
	],
	declarations: [
		// AlertComponent,
		GoalsBarComponent,
		MeNotificationsComponent,
		MeBadgesComponent,
		MeInvoiceableComponent,
		MeDeleteComponent,
		MeControlPanelComponent,
		MeAdminComponent,
		MePrivacyComponent,
		MeVerifyComponent,
		MeGeolocalizationComponent,
		MeEditComponent,
		ModalNotSavedComponent,
		MeSecurityComponent,
		MeAmbassadorComponent,
		MeSocialEditComponent,
		MeRorsComponent,
		MeRorCreateComponent,
		ModalRorDetailsComponent,

		//verify
		ModalAddressComponent,

		//verify provider
		ModalMeVerifyProviderCompanyComponent,
		ModalMeVerifyProviderDocumentComponent,
		ModalMeVerifyProviderGpsComponent,
		ModalMeVerifyProviderNpoMemorandumComponent,
		ModalMeVerifyProviderNpoStatuteComponent,
		ModalMeVerifyProviderResidencyComponent,
		ModalMeVerifyProviderOtcComponent,
		ModalMeVerifyProviderNpoAdminsComponent,
	]
})
export class DashboardModule {
	constructor() { }
} 