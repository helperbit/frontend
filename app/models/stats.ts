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

import { ObjectId, Badge, unwrap, ISODate } from "./common";
import AppSettings from "../app.settings";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Stats {
	users: number;
	organizations: number;
	events: number;
	donations: number;
	projects: number;
}

export interface CountryStat {
	_id: ObjectId;
	users: number;
	organizations: number;
	companies: number;
	singleusers: number;
	onlineusers: number;
	projects: number;
	events: number;
	donateddonations: number;
	donated: number;
	received: number;
	receiveddonations: number;
	historylast: ISODate;
	topfivedonated: {}[];
	topfivereceived: {}[];
	history: {}[];
	country: string;
}

export type Timeframe = 'ever' | 'week' | 'year' | 'month' | '3month';

export interface WorldStats { [country: string]: CountryStat }

export interface TopDonor {
	_id: ObjectId;
	country: string;
	user: string;
	volume: number;
	address: string;
	n: number;
}

export interface TopAmbassador {
	user: string;
	count: number;
}

export interface Merchandise {
	_id: ObjectId;
	assigned: number;
	time: ISODate;
	name: string;
	totals: number;
	minrefs: number;
	assignment?: any;
}

export interface BadgeWithUser extends Badge {
	user: string;
}

@Injectable()
export class StatsService {
	constructor(private http: HttpClient) { }

	get(): Observable<Stats> {
		return this.http.get<Stats>(AppSettings.apiUrl + '/stats');
		//{ ignoreLoadingBar: true }));
	}

	getWorld(): Observable<WorldStats> {
		return this.http.get<WorldStats>(AppSettings.apiUrl + '/stats/world');
	}

	getCountryStats(country: string, short: boolean = false) {
		return this.http.get<CountryStat>(AppSettings.apiUrl + '/stats/country/' + country + (short ? '/short' : ''));
	}

	getSocial(): Observable<{ twitter: number; facebook: number }> {
		return this.http.get<{ twitter: number; facebook: number }>(AppSettings.apiUrl + '/stats/social');
		// , { cache: true, ignoreLoadingBar: true }));
	}

	getTopDonors(timeframe: Timeframe = 'ever'): Observable<TopDonor[]> {
		return this.http.get<TopDonor[]>(AppSettings.apiUrl + '/stats/topdonors/' + timeframe)
			.pipe(unwrap('topdonors'));
	}

	getTopAmbassadors(timeframe: Timeframe = 'ever'): Observable<TopAmbassador[]> {
		return this.http.get<TopAmbassador[]>(AppSettings.apiUrl + '/stats/topambassadors/' + timeframe)
			.pipe(unwrap('topambassadors'));
	}

	getMerchandise(): Observable<Merchandise[]> {
		return this.http.get<Merchandise[]>(AppSettings.apiUrl + '/stats/merchandise')
			.pipe(unwrap('merchandise'));
	}


	getLastBadges(limit?: number): Observable<BadgeWithUser[]> {
		return this.http.get<BadgeWithUser[]>(AppSettings.apiUrl + '/stats/lastbadges' + (limit ? '?limit=' + limit : ''))
			.pipe(unwrap('lastbadges'));
		//{ ignoreLoadingBar: true }),
	}
}