import { ObjectId, unwrap } from "./common";
import AppSettings from "../app.settings";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProposedNpo {
	_id: ObjectId;
	name: string;
	link: string;
	country: string;
	endorsment: number;
	social: {
		facebook: string;
		twitter: string;
		googleplus: string;
	};
}

export interface ProposedNpoCreateData {
	name: string;
	link: string;
	country: string;
}

@Injectable()
export class ProposedNpoService {
	constructor(private http: HttpClient) {}

	getList(): Observable<ProposedNpo[]> {
		return this.http.get<ProposedNpo[]>(AppSettings.apiUrl + '/proposednpo')
			.pipe(unwrap('proposednpo'));
	}

	propose(npoData: ProposedNpoCreateData): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/proposednpo/insert', npoData);
	}

	endorse(id: ObjectId): Observable<{ endorsment: number }> {
		return this.http.post<{ endorsment: number }>(AppSettings.apiUrl + '/proposednpo/' + id + '/endorse', {});
	}
}