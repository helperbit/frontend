import { ObjectId, PaginationQuery, PaginationReply, unwrapPaginated, ISODate } from "./common";
import AppSettings from "../app.settings";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DonateReply {
	address: string;
	donation: ObjectId;
	amount: number;
	expiry: ISODate;
}

export interface DonationTo {
	type: string;
	_id: string;
	user: string;
	value: number;
	address: string;
	project: string;
}

export interface Donation {
	value_historic: {
		eur: number;
		gbp: number;
		usd: number;
	};
	txid: string;
	status: string;
	campaign?: string;
	expiry?: ISODate;
	tocountries: string[];
	event?: ObjectId;
	fiatdonation?: ObjectId;
	altdonation?: ObjectId;
	fromcurrency: string;
	invoicestatus: string;
	_id: ObjectId;
	to: DonationTo[];
	time: ISODate;
	value: number;
	from?: string;
	tocountry: string;
	fromaddress: string;
	fromcountry?: string;
}

export interface DonationGift {
	gift: {
		name: string;
		message: string;
	};
}

export interface DonationGraph {
	edges: {
		type: 'donation';
		time: Date;
		id: string;
		from: string;
		value: number;
		altdonation: boolean;
		fiatdonation: boolean;
		to: {
			value: number;
			username: string;
		}[];
	}[];
	nodes: {
		[address: string]: {
			usertype: string;
			avatar: string;
			username: string;
			fullname: string;
			received: number;
			donated: number;
		};
	};
}


@Injectable()
export class DonationService {
	constructor(private http: HttpClient) { }

	getGraph(query: {} = null): Observable<DonationGraph> {
		return this.http.post<DonationGraph>(AppSettings.apiUrl + '/donations/graph', query);
	}

	getUserGraph(username: string): Observable<DonationGraph> {
		return this.http.get<DonationGraph>(AppSettings.apiUrl + '/user/' + username + '/graph',
			{ headers: { ignoreLoadingBar: String(true) } });
	}

	getProjectGraph(id: ObjectId): Observable<DonationGraph> {
		return this.http.get<DonationGraph>(AppSettings.apiUrl + '/project/' + id + '/graph',
			{ headers: { ignoreLoadingBar: String(true) } });
	}

	get(id: string): Observable<Donation> {
		return this.http.get<Donation>(AppSettings.apiUrl + '/donation/' + id);
	}

	getGiftDonation(id: string, token: string): Observable<Donation & DonationGift> {
		return this.http.get<Donation & DonationGift>(AppSettings.apiUrl + '/donation/' + id + '/gift?token=' + token);
	}

	getList(query: PaginationQuery = null, ignoreLoadingBar: boolean = false): Observable<PaginationReply<Donation>> {
		if (query)
			return this.http.post<PaginationReply<Donation>>(AppSettings.apiUrl + '/donations', query,
				{ headers: { ignoreLoadingBar: String(ignoreLoadingBar) } })
				.pipe(unwrapPaginated('donations'));
		else
			return this.http.get<PaginationReply<Donation>>(AppSettings.apiUrl + '/donations',
				{ headers: { ignoreLoadingBar: String(ignoreLoadingBar) } })
				.pipe(unwrapPaginated('donations'));
	}

	getUserDonations(username: string, query: PaginationQuery | { flow: 'in' | 'out' } = null): Observable<PaginationReply<Donation>> {
		if (query)
			return this.http.post<PaginationReply<Donation>>(AppSettings.apiUrl + '/user/' + username + '/donations', query,
				{ headers: { ignoreLoadingBar: String(true) } })
				.pipe(unwrapPaginated('donations'));
		else
			return this.http.get<PaginationReply<Donation>>(AppSettings.apiUrl + '/user/' + username + '/donations',
				{ headers: { ignoreLoadingBar: String(true) } })
				.pipe(unwrapPaginated('donations'));
	}

	getProjectDonations(id: string, query: PaginationQuery = null): Observable<PaginationReply<Donation>> {
		if (query)
			return this.http.post<PaginationReply<Donation>>(AppSettings.apiUrl + '/project/' + id + '/donations', query,
				{ headers: { ignoreLoadingBar: String(true) } })
				.pipe(unwrapPaginated('donations'));
		else
			return this.http.get<PaginationReply<Donation>>(AppSettings.apiUrl + '/project/' + id + '/donations',
				{ headers: { ignoreLoadingBar: String(true) } })
				.pipe(unwrapPaginated('donations'));
	}

	getCampaignDonations(id: string, query: PaginationQuery = null): Observable<PaginationReply<Donation>> {
		if (query)
			return this.http.post<PaginationReply<Donation>>(AppSettings.apiUrl + '/campaign/' + id + '/donations', query,
				{ headers: { ignoreLoadingBar: String(true) } })
				.pipe(unwrapPaginated('donations'));
		else
			return this.http.get<PaginationReply<Donation>>(AppSettings.apiUrl + '/campaign/' + id + '/donations',
				{ headers: { ignoreLoadingBar: String(true) } })
				.pipe(unwrapPaginated('donations'));
	}

	getEventDonations(id: string, query: PaginationQuery = null): Observable<PaginationReply<Donation>> {
		if (query)
			return this.http.post<PaginationReply<Donation>>(AppSettings.apiUrl + '/event/' + id + '/donations', query,
				{ headers: { ignoreLoadingBar: String(true) } })
				.pipe(unwrapPaginated('donations'));
		else
			return this.http.get<PaginationReply<Donation>>(AppSettings.apiUrl + '/event/' + id + '/donations',
				{ headers: { ignoreLoadingBar: String(true) } })
				.pipe(unwrapPaginated('donations'));
	}

	requestInvoice(txid: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/donation/' + txid + '/requestinvoice', {});
	}


	donate(totype: 'user' | 'project', toid: ObjectId, amount: number, additionalParams?: string): Observable<DonateReply> {
		return this.http.get<DonateReply>(AppSettings.apiUrl + '/' + totype + '/' + toid + '/donate?amount=' + amount + (additionalParams || ''));
	}
}