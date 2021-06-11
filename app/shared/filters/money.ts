import { CurrencyService } from '../../services/currency';
import { Pipe, PipeTransform } from '@angular/core';

/** Mo-mo-mo-money: get a money value in Bitcoin, return the converted value in local fiat
 *	value: the money value
 *  round: rounding options
 *		'auto' || null 	-> Standard visualization (5.12$ || 1.2432 BTC)
 * 		'short' 		-> Short visualization (5$ || 1.12BTC)
 *		'full'			-> Full visualization
 *	symbol: visualize or not the symbol
 *  inv: inverted conversion
 */
@Pipe({ name: 'money', pure: false })
export class MoneyPipe implements PipeTransform {
	constructor(private currencyService: CurrencyService) { }

	transform(value, round: string | number = 'auto', symbol?, inv?) {
		round = round || 'auto';
				
		if (symbol === null || symbol === undefined)
			symbol = true;

		if (value == 'name') return this.currencyService.currency.name;
		else if ((value === undefined || value === null) && symbol) return this.currencyService.currency.symbol;
		else if (value === undefined && !symbol) return '';

		let transvalue = value;

		/* Conversion */
		if (this.currencyService.currency.code != 'BTC') {
			transvalue = this.currencyService.currency.value * value;
			if (inv) transvalue = value / this.currencyService.currency.value;
		} 
		else if (typeof(round) == 'number' && round < 0) {
			round = 4;
		}

		if (round == 'auto' || round == 'short' || round == 'full') {
			if (round == 'auto') {
				if (this.currencyService.currency.code != 'BTC') 	round = 2;
				else round = 4;
			} 
			else if (round == 'short') {
				if (this.currencyService.currency.code != 'BTC')	round = 0;
				else round = 4;
			} 
			else if (round == 'full') {
				if (this.currencyService.currency.code == 'BTC')	round = 8;
				else round = 2;
			}

			transvalue = Math.round (transvalue * Math.pow (10, round)) / Math.pow (10, round);

			/* Aggiunge gli zeri se non ci sono */
			if (round === 0) {
				transvalue = '' + Math.floor (transvalue);
			} else {
				transvalue = '' + transvalue;
				const p = transvalue.indexOf ('.');
				if (p == -1)
					transvalue += '.' + Array(round + 1).join ("0");
				else {
					transvalue += Array (round - (transvalue.length - p) + 2).join ("0");
				}
			}
		} 
		else if (round > 0) {
			transvalue = Math.round (transvalue * Math.pow (10, Number(round))) / Math.pow (10, Number(round));
		} 
		else if (round < 0){
			transvalue = Math.round (transvalue);
			const s = (''+transvalue).length;

			if (s > 1)
				transvalue = Math.round (transvalue * Math.pow (10, -(s-1))) / Math.pow (10, -(s-1));
		} else {
			transvalue = Math.round (transvalue);
		}
		
		let str = '';
		str += transvalue;
		if (symbol) {
			if(str.length>0)
				str += ' ' + this.currencyService.currency.symbol;
			else
				str += this.currencyService.currency.symbol;
		}

		return str;
	}
}