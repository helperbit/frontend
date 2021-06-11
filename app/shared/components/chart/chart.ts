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

import { Component, Input, OnChanges, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/dist/Chart.js';
import 'chartjs-adapter-date-fns';

export interface ChartConfig {
	values: number[];
	colors: string[];
	labels: string[];
	type: string;
	options: any; //ChartOptions;
}

@Component({
	selector: 'chart',
	templateUrl: 'chart.html',
	styleUrls: ['chart.scss']
})

export class ChartComponent implements OnChanges {
	@Input() options: any;
	@Input() values: any;
	@Input() labels: any;
	@Input() colors: any;
	@Input() type: any;

	@ViewChild('canvas', { static: true }) canvas: ElementRef;

	chart: any;
	chartConfig: any; // ChartConfiguration;

	constructor() {
		this.chartConfig = {
			type: 'line',
			data: {
				labels: [],
				datasets: [
					{
						data: [],
						backgroundColor: []
					}
				]
			},
			options: {
				scales: {
					y: {
						ticks: {
							beginAtZero: true
						}
					}
				},
				legend: {
					display: false
				}
			}
		};
	};

	private isChartInitialize(): boolean {
		return this.chart;
	}

	private createChart() {
		this.chart = new Chart(this.canvas.nativeElement, this.chartConfig);
	}

	updateChartValues() {
		this.chartConfig.data.datasets[0].data = this.values;

		if (!this.isChartInitialize())
			this.createChart();
		else
			this.chart.update();
	}

	updateChartOptions() {
		if (this.options.scales)
			this.chartConfig.options.scales = this.options.scales;
		if (this.options.tooltips)
			this.chartConfig.options.tooltips = this.options.tooltips;
		if (this.options.layout)
			this.chartConfig.options.layout = this.options.layout;
		if (this.options.legend)
			this.chartConfig.options.legend = this.options.legend;
	}

	ngOnChanges(changes) {
		if (changes.type && changes.type.currentValue)
			this.chartConfig.type = this.type;
		if (changes.labels && changes.labels.currentValue)
			this.chartConfig.data.labels = this.labels;
		if (changes.colors && changes.colors.currentValue) {
			if (this.colors.length == 1)
				this.chartConfig.data.datasets[0].backgroundColor = this.values.map(value => this.colors[0])
			else
				this.chartConfig.data.datasets[0].backgroundColor = this.colors;
		}
		if (changes.options && changes.options.currentValue)
			this.updateChartOptions();
		if (changes.values && changes.values.currentValue)
			this.updateChartValues();
	}
}