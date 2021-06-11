import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'moneyFIAT', pure: false })
export class MoneyFIATPipe implements PipeTransform {
	constructor() {}

	transform(value: number, currency: string) {
		if (currency == 'EUR')
			return value.toFixed(2) + ' ' + '\u20AC';
		else
			return value.toFixed(2) + ' ' + '\u0024';
	}
}