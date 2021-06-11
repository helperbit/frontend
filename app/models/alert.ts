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