
import { Component, OnInit } from '@angular/core';
import { Map, MapOptions, FeatureGroup, latLngBounds, latLng, geoJSON, Layer, LeafletEvent } from 'leaflet';
import { GeometryFeatureCollection } from '../../../models/common';
import { UtilsService } from '../../../services/utils';
import { StatsService, WorldStats } from '../../../models/stats';
import { ChartConfig } from '../../../shared/components/chart/chart';
import compareAsc from 'date-fns/compareAsc';
import AppSettings from '../../../app.settings';

const selectedStyle = { weight: 1, opacity: 0.6, color: '#e08c26', dashArray: '0', fillColor: '#d01f2f', fillOpacity: 1.0 };
const normalStyle = { fillColor: "#ffdca9", weight: 1, opacity: 0.6, color: '#e08c26', dashArray: '0', fillOpacity: 1.0 };
const normalStyle1 = { fillColor: '#fdc566', weight: 1, opacity: 0.6, color: '#e08c26', dashArray: '0', fillOpacity: 1.0 };
const normalStyle2 = { fillColor: '#feb836', weight: 1, opacity: 0.6, color: '#e08c26', dashArray: '0', fillOpacity: 1.0 };
const volcmp = (a, b) => { return b.volume - a.volume; };
const TIME_INTERVAL = 2678 * 3;

@Component({
	selector: 'world-stats-component',
	templateUrl: 'world.html',
	styleUrls: ['world.scss']
})
export class WorldStatsComponent implements OnInit {
	mintime: number;
	maxtime: number;
	timeslice: number[];
	oldtimeslice: number[];
	activeChart: 'donated' | 'received';

	map: Map;
	options: MapOptions;
	layers: Layer[];
	geoJsonData: GeometryFeatureCollection;

	stats: WorldStats;
	selectedCountry: string;
	selectedCountryName: string;
	selectedUpdated: boolean;
	chartConfig: ChartConfig;
	currentLayer: any;

	constructor(private utilsService: UtilsService, private statsService: StatsService) {
		this.mintime = Math.round(new Date('1 January 2015').getTime() / 1000000);
		this.maxtime = Math.round(new Date().getTime() / 1000000);
		this.timeslice = [this.maxtime - TIME_INTERVAL, this.maxtime];
		this.oldtimeslice = [this.maxtime - TIME_INTERVAL, this.maxtime];
		this.activeChart = 'donated';

		this.options = {
			center: latLng(0, 0),
			layers: [AppSettings.tileLayers.empty()],
			maxBounds: latLngBounds(latLng(-75, -180), latLng(85, 180)),
			keyboard: false,
			dragging: true,
			zoomControl: true,
			doubleClickZoom: false,
			tap: false,
			attributionControl: false,
			scrollWheelZoom: false,
			maxZoom: 4,
			minZoom: 2,
			zoom: 2
		};
		this.currentLayer = null;

		this.selectedCountry = 'WRL';
		this.selectedCountryName = 'World';
		this.selectedUpdated = false;


		this.chartConfig = {
			values: [], colors: [], labels: [], type: 'bar', options: {
				scales: {
					x: {
						display: false
					},
					y: {
						display: false,
						ticks: {
							beginAtZero: true
						}
					}
				},
				tooltips: {
					callbacks: {
						label: function (tooltipItem, data) { return tooltipItem.value + ' BTC' }
					}
				},
				layout: {
					padding: {
						left: 15,
						right: 0,
						top: 0,
						bottom: 0
					}
				}
			}
		};
	}

	onMapReady(map: Map) {
		this.map = map;
	}

	switchChart(chart) {
		this.activeChart = chart;
		this.updateChart();
	}

	formatTimestamp(timestamp) {
		const dateString = (timestamp) => {
			const d = new Date(timestamp * 1000000);
			return (d.getMonth() + 1) + ' ' + d.getFullYear();
		};

		if (typeof (timestamp) == 'object')
			return [dateString(timestamp[0]), '  ' + dateString(timestamp[1])];
		else
			return dateString(timestamp);
	}


	updateStats(val) {
		this.timeslice = val;

		if (this.timeslice == this.oldtimeslice)
			return;

		if (this.timeslice[0] != this.oldtimeslice[0]) {
			this.timeslice[1] = this.timeslice[0] + TIME_INTERVAL;

			if (this.timeslice[1] > this.maxtime) {
				this.timeslice[0] = this.maxtime - TIME_INTERVAL;
				this.timeslice[1] = this.maxtime;
			}
		} else if (this.timeslice[1] != this.oldtimeslice[1]) {
			this.timeslice[0] = this.timeslice[1] - TIME_INTERVAL;

			if (this.timeslice[0] < this.mintime) {
				this.timeslice[0] = this.mintime;
				this.timeslice[1] = this.mintime + TIME_INTERVAL;
			}
		}
		this.oldtimeslice = this.timeslice;

		this.updateChart();
	}


	initLayers() {
		const layer = geoJSON(this.geoJsonData, {
			style: feature => {
				if (feature.properties.code == this.selectedCountry)
					return selectedStyle;

				if (feature.properties.code in this.stats && (this.stats[feature.properties.code].received > 5.0 ||
					this.stats[feature.properties.code].donated > 0.4)) {
					return normalStyle2;
				} else if (feature.properties.code in this.stats && (this.stats[feature.properties.code].received > 0.0 ||
					this.stats[feature.properties.code].donated > 0.0)) {
					return normalStyle1;
				}
				return normalStyle;
			},
			onEachFeature: (feature, layer: FeatureGroup<Layer>) => {
				layer.on('click', () => {
					this.stats[this.selectedCountry].topfivedonated.sort(volcmp);
					this.stats[this.selectedCountry].topfivereceived.sort(volcmp);

					this.setCurrentLayerStyle();

					this.selectedCountry = feature.properties.code;
					this.selectedCountryName = this.utilsService.getCountryOfISO(feature.properties.code);

					layer.setStyle(selectedStyle);
					layer.bringToFront();
					this.currentLayer = layer;
					this.updateChart();

					this.selectedUpdated = true;
				});
			}
		});

		this.layers = [layer];
		this.switchChart('donated');
	}


	updateChart() {
		const donations = this.stats[this.selectedCountry].history.filter((obj: any) => {
			const toCheck = new Date(obj.start);
			const min = new Date(this.timeslice[0] * 1000000);
			const max = new Date(this.timeslice[1] * 1000000);

			return compareAsc(toCheck, min) >= 0 && compareAsc(toCheck, max) <= 1;
			// return toCheck.isSameOrAfter(min) && toCheck.isSameOrBefore(max);
		});

		const values = [];
		const labels = [];

		donations.forEach((obj: any) => {
			values.push(Math.floor(obj[this.activeChart] * 10000.0) / 10000.0);

			if (typeof obj.start == 'string')
				labels.push(new Date(obj.start).toDateString())
			else if (obj.start instanceof Date)
				labels.push(obj.start.toDateString());
		});

		this.chartConfig.values = values;
		this.chartConfig.labels = labels;
		this.chartConfig.colors = [this.activeChart == 'donated' ? '#fe3737' : '#feb737'];
	}

	private setCurrentLayerStyle(btf: boolean = false) {
		if (this.currentLayer !== null) {
			if (this.selectedCountry in this.stats && (this.stats[this.selectedCountry].received > 5.0 ||
				this.stats[this.selectedCountry].donated > 0.4)) {
				this.currentLayer.setStyle(normalStyle2);
			}
			else if (this.selectedCountry in this.stats && (this.stats[this.selectedCountry].received > 0.0 ||
				this.stats[this.selectedCountry].donated > 0.0)) {
				this.currentLayer.setStyle(normalStyle1);
			}
			else
				this.currentLayer.setStyle(normalStyle);

			if (btf)
				this.currentLayer.bringToFront();
		}
	}

	public onMapClick(event: LeafletEvent) {
		if (this.selectedUpdated) {
			this.selectedUpdated = false;
			return;
		}

		if (event !== null && event.target) {
			const layer = event.target;
		}

		this.setCurrentLayerStyle(true);

		this.currentLayer = null;
		this.selectedCountry = 'WRL';
		this.selectedCountryName = 'World';

		this.updateChart();
	}

	ngOnInit() {
		this.statsService.getWorld().subscribe(data => {
			this.stats = data;

			this.stats.WRL.topfivedonated.sort(volcmp);
			this.stats.WRL.topfivereceived.sort(volcmp);

			this.utilsService.getCountriesGeoJSON().subscribe(data => {
				this.geoJsonData = data;
				this.initLayers();
			});
		});
	}
}