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
