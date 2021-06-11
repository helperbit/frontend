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

import { MoneyToBTCPipe } from './money-to-btc';
import { CurrencyService } from 'app/services/currency';
import { MockCurrencyService } from '../helpers/mocks';

describe('MoneyToBTCPipe', () => {
	const pipe = new MoneyToBTCPipe((new MockCurrencyService as unknown) as CurrencyService);

	it('should return btc with the same value', async () => {
		expect(pipe.transform(12.564, 'BTC')).toBe(12.564);
	});

	it('should return 0 if the currency is not supported', async () => {
		expect(pipe.transform(12.564, 'CNY')).toBe(0);
	});

	it('should return the number converted to EUR', async () => {
		expect(pipe.transform(12, 'EUR')).toBe(12/3);
	});

	it('should return the number converted to USD', async () => {
		expect(pipe.transform(12, 'USD')).toBe(12/2);
	});
});
