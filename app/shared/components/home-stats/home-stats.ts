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