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