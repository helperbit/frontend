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

import { ObjectId, ISODate } from "./common";
import AppSettings from "../app.settings";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LightningInvoice {
	status: 'paid' | 'expired';
	created_at: ISODate;
	expires_at: ISODate;
}

export interface LightningInfo {
	invoices: number;
	volume: number;
	node: string;
	online: boolean;
	nodeinfo: {
		id: string;
	};
}

export interface LightningInvoiceCreateData {
	msat: number;
	metadata: { type: string } & any;
}


@Injectable()
export class LightningService {
	constructor(private http: HttpClient) { }

	createInvoice(invoiceData: LightningInvoiceCreateData): Observable<LightningInvoice> {
		return this.http.post<LightningInvoice>(AppSettings.apiUrl + '/lightning/invoice/create', invoiceData);
	}

	getInvoice(id: ObjectId, ignoreLoadingBar: boolean = false): Observable<LightningInvoice> {
		return this.http.get<LightningInvoice>(AppSettings.apiUrl + '/lightning/invoice/' + id,
			{ headers: { ignoreLoadingBar: String(ignoreLoadingBar) } });
	}

	getInfo(): Observable<LightningInfo> {
		return this.http.get<LightningInfo>(AppSettings.apiUrl + '/lightning/info');
	}
}