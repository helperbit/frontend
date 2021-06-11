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

import { EventService, Event } from '../../../models/event';
import AppSettings from '../../../app.settings';
import { LatLng, Marker, divIcon, marker, latLng, MapOptions } from 'leaflet';
import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import parseISO from 'date-fns/parseISO';
import getUnixTime from 'date-fns/getUnixTime';
// import { openProposeNPOModal } from '../proposednpo-insert/proposednpo-insert';
// import { ObjectId } from 'app/models/common';
// import Distribution from 'app/lib/distribution';


@Component({
	selector: 'event',
	templateUrl: 'event.html',
	styleUrls: ['event.scss']
})
export class EventComponent implements OnChanges {
	@Input() event: Event & { t: 'main' | 'close'; affectedusers: any[] };
	@Input() visualizeAs: 'map' | 'image';

	mapOptions: MapOptions;
	markers: Marker[];
	center: LatLng;

	constructor(
		// private modalService: NgbModal,
		private router: Router,
		// private eventService: EventService
	) {
		this.mapOptions = {
			center: latLng(0, 0),
			zoom: 2,
			layers: [AppSettings.tileLayers.twoColors()],
			maxZoom: 2,
			minZoom: 2,
			keyboard: false,
			dragging: false,
			zoomControl: false,
			attributionControl: false
		};
		this.markers = [];
	}

	public go() {
		this.router.navigateByUrl('/event/' + this.event._id);
	}

	// private quickDonate(event) {
	// 	this.hasReceivingCandidates(event._id).then((nUsers) => {
	// 		if (nUsers > 0) {
	// 			window.HBDonateButton.init('event', event._id, '', 'mistralpay', null, true);
	// 			window.HBDonateButton.activate();
	// 		}
	// 		else openProposeNPOModal(this.modalService, { message: 'There are no organizations that are working in the area yet, please help us, suggest an organization and we will contact them', country: event.affectedcountries[0] });
	// 	});
	// }

	public advancedDonate(event) {
		this.router.navigateByUrl('/event/' + event._id + '/donate');
		// this.hasReceivingCandidates(event._id).then((nUsers) => {
		// 	if (nUsers > 0)
		// 		this.router.navigateByUrl('/event/' + event._id + '/donate');
		// 	else openProposeNPOModal(this.modalService, { message: 'There are no organizations that are working in the area yet, please help us, suggest an organization and we will contact them', country: event.affectedcountries[0] });
		// });
	}


	/** Returns the number of users available for an event donation */
	// private hasReceivingCandidates(id: ObjectId): Promise<number> {
	// 	return new Promise((resolve, reject) => {
	// 		this.eventService.get(id).subscribe(event => {
	// 			this.eventService.getAffectedUsers(event._id).subscribe(affectedUsers => {
	// 				const dis = new Distribution(affectedUsers, 1, 100, AppSettings.userTypes, AppSettings.minDonation);
	// 				if (event.shakemaps.length > 0) {
	// 					const sm = { "type": "FeatureCollection", "features": [] };
	// 					let maxMagnitudeShakemap = null;
	// 					event.shakemaps.forEach((sm) => {
	// 						if (!maxMagnitudeShakemap || sm.properties.magnitude > maxMagnitudeShakemap.properties.magnitude)
	// 							maxMagnitudeShakemap = sm;
	// 					});
	// 					sm.features = [maxMagnitudeShakemap];
	// 					dis.updateShakemap(sm);
	// 					dis.update()
	// 				}
	// 				dis.toFormatted();
	// 				return resolve(dis.nUsers());
	// 			}, err => reject(err));
	// 		}, err => reject(err));
	// 	});
	// }


	ngOnChanges(changes) {
		if (!changes.event || !changes.event.currentValue)
			return;

		this.mapOptions.center = latLng(this.event.epicenter.coordinates[1], this.event.epicenter.coordinates[0]);
		this.markers.push(marker(
			latLng(this.event.epicenter.coordinates[1], this.event.epicenter.coordinates[0]),
			{
				icon: divIcon({
					iconSize: [8, 8],
					popupAnchor: [0, 0],
					className: 'leaflet-usermarker',
					html: '<i class="pulse"></i>'
				})
			}
		));
	}
}