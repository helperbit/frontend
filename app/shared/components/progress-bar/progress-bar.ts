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

import { Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyService } from '../../../services/currency';
import { MoneyPipe } from '../../../shared/filters/money';
import { interpolateString } from 'app/shared/helpers/utils';

export type ProgressBarConfig = {
	current: number;
	received: number;
	target: number;
};

@Component({
	selector: 'progress-bar',
	templateUrl: 'progress-bar.html',
	styleUrls: ['progress-bar.scss']
})
export class ProgressBarComponent implements OnChanges {
	@Input() config: ProgressBarConfig;
	progressConfig: ProgressBarConfig & {
		percentage: number;
		remains: number;
		remainstext: string;
	};

	constructor(
		private translate: TranslateService, 
		private currencyService: CurrencyService,
		private moneyPipe: MoneyPipe
	) { 
		this.progressConfig = {
			current: 0,
			percentage: 0,
			remainstext: '',
			received: 0,
			target: 0,
			remains: 0
		};
	}

	ngOnChanges(changes) {
		if (!changes.config || !changes.config.currentValue)
			return;

		const progressConfig = {
			current: this.config.current,
			percentage: 100.0 * this.config.current / this.config.target,
			remains: this.config.target - this.config.current,
			remainstext: '',
			received: this.config.received,
			target: this.config.target
		};

		progressConfig.remainstext = interpolateString(this.translate.instant('About {{remains}} left'), { remains: this.moneyPipe.transform(progressConfig.remains, 'short') });

		this.currencyService.onCurrencyChange.subscribe(_ => {
			progressConfig.remainstext = interpolateString(this.translate.instant('About {{remains}} left'), { remains: this.moneyPipe.transform(progressConfig.remains, 'short') });
		});

		if (progressConfig.percentage < 0.1 && progressConfig.current > 0)
			progressConfig.percentage = 0.1;

		this.progressConfig = progressConfig;
	}
}
