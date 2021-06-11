import { ObjectId, PaginationReply, Point, Geometry, GeometryFeature, PaginationQuery, GeometryFeatureCollection, unwrap, unwrapPaginated, ISODate } from "./common";
import { DonationService, Donation } from "./donation";
import { Project } from "./project";
import AppSettings from "../app.settings";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AffectedCity {
	name: string;
	position: Point;
}

export interface EventAffectedUser {
	location: Point;
	usertype: string;
	subtype: string;
	banned: boolean;
	trustlevel: number;
	avatar: string;
	received: number;
	receiveaddress: string;
	_id: ObjectId;
	username: string;
}

export interface EventAffectedProject {
	media: string[];
	target: number;
	owner: string;
	currency: string;
	received: number;
	pending: number;
	used: number;
	_id: ObjectId;
}


export interface EventAffectedUsers {
	geoquads: {
		count: number;
		min: number;
		max: number;
		features: {};
	};
	singleuser: EventAffectedUser[];
	npo: EventAffectedUser[];
	company: EventAffectedUser[];
	projects: EventAffectedProject[];

}

export interface Event {
	_id: ObjectId;
	images: string[];
	startdate: ISODate;
	type: 'earthquake' | 'wildfire';
	// type: EventTypes;
	affectedcountries: string[];
	lastshakedate: ISODate;
	epicenter: Point;
	geometry: Geometry;
	shakemaps: GeometryFeature[];
	maxmagnitude: number;

	news: {
		title: string;
		image: string;
	}[];

	article?: {
		title: string;
		body: string;
	};

	donations: number;
	donationsvolume: number;

	capital: AffectedCity;
	population: {
		affected: number;
		deaths: number;
	};
	nearcities: AffectedCity[];

	earthquakes: {
		epicenter: Point;
		magnitude: number;
	}[];
}

export type IEvent = Event;

export interface EventHome {
	closetome: (Event & { t: 'main' | 'close' })[];
	main: (Event & { t: 'main' | 'close' })[];
}

@Injectable()
export class EventService {
	constructor(
		private http: HttpClient,
		private donationService: DonationService) { }

	get(id: ObjectId): Observable<Event> {
		return this.http.get<Event>(AppSettings.apiUrl + '/event/' + id);
	}

	getUserGeoquads(): Observable<GeometryFeatureCollection & { max: number }> {
		return this.http.get<GeometryFeatureCollection & { max: number }>(AppSettings.apiUrl + '/users/geoquad');
	}

	getList(query: PaginationQuery): Observable<PaginationReply<Event>> {
		return this.http.post<PaginationReply<Event>>(AppSettings.apiUrl + '/events/list', query)
			.pipe(unwrapPaginated('events'));
	}

	getAll(): Observable<Event[]> {
		return this.http.get<Event[]>(AppSettings.apiUrl + '/events/all')
			.pipe(unwrap('events'));
	}

	getHomeList(): Observable<EventHome> {
		return this.http.get<EventHome>(AppSettings.apiUrl + '/events/home');
	}

	getAffectedUsers(id: string): Observable<EventAffectedUsers> {
		return this.http.get<EventAffectedUsers>(AppSettings.apiUrl + '/event/' + id + '/affectedusers');
	}

	getDonations(id: string, query: PaginationQuery = null): Observable<PaginationReply<Donation>> {
		return this.donationService.getEventDonations(id, query);
	}

	getProjects(id: string): Observable<Project[]> {
		return this.http.get<Project[]>(AppSettings.apiUrl + '/event/' + id + '/projects',
			{ headers: { ignoreLoadingBar: String(true) } })
			.pipe(unwrap('projects'));
	}
}