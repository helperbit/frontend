import { ObjectId, Point, Language, Gender, Inhabitants, Operators, unwrap, UserProfileFields, ISODate } from "./common";
import { User } from "./user";
import { NotificationService } from "./notifications";
import { Project } from "./project";
import { LeafletConfig } from "app/shared/types/leaflet";
import { TranslateService } from '@ngx-translate/core';
import AppSettings from "../app.settings";
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MapOptions, Marker, marker, icon, latLng } from 'leaflet';
import { map, tap } from 'rxjs/operators';

export type UserMedia = { name: string; mid: ObjectId }

export interface AdminList {
	admins: string[];
	allowedadmins: string[];
	adminsusers: {
		username: string;
		email: string;
		trustlevel: number;
	}[];
}

export interface UserVerification {
	provider: string;
	level: number;
	medias: UserMedia[];
	info: any;
	submissiondate: ISODate;
	responsedate: ISODate;
	state: 'submission' | 'pending' | 'inprogress' | 'accepted' | 'rejected';
	note: string;
	rejectreason?: string;
}

export interface UserReferred {
	verified: boolean;
	regdate: ISODate;
}

export interface UserAmbassador {
	refby: string;
	referred: UserReferred[];
	count: number;
}

export class UserPrivate extends User {
	location: Point;
	region: string;
	street: string;
	streetnr: string;
	city: string;
	zipcode: string;
	publicfields: string[];
	email: string;
	language: Language;
	gender: Gender;
	mobile: string;
	telephone: string;
	inhabitants: Inhabitants;
	mayor: string;
	mandateperiod: any;
	referent: {
		firstname: string;
		lastname: string;
		idnumber: string;
		email: string;
	};
	operators: Operators;
	premium: {
		enabled: boolean;
		start: ISODate;
		expiration: ISODate;
	};
	admins: string[];
	adminof: string[];
}

export interface UserVerify {
	mandatoryfields: UserProfileFields[];
	trustlevel: number;
	locked: boolean;
	verification: UserVerification[];
	available: string[];
	fields?: string[];
}

export interface UserProjectList {
	closedprojects: Project[];
	projects: Project[];
}

@Injectable()
export class DashboardService {
	onProfileUpdate: EventEmitter<void> = new EventEmitter;

	constructor(
		private http: HttpClient,
		private notificationService: NotificationService
	) { }

	/** Returns the UserPrivate of the logged user */
	get(ignoreLoadingBar: boolean = false): Observable<UserPrivate> {
		return this.http.get<UserPrivate>(AppSettings.apiUrl + '/me',
			{ headers: { ignoreLoadingBar: String(ignoreLoadingBar) } });
	}

	getModel(): Observable<UserPrivateModel> {
		return this.http.get<UserPrivateModel>(AppSettings.apiUrl + '/me')
			.pipe(map(i => new UserPrivateModel(i, this)));
	}


	getEvents(): Observable<Event[]> {
		return this.http.get<Event[]>(AppSettings.apiUrl + '/me/events')
			.pipe(unwrap('events'));
	}

	getProjects(ignoreLoadingBar: boolean = false): Observable<UserProjectList> {
		return this.http.get<UserProjectList>(AppSettings.apiUrl + '/me/projects',
			{ headers: { ignoreLoadingBar: String(ignoreLoadingBar) } });
	}


	/** Edit the profile */
	edit(editData: any, ignoreLoadingBar: boolean = false): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/me', editData)
			.pipe(tap(() => this.onProfileUpdate.emit()));
	}

	emitNotificationUpdate(from: string): void {
		return this.notificationService.onUpdate.emit(from);
	}

	updateAvatar(file: File): Observable<void> {
		const formData: FormData = new FormData();
		formData.append('file', file);
		return this.http.post<void>(AppSettings.apiUrl + '/me/media/avatar', formData);
	}

	deleteAvatar(): Observable<void> {
		return this.http.delete<void>(AppSettings.apiUrl + '/me/media/avatar');
	}


	updateCoverflow(file: File): Observable<void> {
		const formData: FormData = new FormData();
		formData.append('file', file);
		return this.http.post<void>(AppSettings.apiUrl + '/me/media/photo', formData);
	}

	deleteCoverflow(): Observable<void> {
		return this.http.delete<void>(AppSettings.apiUrl + '/me/media/photo');
	}

	/** Gets the list of admin */
	getAdminList(): Observable<AdminList> {
		return this.http.get<AdminList>(AppSettings.apiUrl + '/me/admin');
	}

	/** Add an admin */
	addAdmin(email: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/me/admin/add', { email: email });
	}

	/** Remove an admin */
	removeAdmin(email: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/me/admin/remove', { email: email });
	}

	getAmbassador(): Observable<UserAmbassador> {
		return this.http.get<UserAmbassador>(AppSettings.apiUrl + '/me/ambassador');
	}

	getVerify(ignoreLoadingBar: boolean = false): Observable<UserVerify> {
		return this.http.get<UserVerify>(AppSettings.apiUrl + '/me/verify',
			{ headers: { ignoreLoadingBar: String(ignoreLoadingBar) } });
	}

	removeVerification(provider: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/me/verify/' + provider + '/remove', {});
	}

	doVerificationMediaStep(provider: string, phase: number, file: File, name: string): Observable<void> {
		const formData: FormData = new FormData();
		formData.append('file', file);
		formData.append('name', name);

		return this.http.post<void>(AppSettings.apiUrl + '/me/verify/' + provider + '/step/' + phase, formData)
			.pipe(tap(() => this.onProfileUpdate.emit()));
	}

	doVerificationStep(provider: string, phase: number, stepData: any): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/me/verify/' + provider + '/step/' + phase, stepData)
			.pipe(tap(() => this.onProfileUpdate.emit()));
	}

	/** Returns true on then if the npo is complete, false otherwise, never fails */
	getNPOStatus(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.http.get<boolean>(AppSettings.apiUrl + '/me/npostatus').subscribe(_ => resolve(true), _ => resolve(false));
		});
	}
}



export class UserPrivateModel extends UserPrivate {
	dashboardService: DashboardService;

	constructor(data: User, dashboardService: DashboardService) {
		super();
		this.dashboardService = dashboardService;

		for (const key in data) {
			Object.defineProperty(this, key, {
				get: () => { return data[key]; },
				set: (value: any) => {
					if (data[key] !== value) {
						data[key] = value;
					}
				},
			});
		}
	}

	hasAddress(): boolean {
		return this.country != null
			|| this.region != null
			|| this.city != null
			|| this.street != null
			|| this.streetnr != null
			|| this.zipcode != null;
	}

	hasLocation(): boolean {
		return this.location.coordinates.length > 1
			&& this.location.coordinates[0] != null
			&& this.location.coordinates[1] != null;
	}

	createLeafletOptions(draggable: boolean = false): { options: MapOptions; markers: Marker[] } {
		if (!this.hasLocation())
			return null;

		const latitude = this.location.coordinates[1];
		const longitude = this.location.coordinates[0];

		const conf = {
			markers: [
				marker(
					latLng(latitude, longitude),
					{
						icon: icon({
							iconUrl: '/media/leaflet/marker-icon.png',
							shadowUrl: '/media/leaflet/marker-shadow.png',
							iconRetinaUrl: '/media/leaflet/marker-icon-2x.png',
							iconSize: [25, 41],
							iconAnchor: [12, 41],
							popupAnchor: [1, -34],
							tooltipAnchor: [16, -28],
							shadowSize: [41, 41]
						}),
						draggable: draggable
					}
				)
			],
			options: {
				center: latLng(latitude, longitude),
				zoom: 12,
				// dragging: false,
				layers: [AppSettings.tileLayers.openStreetMap()],
			}
		};

		return conf;
	}

	createLeafletConfig2(draggable: boolean = false): LeafletConfig {
		if (!this.hasLocation())
			return null;

		const latitude = this.location.coordinates[1];
		const longitude = this.location.coordinates[0];

		const leaflet = {
			center: { lat: latitude, lng: longitude, zoom: 12 },
			position: { lat: latitude, lng: longitude },
			markers: {
				mainMarker: {
					lat: latitude,
					lng: longitude,
					focus: true,
					draggable: false,
					icon: {
						iconUrl: '/media/leaflet/marker-icon.png',
						shadowUrl: '/media/leaflet/marker-shadow.png',
						iconRetinaUrl: '/media/leaflet/marker-icon-2x.png',
						iconSize: [25, 41],
						iconAnchor: [12, 41],
						popupAnchor: [1, -34],
						tooltipAnchor: [16, -28],
						shadowSize: [41, 41]
					}
				}
			},
			events: { markers: { enable: [] } },
			initialize: true
		};

		if (draggable) {
			leaflet.events = { markers: { enable: ['dragend'] } };
			leaflet.markers.mainMarker.draggable = true;
		}

		return leaflet;
	}

	getCountriesList(translate: TranslateService, countryRegion): string[] {
		if (this.usertype == 'singleuser')
			return [];

		const arr = [];
		this.countries.forEach(key => {
			if (countryRegion[key])
				arr.push(translate.instant(countryRegion[key].name));
			else if (key == 'WRL')
				arr.push(translate.instant('World'));
		});
		return arr;
	}
}