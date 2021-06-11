import { CurrencyService } from '../../services/currency';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'moneyToBTC', pure: false })
export class MoneyToBTCPipe implements PipeTransform {
	constructor(private currencyService: CurrencyService) {}

	transform(value, base: string) {
		if (!this.currencyService.currencies || !(base in this.currencyService.currencies))
			return 0.0;

		if (base == 'BTC') return value;

		return value / this.currencyService.currencies[base].value;
	}
}