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

import { WalletService, WalletBalance } from '../../../models/wallet';
import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
	selector: 'address-balance',
	templateUrl: 'address-balance.html',
	styleUrls: ['address-balance.scss']
})
export class AddressBalanceComponent implements OnInit, OnChanges, OnDestroy {
	@Input() address: string;
	@Input() mode?: 'balance' | 'received';
	@Input() watchReload?: boolean;

	public balance: WalletBalance;
	private walletSubscription: Subscription;

	constructor(private walletService: WalletService) {
		this.balance = null;
	}

	private update() {
		this.walletService.getBalance(this.address).subscribe(data => {
			this.balance = data;
		}, err => {
			this.balance = { balance: 0, unconfirmed: 0, received: 0 };
		});
	}

	ngOnChanges(changes) {
		if (changes.address && changes.address.currentValue)
			this.update();
	}

	ngOnInit() {
		this.mode = this.mode ? this.mode : 'balance';

		if (this.watchReload)
			this.walletSubscription = this.walletService.onLoad.subscribe(() => this.update());
	}

	ngOnDestroy() {
		if (this.watchReload)
			this.walletSubscription.unsubscribe();
	}
}
