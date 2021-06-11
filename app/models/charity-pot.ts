import { ObjectId, unwrap, ISODate } from "./common";
import { Project } from "./project";
import AppSettings from "../app.settings";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CharityPotStats {
	votes: number;
	rounds: number;
	value: number;
	target: number;
}

export interface CharityPotRound {
	_id: ObjectId;
	winner: {
		project?: ObjectId;
		donation?: string;
		status: 'none' | 'done';
	};
	status: 'running' | 'concluded';
	value: number;
	votes: number;
	start: ISODate;
	expiration: ISODate;
	results: {
		votes: number;
		value: number;
		project: ObjectId | Project;
	}[];
}

@Injectable()
export class CharityPotService {
	constructor(private http: HttpClient) {}

	getCurrentRound(): Observable<CharityPotRound> {
		return this.http.get<CharityPotRound>(AppSettings.apiUrl + '/lightning/charitypot');
	}

	getRoundList(): Observable<CharityPotRound[]> {
		return this.http.get<CharityPotRound[]>(AppSettings.apiUrl + '/lightning/charitypot/rounds')
			.pipe(unwrap('rounds'));
	}

	getStats(): Observable<CharityPotStats> {
		return this.http.get<CharityPotStats>(AppSettings.apiUrl + '/lightning/charitypot/stats');
	}
}