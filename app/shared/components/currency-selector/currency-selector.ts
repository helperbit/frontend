import { CurrencyService } from '../../../services/currency';
import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
	selector: 'currency-selector',
	templateUrl: 'currency-selector.html',
	styleUrls: ['currency-selector.scss']
})
export class CurrencySelectorComponent implements OnInit, OnChanges {
	@Input() border?: 'none' | 'white';

	borderStyle?: string;
	currency: string;

	constructor(private currencyService: CurrencyService) {
		this.borderStyle = null;

		this.currencyService.onCurrencyChange.subscribe(c => {
			this.currency = c.code;
		});
	}

	changeCurrency(cur) {
		this.currency = cur;
		this.currencyService.setCurrency(cur);
	}

	ngOnChanges(changes) {
		if (!changes.border || !changes.border.currentValue)
			return;

		if (this.border == 'none')
			this.borderStyle = 'none';
		else if (this.border == 'white')
			this.borderStyle = '1px solid #fff';
		else
			this.borderStyle = 'none';
	}

	ngOnInit() {
		this.currency = this.currencyService.getCurrencyCode();
	}
}
