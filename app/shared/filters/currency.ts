import { CurrencyService } from '../../services/currency';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currency', pure: false })
export class CurrencyPipe implements PipeTransform {
	constructor(private currencyService: CurrencyService) { }

	transform(value: number, from: string, to: string, toParseNumber?: boolean, symbol?: boolean) {
		return this.currencyService.convertCurrency(value, from, to, toParseNumber, symbol);
	}
}