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