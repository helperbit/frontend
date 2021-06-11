import { ResponseMessageConfig } from '../response-messages/response-messages';
import { UtilsService } from '../../../services/utils';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Map, MapOptions, latLngBounds, latLng, geoJSON, Layer, tileLayer } from 'leaflet';
import AppSettings from '../../../app.settings';
import { GeometryFeatureCollection } from 'app/models/common';

@Component({
	selector: 'countries-map',
	templateUrl: 'countries-map.html',
	styleUrls: ['countries-map.scss']
})
export class CountriesMapComponent implements OnInit, OnChanges {
	@Input() countries: string[] | string;
	@Input() width: string;
	@Input() height: string;
	@Input() customOptions: MapOptions;

	map: Map;
	options: MapOptions;
	responseMessage: ResponseMessageConfig;
	layers: Layer[];
	geoJsonData: GeometryFeatureCollection;

	constructor(private utilsService: UtilsService) {
		this.layers = [];
		this.options = {
			center: latLng(0, 0),
			// layers: [AppSettings.tileLayers.empty()],
			maxBounds: latLngBounds(latLng(-90, -180), latLng(90, 180)),
			keyboard: false,
			dragging: true,
			zoomControl: false,
			doubleClickZoom: true,
			tap: false,
			attributionControl: false,
			scrollWheelZoom: true,
			maxZoom: 4,
			minZoom: 0,
			zoom: 0
		};
	}

	onMapReady(map: Map) {
		this.map = map;
		window.dispatchEvent(new Event('resize'));
		map.invalidateSize(true);
	}

	initLayers() {
		this.layers = [geoJSON(this.geoJsonData, {
			style: feature => {
				if (this.countries && (this.countries == 'WRL' || this.countries.indexOf(feature.properties.code) != -1))
					return {
						weight: 1,
						opacity: 0.9,
						color: '#dd921d',
						dashArray: '0',
						fillColor: '#d01f2f'
					}
				else 
					return {
						fillColor: '#ffdca9',
						weight: 0.5,
						opacity: 0.5,
						color: '#dd921d',
						dashArray: '0',
						fillOpacity: 1.0
					}
			}
		})];
	}

	ngOnChanges(changes: SimpleChanges) {
		if(changes.customOptions && changes.customOptions.currentValue) {
			for(const key in this.customOptions) {
				if(this.options.hasOwnProperty(key))
					this.options[key] = this.customOptions[key];
			}
			
			this.options = { ...this.options };
		}

		if (!changes.countries || !changes.countries.currentValue)
			return;

		this.countries = changes.countries.currentValue;
		if (!this.geoJsonData || !this.countries || this.countries.length == 0) return;

		if (this.map) {
			this.initLayers();
			this.map.invalidateSize();
			this.map.setView(this.map.getCenter(), this.map.getZoom());
		}
	}

	ngOnInit() {
		this.utilsService.getCountriesGeoJSON().subscribe(data => {
			this.geoJsonData = data;
			this.initLayers();
		});
	}
}