import { CurrencyService } from '../../services/currency';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'moneyUSD', pure: false })
export class MoneyUSDPipe implements PipeTransform {
	constructor(private currencyService: CurrencyService) {}

	transform(value: number) {
		if (!this.currencyService.currency)
			return '0.0 ' + '\u0024';

		if (this.currencyService.currency.code == 'EUR')
			return (value / this.currencyService.btcprice.usd * this.currencyService.btcprice.eur).toFixed(2) + '\u20AC';
		else
			return value.toFixed(2) + '\u0024';
	}
}