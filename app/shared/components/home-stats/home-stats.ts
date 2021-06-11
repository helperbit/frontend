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

import { incrementEffect } from "../../../shared/helpers/utils";
import { TranslateService } from '@ngx-translate/core';
import { StatsService } from "../../../models/stats";
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'home-stats',
	templateUrl: 'home-stats.html',
	styleUrls: ['home-stats.scss']
})
export class HomeStatsComponent implements OnInit {
	values: {
		icon: string;
		amount: { start: number; end: number };
		text: string;
	}[];

	constructor(
		private translate: TranslateService, 
		private statsService: StatsService
	) { }

	startIncrement() {
		for (let i = 0; i < this.values.length; i++)
			incrementEffect(this.values[i].amount.end, 3000, false, (value) => { this.values[i].amount.start = value });
	}

	ngOnInit() {
		this.statsService.getCountryStats('WRL', true).subscribe((data) => {
			this.values = [
				{
					icon: 'fa-handshake-o',
					amount: {
						start: 0,
						end: data.donateddonations
					},
					text: this.translate.instant('donations')
				},
				{
					icon: 'fa-btc',
					amount: {
						start: 0,
						end: data.donated
					},
					text: this.translate.instant('volume')
				},
				{
					icon: 'fa-sitemap',
					amount: {
						start: 0,
						end: data.projects
					},
					text: this.translate.instant('fundraisings')
				},
				{
					icon: 'fa-users',
					amount: {
						start: 0,
						end: data.users
					},
					text: this.translate.instant('users')
				}
			];

			this.startIncrement();
		});
	}
}