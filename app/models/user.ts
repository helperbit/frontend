import { TString, Badge, ObjectId, PaginationQuery, PaginationReply, ChartDataRaw, transformChartData, ChartData, Tags, UserType, unwrap, unwrapPaginated, ISODate } from "./common";
import { DonationService, Donation } from "./donation";
import { UserProjectList } from "./dashboard";
import { TransactionPublic } from "./wallet";
import { Ror } from "./ror";
import AppSettings from "../app.settings";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface RiskLevel {
	class: string;
	source: string;
}

export class User {
	_id: ObjectId;
	email?: string;
	username: string;
	regdate: ISODate;
	supportedevents: string[];
	donated: number;
	donateddonations: number;
	received: number;
	receiveddonations: number;
	avatar: string;
	photo?: string;
	country: string;
	countries: string[];
	city: string;
	region: string;
	zipcode: string;
	street: string;
	streetnr: string;
	receiveaddress: string;
	usertype: UserType;
	subtype: string;
	bio: TString;
	trustlevel: number;
	locked: boolean;
	risk: {
		earthquake: RiskLevel;
		flood: RiskLevel;
		wildfire: RiskLevel;
	};
	refcode: number;
	badges: Badge[];
	firstname: string;
	lastname: string;
	mobile: string;
	telephone: string;
	fullname?: string;
	birthdate: ISODate;
	website: string;
	vat?: string;
	operators?: string;
	job?: string;
	tags?: Tags[];
}


@Injectable()
export class UserService {
	constructor(
		private http: HttpClient,
		private donationService: DonationService) { }

	getModel(username: string): Observable<UserModel> {
		return this.http.get<UserModel>(AppSettings.apiUrl + '/user/' + username)
			.pipe(map(i => new UserModel(i, this)));
	}

	get(username: string): Observable<User> {
		return this.http.get<User>(AppSettings.apiUrl + '/user/' + username);
	}

	getAddresses(username: string): Observable<string[]> {
		return this.http.get<string[]>(AppSettings.apiUrl + '/user/' + username + '/addresses')
			.pipe(unwrap('addresses'));
	}

	getRors(username: string): Observable<Ror[]> {
		return this.http.get<Ror[]>(AppSettings.apiUrl + '/user/' + username + '/rors',
			{ headers: { ignoreLoadingBar: String(true) } })
			.pipe(unwrap('rors'));
	}

	getTransactions(username: string): Observable<TransactionPublic[]> {
		return this.http.get<TransactionPublic[]>(AppSettings.apiUrl + '/user/' + username + '/txs',
			{ headers: { ignoreLoadingBar: String(true) } })
			.pipe(unwrap('txs'));
	}

	getProjects(username: string): Observable<UserProjectList> {
		return this.http.get<UserProjectList>(AppSettings.apiUrl + '/user/' + username + '/projects',
			{ headers: { ignoreLoadingBar: String(true) } });
	}

	getDonations(username: string): Observable<PaginationReply<Donation>> {
		return this.donationService.getUserDonations(username);
	}

	getDonationChart(username: string): Observable<ChartData> {
		return this.http.get<ChartDataRaw>(AppSettings.apiUrl + '/user/' + username + '/donations/chart',
			{ headers: { ignoreLoadingBar: String(true) } })
			.pipe(map(data => transformChartData(data)));
	}

	listOrganizations(query: PaginationQuery): Observable<PaginationReply<User>> {
		return this.http.post<PaginationReply<User>>(AppSettings.apiUrl + '/organizations/list', query)
			.pipe(unwrapPaginated('organizations'));
	}
}


export class UserModel extends User {
	userService: UserService;

	constructor(data: User, userService: UserService) {
		super();
		this.userService = userService;

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

	isSingleUser(): boolean {
		return this.usertype == 'singleuser';
	}

	getDonationChart(): Observable<ChartData> {
		return this.userService.getDonationChart(this.username);
	}

	getDonations(): Observable<PaginationReply<Donation>> {
		return this.userService.getDonations(this.username);
	}

	getAddresses(): Observable<string[]> {
		return this.userService.getAddresses(this.username);
	}

	getRors(): Observable<Ror[]> {
		return this.userService.getRors(this.username);
	}

	getProjects(): Observable<UserProjectList> {
		return this.userService.getProjects(this.username);
	}

	getTransactions(): Observable<TransactionPublic[]> {
		return this.userService.getTransactions(this.username);
	}
}
