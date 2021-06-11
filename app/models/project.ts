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

import { TString, ObjectId, ChangeHistory, PaginationReply, PaginationQuery, unwrap, unwrapPaginated, Tags, ISODate, UserType } from "./common";
import { ProgressBarConfig } from "../shared/components/progress-bar/progress-bar";
import { CurrencyService } from "../services/currency";
import { DonationService, Donation } from "./donation";
import AppSettings from "../app.settings";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user';
import { UserProjectList } from './dashboard';

export type ProjectStatus = 'draft' | 'submitted' | 'approved' | 'rejected';
export type ProjectActivityCategory = 'update' | 'invoice' | 'media' | 'quote';

export interface ActivityData {
	title: TString;
	description: TString;
	category: ProjectActivityCategory;
}

export interface ProjectActivity {
	_id: ObjectId;
	title: TString;
	description: TString;
	// target: number;
	media: string[];
	createdAt: Date;
	category: ProjectActivityCategory;

	project?: ObjectId; // Assigned by a controller
}

export interface ProjectSupporter {
	user: string;
	link: string;
	level: number;
}

export interface Project {
	_id: ObjectId;
	status: ProjectStatus;
	paused: boolean;
	owner: string;
	title: TString;
	description: TString;
	tags: Tags[];
	video: string;
	media: ObjectId[];
	activities: ProjectActivity[];
	countries: string[];
	event?: ObjectId;
	start: ISODate;
	end: ISODate;
	target: number;
	currency: string;
	received: number;
	pending: number;
	used: number;
	receiveddonations: number;
	receiveaddress: string;
	changeHistory: ChangeHistory;
	ownerdetails?: {
		fullname: string;
		usertype: UserType;
	};
	supporters: ProjectSupporter[];
}

export interface ProjectsHome {
	trending: Project[];
	latest: Project[];
}



@Injectable()
export class ProjectService {
	constructor(
		private http: HttpClient,
		private currencyService: CurrencyService,
		private donationService: DonationService,
		private userService: UserService
	) { }

	get(id: ObjectId, ignoreLoadingBar: boolean = false): Observable<Project> {
		return this.http.get<Project>(AppSettings.apiUrl + '/project/' + id,
			{ headers: { ignoreLoadingBar: String(true) } });
	}


	getHomeList(): Observable<ProjectsHome> {
		return this.http.get<ProjectsHome>(AppSettings.apiUrl + '/projects/home');
	}

	getList(query: PaginationQuery): Observable<PaginationReply<Project>> {
		return this.http.post<Project>(AppSettings.apiUrl + '/projects/list', query)
			.pipe(unwrapPaginated('projects'));
	}

	getUserProjects(username: string): Observable<UserProjectList> {
		return this.userService.getProjects(username);
	}

	getAll(): Observable<Project[]> {
		return this.http.get<Project[]>(AppSettings.apiUrl + '/projects')
			.pipe(unwrap('projects'));
	}

	getDonations(id: string): Observable<PaginationReply<Donation>> {
		return this.donationService.getProjectDonations(id);
	}


	create(projectData): Observable<ObjectId> {
		return this.http.post<ObjectId>(AppSettings.apiUrl + '/project/create', projectData)
			.pipe(unwrap('id'));
	}

	edit(id: string, projectData): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/project/' + id + '/edit', projectData);
	}

	uploadMedia(id: string, file: File): Observable<void> {
		const formData: FormData = new FormData();
		formData.append('file', file);
		return this.http.post<void>(AppSettings.apiUrl + '/project/' + id + '/media', formData);
	}

	removeMedia(id: string, mid: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/project/' + id + '/media/' + mid + '/remove', {});
	}

	deleteProject(id: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/project/' + id + '/delete', {});
	}

	submitProject(id: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/project/' + id + '/submit', {});
	}

	createActivity(pid: string, activityData): Observable<ObjectId> {
		return this.http.post<ObjectId>(AppSettings.apiUrl + '/project/' + pid + '/activity/new', activityData)
			.pipe(unwrap('id'));
	}

	editActivity(pid: string, aid: string, activityData: ActivityData): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/project/' + pid + '/activity/' + aid + '/edit', activityData);
	}

	uploadActivityMedia(pid: string, aid: string, file: File): Observable<void> {
		const formData: FormData = new FormData();
		formData.append('file', file);
		return this.http.post<void>(AppSettings.apiUrl + '/project/' + pid + '/activity/' + aid + '/media', formData);
	}

	removeActivity(pid: string, aid: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/project/' + pid + '/activity/' + aid + '/remove', {});
	}

	removeActivityMedia(pid: string, aid: string, mid: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/project/' + pid + '/activity/' + aid + '/media/' + mid + '/remove', {});
	}

	createProgressBarConfig(project: Project): ProgressBarConfig {
		// Fields named received, used, pending, target has the following meaning:
		// target: value in “currency” (EUR/USD) to reach for project completation
		// received: total Bitcoin received
		// used: value in “currency” (EUR/USD) already used by the organization owning the project (the value is fixed to the change of the time they used the BTC)
		// pending: total Bitcoin received minus the Bitcoin used
		// So the percentage of completation of the project is: complet = used + pending * btcprice[currency] completpercentage = complet * 100 / target

		const receivedUsed = project.used / this.currencyService.btcprice[project.currency.toLowerCase()];
		const receivedAvailable = project.pending;
		const current = receivedAvailable + receivedUsed;
		const target = project.target / this.currencyService.btcprice[project.currency.toLowerCase()];

		return {
			current: current,
			target: target,
			received: project.received
		}
	}
}