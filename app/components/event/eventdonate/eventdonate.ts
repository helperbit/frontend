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

import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { openProposeNPOModal } from '../../../shared/components/proposednpo-insert/proposednpo-insert';
import { UtilsService } from '../../../services/utils';
import { EventService } from '../../../models/event';
import { ArticleService } from '../../../services/article';
import { CurrencyService } from '../../../services/currency';
import Distribution from '../../../lib/distribution';
import AppSettings from '../../../app.settings';
import { ModalsConfig } from '../../../shared/components/modal/oldModal/modal';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { MoneyPipe } from '../../../shared/filters/money';
import { countriesOfEvent, markersOfEvent, quadToGeoJSONLayer, quadToHeatLayer } from '../event.utils';
import { Map, MapOptions, marker, Marker, Icon, latLng, LatLng, Layer, geoJSON, icon } from 'leaflet';
import { getMediaUrl, getLocalStorage } from 'app/shared/helpers/utils';

@Component({
	selector: 'event-donate-component',
	templateUrl: 'eventdonate.html',
	styleUrls: ['eventdonate.scss']
})
export class EventDonateComponent implements OnInit {
	id: string;

	map: Map;
	options: MapOptions;
	baseLayers: any;
	center: LatLng;
	heatmapLayer: Layer;
	geojsonLayer: Layer;
	currentShakeMap: Layer;
	markers: Marker[];

	modals: ModalsConfig;
	username: string;
	usertype: string;
	userTypes: any[];
	shake: {
		level: number;
		labels: string[];
	};
	donations: any[];
	distribution: any;
	distributionMap: any;
	distributionFormatted: object;
	donation: {
		manualamount: boolean;
		anonaddress: string;
		fee: number;
		error: any;
		amount: number;
		step: number;
		wallet: { object: any; mnemonic: string };
		txhex: string;
		txid: string;
		users: object;
		trustlevel: number;
		value: number;
		event: string;
	};
	listConfig: {
		type: {
			value: string;
			object: any;
		};
		columnsType: string;
		hideHeader: boolean;
		limit: number;
		refresh: number;
	};
	//tiles: JSON.parse ( JSON.stringify (config.tileLayers.satellite))
	markerIcons: { [key: string]: Icon };
	event: any;
	affectedusers: any;
	totalusers: number;

	constructor(
		private route: ActivatedRoute,
		private eventService: EventService,
		private utilsService: UtilsService,
		private articleService: ArticleService,
		private translate: TranslateService,
		private currencyService: CurrencyService,
		private moneyPipe: MoneyPipe,
		private modalService: NgbModal
	) {
		this.modals = {
			noUsers: {
				id: 'modalNoUsers',
				title: translate.instant('No users')
			},
			notSingle: {
				id: 'modalNotSingle',
				title: translate.instant('Not allowed')
			},
			notLogged: {
				id: 'modalNotLogged',
				title: translate.instant('Not logged')
			},
			noWallet: {
				id: 'modalNowallet',
				title: translate.instant('No wallet')
			}
		};
		this.markers = [];
		this.username = getLocalStorage().getItem('username');
		this.usertype = getLocalStorage().getItem('usertype');
		this.userTypes = AppSettings.userTypes;
		this.shake = {
			level: 0,
			labels: [this.translate.instant('Light'), '', '', this.translate.instant('Heavy')]
		};
		this.baseLayers = {
			'ESRI Terrain': AppSettings.tileLayers.esriTerrain(),
			'OpenStreetMap': AppSettings.tileLayers.openStreetMap()
		};
		this.donations = [];
		this.distribution = null;
		this.distributionMap = null;
		this.distributionFormatted = {};

		this.donation = {
			manualamount: false,
			anonaddress: '',
			fee: 0.0,
			error: null,
			amount: 0,
			step: 0,
			wallet: { object: null, mnemonic: '' },
			txhex: '',
			txid: '',
			users: {},
			trustlevel: 50,
			value: 0,
			event: null
		};
		this.listConfig = {
			type: {
				value: 'event',
				object: null
			},
			columnsType: 'countrySmall',
			hideHeader: true,
			limit: 10,
			refresh: 60
		};
		//this.tiles = JSON.parse(JSON.stringify(AppSettings.tileLayers.satellite));

		this.markerIcons = {
			singleuser: icon({ iconUrl: 'media/marker/singleuser.png', iconSize: [10, 10], iconAnchor: [5, 5], popupAnchor: [0, 0] }),
			npo: icon({ iconUrl: 'media/marker/npo.png', iconSize: [10, 10], iconAnchor: [5, 5], popupAnchor: [0, 0] }),
			company: icon({ iconUrl: 'media/marker/company.png', iconSize: [10, 10], iconAnchor: [5, 5], popupAnchor: [0, 0] }),
			school: icon({ iconUrl: 'media/marker/school.png', iconSize: [10, 10], iconAnchor: [5, 5], popupAnchor: [0, 0] }),
			munic: icon({ iconUrl: 'media/marker/munic.png', iconSize: [10, 10], iconAnchor: [5, 5], popupAnchor: [0, 0] }),
			park: icon({ iconUrl: 'media/marker/park.png', iconSize: [10, 10], iconAnchor: [5, 5], popupAnchor: [0, 0] }),
			cultural: icon({ iconUrl: 'media/marker/cultural.png', iconSize: [10, 10], iconAnchor: [5, 5], popupAnchor: [0, 0] }),
			hospital: icon({ iconUrl: 'media/marker/hospital.png', iconSize: [10, 10], iconAnchor: [5, 5], popupAnchor: [0, 0] }),
			civilprotection: icon({ iconUrl: 'media/marker/civilprotection.png', iconSize: [10, 10], iconAnchor: [5, 5], popupAnchor: [0, 0] }),
			grayout: icon({ iconUrl: 'media/marker/grayout.png', iconSize: [10, 10], iconAnchor: [5, 5], popupAnchor: [0, 0] }),
			invisible: icon({ iconUrl: 'media/marker/grayout.png', iconSize: [0, 0], iconAnchor: [5, 5], popupAnchor: [0, 0] }),
			projects: icon({ iconUrl: 'media/marker/projects.png', iconSize: [10, 10], iconAnchor: [5, 5], popupAnchor: [0, 0] }),
		};
	}



	onMapReady(map: Map) {
		this.map = map;
		window.dispatchEvent(new Event('resize'));
		this.map.invalidateSize(true);
		this.updateEvent();
	}

	/* Called before donate modal; will display donate modal if it return true */
	donateClickCheck() {
		/* Check selected users */
		if (this.distribution.nUsers() === 0) {
			$('#modalNoUsers').modal('show');
			return false;
		}

		return true;
	}

	propose() {
		openProposeNPOModal(this.modalService, {
			country: this.event.affectedcountries[0],
			message: this.translate.instant('There are not organization that are working in the area yet, please help us, suggest an organization and we will contact them.')
		});
	}

	updateDistribute(keep) {
		this.distribution.update(keep);
	}

	updateMarkersIcon(utype) {
		if (utype !== undefined && utype !== null && utype !== 'helperbit' && utype !== 'projects') {
			this.affectedusers[utype].forEach(user => this.updateMarkerIcon(utype, user.username));
			return;
		}

		AppSettings.userTypes.forEach(utype => {
			if (utype.code === 'helperbit' || utype.code === 'projects') return;
			this.updateMarkersIcon(utype.code);
		});
	}

	getMarkerByUsername(username: string): Marker {
		let marker: Marker = null;
		this.map.eachLayer(l => {
			if (l instanceof Marker && 'username' in l.options && (l.options as any).username == username) {
				marker = l;
			}
		});
		return marker;
	}

	updateMarkerIcon(utype: string, username: string) {
		const m: Marker = this.getMarkerByUsername(username);

		if (utype == 'singleuser') {
			m.setIcon(this.markerIcons['invisible']);
		} else if (this.distributionMap[utype].usersMap[username].enabled && this.distributionMap[utype].enabled) {
			m.setIcon(this.markerIcons[utype]);
		} else {
			m.setIcon(this.markerIcons['grayout']);
		}
	}

	updateUserCheck(utype: string, username: string, checked: boolean) {
		this.distribution.updateUserCheck(utype, username, checked);
		if (utype !== 'projects')
			this.updateMarkerIcon(utype, username);
		this.distribution.update();
	}

	updateCheck(utype, checked) {
		this.distribution.updateCheck(utype, checked);
		this.updateMarkersIcon(utype);
		this.distribution.update();
	}

	update(utype, init) {
		this.distribution.update();
		this.updateMarkersIcon(utype);
	}

	/* Shakemaps selector switch */
	updateShakemap(init?: boolean) {
		let i;

		if (init === undefined)
			init = false;

		if (this.shake.level === null)
			return;

		if (this.currentShakeMap) {
			this.map.removeLayer(this.currentShakeMap);
		}

		/* Create a list of enabled shakemaps */
		const sm = { "type": "FeatureCollection", "features": [] };
		const smDistribution = { "type": "FeatureCollection", "features": [] };

		for (i = 0; i < this.event.shakemaps.length; i++) {
			if (this.event.shakemaps[i].geometry.coordinates.length == 0)
				continue;

			if (this.event.shakemaps[i].properties.magnitude >= this.shake.level) 
				smDistribution.features.push(this.event.shakemaps[i]);
	
			sm.features.push(this.event.shakemaps[i]);
		}

		// sm.features = this.event.shakemaps.filter( shakemap => shakemap.properties.magnitude >= this.level);

		/* Create a list of markers */
		const points = { "type": "FeatureCollection", "features": [] };
		
		for (i = 0; i < this.markers.length; i++) {
			const m: any = this.markers[i];
			if (m.type != 'user' || m.usertype === 'singleuser') continue;

			points.features.push({
				"type": "Feature", "properties": { n: m.username, t: m.usertype },
				"geometry": { "type": "Point", "coordinates": [m.lng, m.lat] }
			});
		}

		this.currentShakeMap = geoJSON((sm as any), {
			style: (feature) => {
				const defstyle = {
					fillColor: "#d01f2f",
					weight: 0,
					opacity: 0.8,
					color: "#ddd",
					dashArray: '8',
					fillOpacity: 0.5
				};

				if (feature.properties.magnitude && feature.properties.magnitude < this.shake.level) {
					defstyle.fillOpacity = 0.4;
					defstyle.fillColor = "#feb737";
				}

				return defstyle;
			}
		});
		// this.map.fitBounds((this.currentShakeMap as GeoJSON).getBounds());
		this.map.addLayer(this.currentShakeMap);

		this.distribution.updateShakemap(smDistribution, points);
		this.update(null, null);
	}

	sliderFormatter(value) {
		return '' + value + '%';
	}

	updateAmount(value) {
		this.donation.amount = value;
		if (this.distribution) {
			this.distribution.updateAmount(value);
		}
	}

	updateEvent() {
		this.eventService.get(this.id).subscribe(event => {
			this.shake.labels = [this.translate.instant('Light'), '', '', this.translate.instant('Heavy')];

			//this.tiles.options.attribution += '<br>Event data derived from ' + res.data.datasource;
			this.event = event;
			this.listConfig = { ...this.listConfig, ...{ type: { object: this.event, value: 'event' } } };
			this.event.article = this.articleService.generateEventArticle(this.event);

			this.utilsService.setMeta(
				this.event.article.title,
				this.utilsService.getSString(this.event.article.body),
				this.event.images.length == 0 ? 
					'https://app.helperbit.com/' + this.utilsService.getCountryOfISO(this.event.affectedcountries[0], 'flag')
					:
					'https://api.helperbit.com/api/v1/media/' + this.event.images[0]
			);

			this.donation.users = {};
			this.donation.event = event._id;

			this.center = latLng(this.event.epicenter.coordinates[1], this.event.epicenter.coordinates[0]);
			this.map.setZoom(9);
			markersOfEvent(this.event, this.map, { capital: true, cities: true, quakes: true });


			if (this.event.shakemaps.length == 0) {
				this.shake.level = null;
				const gj = geoJSON(this.event.geometry, {
					style: (feature) => {
						const defstyle = {
							fillColor: "#d01f2f",
							weight: 0,
							opacity: 0.8,
							color: "#ddd",
							dashArray: '8',
							fillOpacity: 0.5
						};

						return defstyle;
					}
				});
				this.map.addLayer(gj);
				// this.map.fitBounds(gj.getBounds());
			}

			this.eventService.getAffectedUsers(this.id).subscribe(affectedUsers => {
				this.distribution = new Distribution(affectedUsers, this.donation.amount, this.donation.trustlevel, AppSettings.userTypes, AppSettings.minDonation);
				this.distributionMap = this.distribution.distributionMap;
				this.affectedusers = affectedUsers;
				this.totalusers = 0;

				AppSettings.userTypes.forEach(itemtype => {
					if (itemtype.code === 'helperbit' || itemtype.code === 'projects')
						return;

					this.totalusers += this.affectedusers[itemtype.code].length;

					this.affectedusers[itemtype.code].forEach(item => {
						let icon = this.markerIcons[itemtype.code];
						let pos = null;

						if (itemtype.code == 'singleuser') {
							pos = latLng(this.event.earthquakes[0].epicenter.coordinates[1], this.event.earthquakes[0].epicenter.coordinates[0]);
							icon = this.markerIcons['invisible'];
						} else {
							pos = latLng(item.location.coordinates[1], item.location.coordinates[0]);
						}

						const m = marker(pos, {
							username: item.username,
							type: 'user',
							usertype: itemtype.code,
							received: item.received,
							trustlevel: item.trustlevel,
							icon: icon
						} as any);

						m.bindPopup('<img width="24px" src="' + (item.avatar ? getMediaUrl(item.avatar) : AppSettings.media.avatar.singleuser.notDeclared) + '"/>' +
							'<a target="_blank" routerLink="/user/' + item.username + '">' + item.username + ', ' + itemtype.name + '</a>');

						this.markers.push(m);
						this.map.addLayer(m);
					});
				});


				/* Show user heatmap */
				this.heatmapLayer = quadToHeatLayer(this.affectedusers.geoquads);
				this.map.addLayer(this.heatmapLayer);

				this.geojsonLayer = quadToGeoJSONLayer(this.affectedusers.geoquads, (feature, layer) => {
					layer.on({
						mousedown: () => {
							let message = 'List of Helperbit\'s single users present in the area, the address is downscaled to a 100km2 square to preserve privacy.<br><br>';
							layer.feature.properties.idlist.forEach(id => {
								message += '<a target="_blank" href="/user/' + id + '"><i class="fa fa-user"></i> ' + id + '</a><br>';
							});
							layer.bindPopup(message).openPopup();
						}
					});
				});


				if (this.event.shakemaps.length > 0) {
					// select max magnitude in magnitude slider
					this.event.shakemaps.forEach(sm => {
						if (sm.properties.magnitude >= this.shake.level) {
							this.shake.level = sm.properties.magnitude;
						}
					});
					this.updateShakemap(true);
				}
				this.updateMarkersIcon(null);
				// this.distributionFormatted = this.distribution.toFormatted();

				this.eventService.getDonations(this.id, { limit: 100 }).subscribe(data => {
					this.donations = data.list;
				});

				this.distribution.update();
			});

			countriesOfEvent(this.event, this.map, this.utilsService);
		}, res => {
			// if (res.error !== null && res.error.error == 'E2')
			// 	this.cfpLoadingBar.error('E2', this.id);
		});
	}


	onZoom($event) {
		const zoom = this.map.getZoom();
		if (zoom > 7) {
			if (this.map.hasLayer(this.heatmapLayer))
				this.map.removeLayer(this.heatmapLayer);
			if (!this.map.hasLayer(this.geojsonLayer))
				this.map.addLayer(this.geojsonLayer);
		} else if (zoom <= 7) {
			if (this.map.hasLayer(this.geojsonLayer))
				this.map.removeLayer(this.geojsonLayer);
			if (!this.map.hasLayer(this.heatmapLayer))
				this.map.addLayer(this.heatmapLayer);
		}
	}

	donate() {
		this.distributionFormatted = this.distribution.toFormatted();
		if (this.donateClickCheck()) {
			(window as any).HBDonateButton.init('event', this.id, '', 'mistralpay', this.donation.amount, true, this.distribution.toFormatted());
			(window as any).HBDonateButton.activate();
		}
	}

	ngOnInit() {
		this.id = this.route.snapshot.paramMap.get('id');

		if (!this.currencyService.isInit)
			this.currencyService.onPriceChange.subscribe(_ => {
				this.donation.amount = parseFloat(this.moneyPipe.transform(this.moneyPipe.transform(0.01, -1, false), 8, false, true));
				this.updateEvent();
			});
		else {
			this.donation.amount = parseFloat(this.moneyPipe.transform(this.moneyPipe.transform(0.01, -1, false), 8, false, true));
			this.updateEvent();
		}
	}
}