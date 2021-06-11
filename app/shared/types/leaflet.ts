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