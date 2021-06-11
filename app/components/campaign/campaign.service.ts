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

import { ObjectId, PaginationReply, unwrap } from "../../models/common";
import { ProgressBarConfig } from "../../shared/components/progress-bar/progress-bar";
import { CurrencyService } from "../../services/currency";
import { DonationService, Donation } from "../../models/donation";
import AppSettings from "../../app.settings";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Campaign {
	_id: ObjectId;
	owner: string;
	title: string;
	description: string;
	status: 'started' | 'concluded' | 'draft';
	type: 'project';
	resource: ObjectId;
	received: number;
	receivedconverted: number;
	receiveddonations: number;
	target: number;
	currency: string;
	end: Date;
	start: Date;
	media: string;
}

export interface CampaignEditData {
	title: string;
	description: string;
	status: 'started' | 'concluded' | 'draft';
	type: 'project';
	resource: ObjectId;
	target: number;
	currency: string;
	end: Date;
}


@Injectable()
export class CampaignService {
	constructor(
		private currencyService: CurrencyService, 
		private donationService: DonationService, 
		private http: HttpClient) { }


	create(campaignData: CampaignEditData): Observable<{ id: ObjectId }> {
		return this.http.post<{ id: ObjectId }>(AppSettings.apiUrl + '/campaign/create', campaignData);
	}

	edit(id: string, campaignData: CampaignEditData): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/campaign/' + id + '/edit', campaignData);
	}

	get(id: ObjectId): Observable<Campaign> {
		return this.http.get<Campaign>(AppSettings.apiUrl + '/campaign/' + id);
	}

	delete(id: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/campaign/' + id + '/delete', {});
	}

	getMyCampaigns(): Observable<Campaign[]> {
		return this.http.get<Campaign[]>(AppSettings.apiUrl + '/me/campaigns')
			.pipe(unwrap('campaigns'));
	}

	uploadMedia(id: ObjectId, file: File): Observable<void> {
		const formData: FormData = new FormData();
		formData.append('file', file);
		return this.http.post<void>(AppSettings.apiUrl + '/campaign/' + id + '/media/', formData);
	}

	getDonations(id: string): Observable<PaginationReply<Donation>> {
		return this.donationService.getCampaignDonations(id);
	}

	removeMedia(id: ObjectId): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/campaign/' + id + '/media/remove', {});
	}

	createProgressBarConfig(campaign: Campaign): ProgressBarConfig {
		const current = campaign.receivedconverted / this.currencyService.btcprice[campaign.currency.toLowerCase()];
		const target = campaign.target / this.currencyService.btcprice[campaign.currency.toLowerCase()];

		return {
			current: current,
			target: target,
			received: current
		}
	}
}