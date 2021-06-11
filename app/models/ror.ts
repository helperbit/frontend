import { ObjectId, unwrap, ISODate } from "./common";
import AppSettings from "../app.settings";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { objectToFormData } from 'app/shared/helpers/utils';

export interface Ror {
	_id: ObjectId;

	txid: string;
	status: 'pending' | 'sent' | 'rejected' | 'accepted';
	rejectreason?: string;
	from: string;
	to: string;

	receiveaddress: string;
	value: number;
	valuebtc: number;
	currency: string;

	description: string;
	documents: string[];
	hash: string;

	invvat: string;
	invdate: ISODate;
	time: ISODate;
}

export interface RorTo {
	_id: ObjectId;
	username: string;
	usertype: string;
	fullname: string;
}

export interface RorData {
	to: string;
	currency: string;
	description: string;
	invvat: string;
	invdate: ISODate;
	accept: boolean;
	value: number;
}

@Injectable()
export class RorService {
	constructor(private http: HttpClient) { }

	create(to: string, rorData: RorData, file: File): Observable<void> {
		const formData: FormData = new FormData();
		formData.append('file', file);
		objectToFormData(formData, rorData);
		return this.http.post<void>(AppSettings.apiUrl + '/user/' + to + '/ror', formData);
	}

	reject(id: string, reason: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/me/ror/' + id + '/reject', { reason: reason });
	}

	delete(id: string): Observable<void> {
		return this.http.delete<void>(AppSettings.apiUrl + '/me/ror/' + id);
	}

	getList(): Observable<Ror[]> {
		return this.http.get<Ror[]>(AppSettings.apiUrl + '/me/rors')
			.pipe(unwrap('rors'));
	}

	getToList(): Observable<RorTo[]> {
		return this.http.get<RorTo[]>(AppSettings.apiUrl + '/me/rors/tolist')
			.pipe(unwrap('users'));
	}

	get(id: string, ignoreLoadingBar: boolean = false): Observable<Ror> {
		return this.http.get<Ror>(AppSettings.apiUrl + '/ror/' + id,
			{ headers: { ignoreLoadingBar: String(ignoreLoadingBar) } });
	}
}