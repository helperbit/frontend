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