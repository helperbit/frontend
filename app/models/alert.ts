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

import { ObjectId } from "./common";
import AppSettings from "../app.settings";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface AlertCreateData {
	description: string;
	type: string;
}

@Injectable()
export class AlertService {
	constructor(private http: HttpClient) { }

	create(alertData: AlertCreateData, ignoreLoadingBar: boolean = false): Observable<{ id: ObjectId }> {
		return this.http.post<{ id: ObjectId }>(AppSettings.apiUrl + '/me/alert', alertData, 
			{ headers: { ignoreLoadingBar: String(ignoreLoadingBar) } });
	}

	updateMedia(id: ObjectId, media: File): Observable<void> {
		const formData: FormData = new FormData();
		formData.append('file', media);
		return this.http.post<void>(AppSettings.apiUrl + '/me/alert/' + id + '/media', formData);
	}
}