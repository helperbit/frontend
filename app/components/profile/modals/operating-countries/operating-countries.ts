import { MapOptions } from "leaflet";
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'me-profile-operating-countries-component',
	templateUrl: 'operating-countries.html',
	styleUrls: ['operating-countries.scss']
})
export class MeProfileOperatingCountriesComponent {
	@Input() countries: string[];
	customOptions: MapOptions;

	constructor(public activeModal: NgbActiveModal) {
		this.customOptions = {
			// maxBounds: latLngBounds(latLng(-60, -180), latLng(85, 180)),
			minZoom: 2,
			zoom: 2,
			zoomControl: true
		};
	}
}
