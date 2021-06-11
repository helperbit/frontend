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
