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