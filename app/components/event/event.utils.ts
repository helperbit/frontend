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

import { Map, MapOptions, latLngBounds, marker, Marker, Layer, divIcon, latLng, LatLng, geoJSON, icon } from 'leaflet';
import { Event } from 'app/models/event';
import { UtilsService } from 'app/services/utils';
import * as L from 'leaflet';
import 'leaflet.heat/dist/leaflet-heat';


export function quadToHeatPoints(geoquads) {
	const points = [];
	for (let i = 0; i < geoquads.features.length; i++) {
		for (let j = 0; j < geoquads.features[i].properties.idlist.length; j++) {
			points.push(
				[
					geoquads.features[i].geometry.coordinates[0][0][1] + Math.random() * 0.04,
					geoquads.features[i].geometry.coordinates[0][0][0] + Math.random() * 0.04
				]);
		}
	}
	return points;
}

export function quadToGeoJSONLayer(geoquads, onEachFeature?): Layer {
	const dummy = (e) => {};
	
	return geoJSON(geoquads, {
		style: (feature) => {
			return {
				fillColor: "green",
				weight: 1.0,
				opacity: 0.7,
				color: 'white',
				dashArray: '3',
				fillOpacity: feature.properties.idlist.length / geoquads.max / 2.0
			};
		},
		onEachFeature: onEachFeature || dummy
	});
}

export function quadToHeatLayer(geoquads): Layer {
	const points = quadToHeatPoints(geoquads);

	return (L as any).heatLayer(points, {
		minOpacity: 1.0,
		radius: 3,
		blur: 2,
		//max: data.max,
		gradient: { 0.7: 'violet', 0.8: 'red', 1: 'yellow' },
		"showOnSelector": false
	});
}

export function geometryOfEvent(event: Event, map: Map) {
	const geometry = event.shakemaps.length !== 0 ? (
		{ 
			"type": "FeatureCollection", 
			"features": event.shakemaps.filter(sm => sm.geometry.coordinates.length > 0)
		}
	) : event.geometry;

	const gj = geoJSON(geometry as any, {
		style: (f) => {
			return {
				fillOpacity: 0.4,
				fillColor: "#feb737",
				weight: 0,
				opacity: 0.8,
				color: "#ddd",
				dashArray: '8'
			};
		}
	});
	map.addLayer(gj);
	return gj;
}

export function countriesOfEvent(event: Event, map: Map, utilsService: UtilsService) {
	event.affectedcountries.forEach(co => {
		utilsService.getSingleCountryGeoJSON(co).subscribe((data) => {
			map.addLayer(geoJSON(data, {
				style: (feature) => {
					return {
						weight: 1.5,
						opacity: 0.8,
						color: '#feb737',
						dashArray: '0',
						fillColor: '#d01f2f',
						fillOpacity: 0
					};
				}
			}));
		});
	});
}

export function markersOfEvent(event: Event, map: Map, w: { epicenter?: boolean; capital?: boolean; cities?: boolean; quakes?: boolean }) {
	const l = [];


	if (w.quakes && event.type == 'earthquake') {
		for (let i = 0; i < event.earthquakes.length; i++) {
			const item = event.earthquakes[i];
			map.addLayer(marker(latLng(item.epicenter.coordinates[1], item.epicenter.coordinates[0]), {
				icon: divIcon({
					iconSize: [8, 8],
					popupAnchor: [0, 0],
					className: 'leaflet-usermarker',
					html: '<i class="pulse"></i>'
				})
			}).bindPopup('Earthquake: ' + item.magnitude + ' richter'));
		}
	}

	if ((w.quakes && event.type != 'earthquake') || w.epicenter) {
		l.push(marker(
			latLng(event.epicenter.coordinates[1], event.epicenter.coordinates[0]),
			{
				icon: divIcon({
					iconSize: [8, 8],
					popupAnchor: [0, 0],
					className: 'leaflet-usermarker',
					html: '<i class="pulse"></i>'
				})
			}
		))
	}

	if (w.capital && event.capital.position.coordinates.length > 1) {
		if (!('position' in event.capital) || event.capital.position.coordinates.length < 2) {
		} else {
			l.push(marker(
				latLng(event.capital.position.coordinates[1], event.capital.position.coordinates[0]),
				{
					icon: icon({
						iconUrl: 'media/marker/city_marker.png',
						iconSize: [10, 10],
						iconAnchor: [5, 5],
						popupAnchor: [0, 0]
					})
				}
			).bindPopup(event.capital.name));
		}
	}

	if (w.cities) {
		for (let j = 0; j < event.nearcities.length; j++) {
			if (!('position' in event.nearcities[j]) || event.nearcities[j].position.coordinates.length < 2)
				continue;

			l.push(marker(
				latLng(event.nearcities[j].position.coordinates[1], event.nearcities[j].position.coordinates[0]),
				{
					icon: icon({
						iconUrl: 'media/marker/city_marker.png',
						iconSize: [24, 29],
						iconAnchor: [0, 0],
						popupAnchor: [12, 0]
					})
				}
			).bindPopup(event.nearcities[j].name));
		}
	}

	return l.forEach(l => map.addLayer(l));
}