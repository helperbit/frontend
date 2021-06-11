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