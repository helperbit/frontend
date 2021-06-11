import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DonationComponent } from './donation/donation';
import { DonationFlowComponent } from './flow/flow';
import { TransactionComponent } from './transaction/transaction';
import { FormsModule } from '@angular/forms';
import { DonationInvoiceComponent } from './invoice/invoice';
import { DonationGiftComponent } from './gift/gift';
import { DonationGraphComponent } from './graph/graph';
import { RouterModule } from '@angular/router';
import { MetaGuard } from 'ng2-meta';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSliderModule } from 'app/shared/shared.slider';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'transaction/:txid',
				component: TransactionComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Transaction',
						'footerName': 'Transaction',
					}
				}
			},
			{
				path: 'list',
				component: DonationFlowComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Donation flow',
						'footerName': 'Donation flow',
					}
				}
			},
			{
				path: 'list/:page',
				component: DonationFlowComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Donation flow',
						'footerName': 'Donation flow',
					}
				}
			},
			{
				path: 'graph',
				component: DonationGraphComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Donation graph',
						'footerName': 'Donation graph',
					}
				}
			},
			{
				path: 'graph/:what/:id',
				component: DonationGraphComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Donation graph',
						'footerName': 'Donation graph',
					}
				}
			},
			{
				path: 'graph/project/:id/:seotext',
				component: DonationGraphComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Donation graph',
						'footerName': 'Donation Graph',
					}
				}
			},
			{
				path: ':txid',
				component: DonationComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Donation',
						'footerName': 'Donation',
					}
				}
			},
			{
				path: ':txid/gift',
				component: DonationGiftComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Donation',
						'footerName': 'Gift Donation',
					}
				}
			},
			{
				path: ':txid/invoice',
				component: DonationInvoiceComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Donation',
						'footerName': 'Donation',
					}
				}
			},
			// { path: 'charity-pot', { // charitypot
			// 	template: '<charity-pot></charity-pot>',
			// 	data: {
			// 		meta: {
			// 			'title': 'Charity Pot',
			// 			'footerName': 'Charity Pot',
			// 		}
			// 	}
			// },
		]),
		CommonModule,
		SharedModule,
		FormsModule,
		TranslateModule,
		SharedSliderModule
	],
	exports: [
		RouterModule,

		DonationComponent,
		DonationFlowComponent,
		TransactionComponent,
		DonationInvoiceComponent,
		DonationGiftComponent,
		DonationGraphComponent
	],
	declarations: [
		DonationComponent,
		DonationFlowComponent,
		TransactionComponent,
		DonationInvoiceComponent,
		DonationGiftComponent,
		DonationGraphComponent
	]
})
export class DonationModule {
	constructor() { }
} 