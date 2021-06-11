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

import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { ModalsConfig } from '../../../shared/components/modal/oldModal/modal';
import { ResponseMessageConfig, buildErrorResponseMessage } from '../../../shared/components/response-messages/response-messages';
import { TranslateService } from '@ngx-translate/core';
import { DashboardService, UserPrivateModel } from '../../../models/dashboard';
import { Component, OnInit } from '@angular/core';
import { MapOptions, Marker, Map } from 'leaflet';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { openModalAddress } from './modals/address/address';

const countryRegion = require('../../../assets/data/country-region.json');

@Component({
	selector: 'me-geolocalization-component',
	templateUrl: 'geolocalization.html',
	styleUrls: ['../../../sass/main/custom/page.scss']
})
export class MeGeolocalizationComponent implements OnInit {
	pageHeader: PageHeaderConfig;
	modals: ModalsConfig;
	responseMessage: ResponseMessageConfig;
	user: UserPrivateModel;
	userCountries: string[];
	isGeolocalizationEdit: boolean;
	leafletOptions: { options: MapOptions; markers: Marker[] };

	constructor(
		private translate: TranslateService, 
		private dashboardService: DashboardService,
		private modalService: NgbModal
	) {
		this.pageHeader = {
			description: {
				title: translate.instant('geolocalization'),
				subTitle: translate.instant('Edit your account')
			}
		};

		this.modals = {
			geolocalization: {
				id: 'modalGeolocalization',
				modalClass: 'modal-lg',
				hideCloseButton: true,
				title: translate.instant('Geolocalization')
			},
		};
		this.user = null;
		this.userCountries = [];
		this.leafletOptions = null;
	}

	initUser() {
		this.responseMessage = null;

		this.dashboardService.getModel().subscribe((user: UserPrivateModel) => {
			this.user = user;
			this.isGeolocalizationEdit = this.user.hasAddress();
			this.leafletOptions = this.user.createLeafletOptions();
			this.userCountries = this.user.getCountriesList(this.translate, countryRegion);
		}, (res) => {
			this.responseMessage = buildErrorResponseMessage(res.error);
		});
	}

	isAddressSet(): boolean {
		return this.user && this.user.hasAddress();
	}

	isMarkerSet(): boolean {
		return this.user && this.user.hasLocation();
	}


	newGeolocalization() {
		openModalAddress(this.modalService, this.modals.geolocalization).result.then(
			(v) => {
				this.initUser();
				this.dashboardService.emitNotificationUpdate('geolocalization');
			},
			() => {
				this.initUser();
				this.dashboardService.emitNotificationUpdate('geolocalization');
			});
	}

	editGeolocalization() {
		openModalAddress(this.modalService, {
			...this.modals.geolocalization,
			country: this.user.country,
			region: this.user.region,
			city: this.user.city,
			street: this.user.street,
			streetNumber: this.user.streetnr,
			zipCode: this.user.zipcode
		}).result.then(
			(v) => {
				this.initUser();
				this.dashboardService.emitNotificationUpdate('geolocalization');
			},
			() => {
				this.initUser();
				this.dashboardService.emitNotificationUpdate('geolocalization');
			});
	}


	onMapReady(map: Map) {
		window.dispatchEvent(new Event('resize'));
		map.invalidateSize(true);
	}

	ngOnInit() {
		this.initUser();
	}
}
