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
