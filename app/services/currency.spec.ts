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

import { TestBed } from '@angular/core/testing';
import { CurrencyService } from './currency';

describe('CurrencyService', () => {
	let currencyService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
			],
			providers: [
				CurrencyService
			]
		});
		currencyService = TestBed.get(CurrencyService);
	});

	it('should istantiate', () => {
		expect(currencyService).toBeDefined();
	});

	it('should detect currency', () => {
		expect(currencyService.detectCurrency().code).toBe('USD');
	});

	it('should return currency', () => {
		currencyService.detectCurrency();
		expect(currencyService.getCurrencyCode()).toBe('USD');
		expect(currencyService.getCurrency()).toEqual({ code: 'USD', name: 'dollar', symbol: '$', value: 0 });
	});

	it('should set currency', () => {
		currencyService.detectCurrency();
		expect(currencyService.getCurrencyCode()).toBe('USD');
		currencyService.setCurrency('EUR');
		expect(currencyService.getCurrencyCode()).toBe('EUR');
		currencyService.setCurrency('USD');
	});
});
