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
import { LoginComponent } from './login/login';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { FormlyModule } from '@ngx-formly/core';
import { SignupComponent } from './signup/signup';
import { ArchwizardModule } from 'angular-archwizard';
import { RecoveryComponent } from './recovery/recovery';
import { RouterModule } from '@angular/router';
import { MetaGuard } from 'ng2-meta';
import { AuthGuard } from '../../shared/helpers/auth-guard';
import { ModalWhySignupComponent } from './signup/modals/why-signup/why-signup';
import { TranslateModule } from '@ngx-translate/core';
import { PolicyModule } from '../policy/policy.module';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'login',
				component: LoginComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Login',
						'footerName': 'Login Form',
					},
					auth: {
						status: 'notlogged',
						allowquery: ['token', 'email'],
						redirect: '/user/me'
					}
				}
			},
			{
				path: 'recovery',
				component: RecoveryComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Password recovery',
						'footerName': 'Recovery',
					}
				}
			},
			{
				path: 'me/recovery',
				component: RecoveryComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Password recovery',
						'footerName': 'Recovery',
					}
				}
			},
			{
				path: 'signup',
				component: SignupComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Signup',
						'footerName': 'Signup Form',
					},
					auth: {
						status: 'notlogged',
						redirect: '/user/me'
					}
				}
			},
			{
				path: 'signup/landing/:type',
				component: SignupComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Signup',
						'footerName': 'Signup Form',
					}
				}
			}
		]),
		CommonModule,
		SharedModule,
		FormsModule,
		ReactiveFormsModule,
		// NgxBootstrapSliderModule,
		RecaptchaModule,
		FormlyModule,
		ArchwizardModule,
		TranslateModule,
		PolicyModule
	],
	exports: [
		RouterModule
	],
	entryComponents: [
		ModalWhySignupComponent
	],
	declarations: [
		LoginComponent,
		SignupComponent,
		RecoveryComponent,
		ModalWhySignupComponent
	]
})
export class AuthModule {
	constructor() { }
} 