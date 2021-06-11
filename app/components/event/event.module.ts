import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { EventTableComponent } from './table/table';
import { RouterModule } from '@angular/router';
import { MetaGuard } from 'ng2-meta';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { EventMapComponent } from './map/map';
import { EventDonateComponent } from './eventdonate/eventdonate';
import { SeourlPipe } from 'app/shared/filters/seourl';
import { MagnitudePipe } from 'app/shared/filters/magnitude';
import { EventComponent } from './event/event';
import { MoneyPipe } from 'app/shared/filters/money';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { AmountSelectorComponent } from './widgets/amount-selector/amount-selector';
import { CountryFilterComponent } from './widgets/country-filter/country-filter';
import { SharedSliderModule } from 'app/shared/shared.slider';
import { SharedMediaModule } from 'app/shared/shared.media';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

const routes = [
	{
		path: 'map',
		component: EventMapComponent,
		canActivate: [MetaGuard],
		data: {
			meta: {
				'title': 'Event by map',
				'footerName': 'Event Map',
			}
		}
	},
	{
		path: 'list',
		component: EventTableComponent,
		canActivate: [MetaGuard],
		data: {
			meta: {
				'title': 'Event table',
				'footerName': 'Main Event List',
			}
		}
	},
	{
		path: 'list/:page',
		component: EventTableComponent,
		canActivate: [MetaGuard],
		data: {
			meta: {
				'title': 'Event table',
				'footerName': 'Main Event List',
			}
		}
	},
	{
		path: ':id/donate',
		component: EventDonateComponent,
		data: {
			meta: {
				'title': 'Event',
				'footerName': 'Event Donation',
			}
		}
	},
	{
		path: ':id/:seotext/donate',
		component: EventDonateComponent,
		data: {
			meta: {
				'title': 'Event',
				'footerName': 'Event',
			}
		}
	},
	{
		path: ':id',
		component: EventComponent,
		canActivate: [MetaGuard],
		data: {
			meta: {
				'title': 'Event',
				'footerName': 'Event',
			}
		}
	},
	{
		path: ':id/:seotext',
		component: EventComponent,
		canActivate: [MetaGuard],
		data: {
			meta: {
				'title': 'Event',
				'footerName': 'Event',
			}
		}
	}
];



@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		SharedModule,
		FormsModule,
		LeafletModule,
		TranslateModule,
		SharedSliderModule,
		SharedMediaModule,
		NgbTypeaheadModule
	],
	exports: [
		RouterModule,
		EventTableComponent,
		EventMapComponent,
		EventComponent,
		EventDonateComponent
	],
	declarations: [
		EventTableComponent,
		EventMapComponent,
		EventComponent,
		EventDonateComponent,

		AmountSelectorComponent,
		CountryFilterComponent
	],
	providers: [
		SeourlPipe,
		MagnitudePipe,
		MoneyPipe,
		DatePipe
	]
})
export class EventModule {
	constructor() { }
} 
