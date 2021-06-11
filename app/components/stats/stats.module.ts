import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SharedModule } from '../../shared/shared.module';
import { WorldStatsComponent } from './world/world';
import { NgbModalModule, NgbTabsetModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { RouterModule } from '@angular/router';
import { MetaGuard } from 'ng2-meta';
import { TopDonorsComponent } from './top-donors/top-donors';
import { TopAmbassadorsComponent } from './top-ambassadors/top-ambassadors';
import { FormsModule } from '@angular/forms';
import { SharedChartModule } from '../../shared/shared.chart.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSliderModule } from 'app/shared/shared.slider';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'top-ambassadors',
				component: TopAmbassadorsComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Top Ambassadors',
						'footerName': 'Top Ambassadors',
					}
				}
			},
			{
				path: 'top-ambassadors/:timeframe',
				component: TopAmbassadorsComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Top Ambassadors',
						'footerName': 'Top Ambassadors',
					}
				}
			},
			{
				path: 'top-donors',
				component: TopDonorsComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Top donors',
						'footerName': 'Top donors',
					}
				}
			},
			{
				path: 'top-donors/:timeframe',
				component: TopDonorsComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Top donors',
						'footerName': 'Top donors',
					}
				}
			},
			{
				path: 'world',
				component: WorldStatsComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Donation statistics',
						'footerName': 'Statistics',
					}
				}
			}
		]),
		CommonModule,
		SharedModule,
		SharedChartModule,
		LeafletModule,
		NgbTabsetModule,
		NgbModalModule,
		NgbDropdownModule,
		LoadingBarHttpClientModule,
		// LoadingBarRouterModule,
		LoadingBarModule,
		FormsModule,
		TranslateModule,
		SharedSliderModule
	],
	exports: [
		RouterModule
	],
	declarations: [
		WorldStatsComponent,
		TopDonorsComponent,
		TopAmbassadorsComponent
	]
})
export class StatsModule {
	constructor() { }
} 