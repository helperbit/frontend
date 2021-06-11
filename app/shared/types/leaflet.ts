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

// @deprecated This file is deprecated since we use new leaflet types

export interface LeafletMarkerIcon {
	iconUrl: string;
	shadowUrl?: string;
	iconRetinaUrl?: string;
	iconSize?: number[];
	iconAnchor?: number[];
	popupAnchor?: number[];
	tooltipAnchor?: number[];
	shadowSize?: number[];
}

export interface LeafletMarker {
	lat: number;
	lng: number;
	focus?: boolean;
	draggable?: boolean;
	icon?: LeafletMarkerIcon;
}

export interface LeafletConfig {
	center?: {
		lat: number;
		lng: number;
		zoom: number;
	};
	bounds?: {
		southWest: { lat: number; lng: number };
		northEast: { lat: number; lng: number };
	};
	position?: {
		lat: number;
		lng: number;
	};
	markers?: { [key: string]: LeafletMarker };
	events?: any;
}