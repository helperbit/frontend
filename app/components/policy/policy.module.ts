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