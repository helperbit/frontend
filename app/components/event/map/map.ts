import { UtilsService } from '../../../services/utils';
import { EventService } from '../../../models/event';
import AppSettings from '../../../app.settings';
import { Component, OnInit } from '@angular/core';
import { SeourlPipe } from 'app/shared/filters/seourl';
import { MagnitudePipe } from 'app/shared/filters/magnitude';
import { Map, MapOptions, latLngBounds, marker, Marker, divIcon, latLng, geoJSON, Layer } from 'leaflet';
import * as L from 'leaflet';
import 'leaflet.heat/dist/leaflet-heat';
import { quadToHeatPoints, quadToHeatLayer, quadToGeoJSONLayer } from '../event.utils';

@Component({
	selector: 'event-map-component',
	templateUrl: 'map.html',
	styleUrls: ['map.scss']
})
export class EventMapComponent implements OnInit {
	map: Map;
	options: MapOptions;
	baseLayers: any;
	markers: {
		id: string;
		marker: Marker;
		magnitude: number;
		date: number;
	}[];
	enabledMarkers: Marker[];
	heatmapLayer: Layer;
	geojsonLayer: Layer;

	events: any[];
	mintime: number;
	maxtime: number;
	timeslice: number[];
	magnitudeslice: number[];

	constructor(
		private utilsService: UtilsService,
		private eventService: EventService,
		private seourlPipe: SeourlPipe,
		private magnitudePipe: MagnitudePipe
	) {
		this.mintime = new Date(2015, 1, 1).getTime() / 1000000;
		this.maxtime = new Date().getTime() / 1000000;
		this.timeslice = [this.maxtime - 12000, this.maxtime];
		this.magnitudeslice = [5, 10];

		this.enabledMarkers = [];
		this.markers = [];
		this.events = [];
		this.options = {
			center: latLng(39, 9),
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
	}

	onMapReady(map: Map) {
		this.map = map;
		window.dispatchEvent(new Event('resize'));
		this.map.invalidateSize(true);
	}

	formatTimestamp(timestamp) {
		if (typeof (timestamp) == 'object')
			return [new Date(timestamp[0] * 1000000).toDateString(), new Date(timestamp[1] * 1000000).toDateString()];
		else
			return new Date(timestamp * 1000000).toDateString();
	}

	formatMagnitude(magnitude) {
		if (typeof (magnitude) == 'object')
			return [magnitude[0], magnitude[1]]; // + ' Richter'
		else
			return magnitude; // + ' Richter';
	}

	updateMarkers(w?: 'mag' | 'time', event?) {
		if (w == 'mag')
			this.magnitudeslice = event;
		else if (w == 'time')
			this.timeslice = event;

		this.enabledMarkers = [];
		for (let i = 0; i < this.markers.length; i++) {
			const item = this.markers[i];

			if (item.date > this.timeslice[1] || item.date < this.timeslice[0] ||
				item.magnitude < this.magnitudeslice[0] ||
				item.magnitude > this.magnitudeslice[1]) {
			} else {
				this.enabledMarkers.push(item.marker);
			}
		}
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

	ngOnInit() {
		this.eventService.getAll().subscribe(events => {
			this.events = events;

			this.events.forEach((item) => {
				const m = marker(
					latLng(item.epicenter.coordinates[1], item.epicenter.coordinates[0]),
					{
						icon: divIcon({
							iconSize: [8, 8],
							popupAnchor: [0, 0],
							className: 'leaflet-usermarker',
							html: '<i class="pulse"></i>'
						})
					}
				);

				m.bindPopup('<a href="' + this.seourlPipe.transform(item, 'event') + '">' +
					this.utilsService.getCountryOfISO(item.affectedcountries[0]) + '</a><br>' +
					new Date(item.startdate).toLocaleDateString() + '<br>' +
					this.magnitudePipe.transform(item.maxmagnitude, item.type));

				this.markers.push({
					id: item._id,
					marker: m,
					date: Math.round(new Date(item.startdate).getTime() / 1000000),
					magnitude: item.maxmagnitude
				});
			});
			this.updateMarkers();
		});

		this.eventService.getUserGeoquads().subscribe(data => {
			this.heatmapLayer = quadToHeatLayer(data);
			this.map.addLayer(this.heatmapLayer);

			this.geojsonLayer = quadToGeoJSONLayer(data);
		});
	}
}
