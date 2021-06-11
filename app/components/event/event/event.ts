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

import format from 'date-fns/format';
import { UtilsService } from '../../../services/utils';
import { toCapitalize, getLocalStorage } from '../../../shared/helpers/utils';
import { SocialShareConfig, SocialShareStyle } from '../../../shared/components/social-share/social-share';
import { DonationListConfig } from '../../../shared/components/donation-list/donation-list';
import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { TranslateService } from '@ngx-translate/core';
import { ArticleService } from '../../../services/article';
import { CurrencyService } from '../../../services/currency';
import { EventService, IEvent } from '../../../models/event';
import { Project } from '../../../models/project';
import AppSettings from '../../../app.settings';
import { Component, OnInit } from '@angular/core';
import { MoneyPipe } from '../../../shared/filters/money';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MetaService } from 'ng2-meta';
import { markersOfEvent, countriesOfEvent, geometryOfEvent } from '../event.utils';
import { Map, MapOptions, latLngBounds, marker, Marker, divIcon, latLng, LatLng, geoJSON, icon } from 'leaflet';

@Component({
	selector: 'event-component',
	templateUrl: 'event.html',
	styleUrls: ['../../../sass/main/custom/page.scss', 'event.scss']
})
export class EventComponent implements OnInit {
	id: string;

	map: Map;
	options: MapOptions;
	baseLayers: any;
	center: LatLng;
	markers: Marker[];

	username: string;
	usertype: string;
	event: IEvent;
	images: any[];
	projects: Project[];
	socialShare: { config: SocialShareConfig; style: SocialShareStyle };
	listConfig: DonationListConfig;
	listConfigSmall: DonationListConfig;
	pageHeader: PageHeaderConfig;

	constructor(
		private route: ActivatedRoute,
		private eventService: EventService,
		private currencyService: CurrencyService,
		private articleService: ArticleService,
		private translate: TranslateService,
		private utilsService: UtilsService,
		private moneyPipe: MoneyPipe,
		private datePipe: DatePipe,
		private metaService: MetaService
	) {
		this.options = {
			maxBounds: latLngBounds(latLng(-90, -180), latLng(90, 180)),
			zoom: 2,
			maxZoom: 11,
			minZoom: 2,
			attributionControl: true,
			layers: [AppSettings.tileLayers.esriTerrain()]
		};
		this.baseLayers = {
			'ESRI Terrain': AppSettings.tileLayers.esriTerrain(),
			'OpenStreetMap': AppSettings.tileLayers.openStreetMap()
		};
		this.markers = [];

		this.event = null;
		this.projects = [];

		this.socialShare = {
			config: {
				title: '__TYPE__ ' + translate.instant('in') + ' __COUNTRIES__',
				hashtags: [translate.instant('helperbit')]
			},
			style: {
				type: 'circle',
				colored: true
			}
		};

		this.listConfig = {
			type: {
				value: 'event'
			},
			columnsType: 'country',
			hideHeader: true,
			pagination: true,
			refresh: 60
		};

		this.listConfigSmall = {
			type: {
				value: 'event'
			},
			columnsType: 'countrySmall',
			hideHeader: true,
			limit: 10,
			refresh: 60
		};


		this.pageHeader = {
			info: {
				boxes: []
			}
		};
	}


	onMapReady(map: Map) {
		this.map = map;
		window.dispatchEvent(new Event('resize'));
		this.map.invalidateSize(true);
		this.updateEvent();
	}

	scrollTo(el: HTMLElement) {
		el.scrollIntoView({ behavior: "smooth" });
	}

	updateEvent() {
		this.eventService.get(this.id).subscribe(event => {
			//this.tiles.options.attribution += '<br>Event data derived from ' + res.data.datasource;
			this.event = event;
			this.listConfig = { ...this.listConfig, ...{ type: { object: this.event, value: 'event' } } };
			this.listConfigSmall = { ...this.listConfigSmall, ...{ type: { object: this.event, value: 'event' } } };

			this.event.article = this.articleService.generateEventArticle(this.event);
			this.images = this.event.images.concat(this.event.news.map(n => n.image)).map(img => { return { 'type': 'image/png', 'mediaId': img }; });


			this.pageHeader.info.boxes.push({
				title: this.moneyPipe.transform(this.event.donationsvolume, 'short', true),
				subTitle: this.translate.instant('received')
			});

			this.pageHeader.info.boxes.push({
				title: String(this.event.donations),
				subTitle: this.translate.instant('supporters')
			});

			this.pageHeader.info.boxes.push({
				title: String(this.event.population.affected),
				subTitle: this.translate.instant('affected')
			});

			this.pageHeader.info.boxes.push({
				title: this.datePipe.transform(this.event.startdate, 'mediumDate'),
				subTitle: this.translate.instant('date')
			});

			this.currencyService.onCurrencyChange.subscribe(_ => {
				this.pageHeader.info.boxes[0].title = this.moneyPipe.transform(this.event.donationsvolume, 'short', true);
			});

			this.socialShare.config = {
				...this.socialShare.config, ...{
					title: this.socialShare.config.title.replace('__TYPE__', toCapitalize(this.translate.instant(this.event.type))).replace('__COUNTRIES__', this.translate.instant(this.utilsService.getCountryOfISO(this.event.affectedcountries[0]))),
					hashtags: this.socialShare.config.hashtags.concat([toCapitalize(this.translate.instant(this.event.type)), this.translate.instant(this.utilsService.getCountryOfISO(this.event.affectedcountries[0]))])
				}
			};

			this.utilsService.setMeta(
				this.event.article.title,
				this.utilsService.getSString(this.event.article.body),
				this.event.images.length == 0 ?
					'https://app.helperbit.com/' + this.utilsService.getCountryOfISO(this.event.affectedcountries[0], 'flag')
					:
					'https://api.helperbit.com/api/v1/media/' + this.event.images[0]
			);


			const structuredData = {
				"@context": "https://schema.org",
				"@type": "NewsArticle",
				"mainEntityOfPage": {
					"@type": "WebPage",
					"@id": 'https://app.helperbit.com/event/' + this.id
				},
				"headline": this.event.article.title,
				"image": this.event.images.length == 0 ?
					['https://app.helperbit.com/' + this.utilsService.getCountryOfISO(this.event.affectedcountries[0], 'flag')]
					:
					this.event.images.map(i => 'https://api.helperbit.com/api/v1/media/' + i),
				"author": {
					"@type": "Organization",
					"name": "Helperbit"
				},
				"publisher": {
					"@type": "Organization",
					"name": "Helperbit",
					"logo": {
						"@type": "ImageObject",
						"url": "https://app.helperbit.com/media/logo_round.png"
					}
				},
				"description": this.utilsService.getSString(this.event.article.body)
			};

			try {
				structuredData["datePublished"] = format(new Date(this.event.startdate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", {
					locale: (window as any).dateLocale
				});
				structuredData["dateModified"] = format(new Date(this.event.lastshakedate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", {
					locale: (window as any).dateLocale
				});
			} catch (err) {}

			this.metaService.setTag('structured', JSON.stringify(structuredData));


			this.center = latLng(this.event.epicenter.coordinates[1], this.event.epicenter.coordinates[0]);
			this.map.setZoom(7);

			markersOfEvent(this.event, this.map, { epicenter: true, cities: true, capital: true });
			countriesOfEvent(this.event, this.map, this.utilsService);
			geometryOfEvent(this.event, this.map);
			// this.map.fitBounds(geometryOfEvent(this.event, this.map).getBounds());

			this.eventService.getProjects(this.id).subscribe(projects => {
				this.projects = projects;
			});

			window.dispatchEvent(new Event('resize'));
			this.map.invalidateSize(true);
		});
	}

	ngOnInit() {
		this.username = getLocalStorage().getItem('username');
		this.usertype = getLocalStorage().getItem('usertype');

		this.id = this.route.snapshot.paramMap.get('id');
	}
}

