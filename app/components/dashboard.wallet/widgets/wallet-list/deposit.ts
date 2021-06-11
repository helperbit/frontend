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

import { Component, Input, OnInit } from '@angular/core';
import { WalletService, Wallet, WalletTransaction } from '../../../../models/wallet';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'wallet-deposit-modal',
	templateUrl: 'deposit.html'
})
export class WalletDepositModal implements OnInit {
	@Input() wallet: Wallet;
	public txs: WalletTransaction[] = [];
	public qr: string = '';
	// faucet: { loading: boolean; error: string };

	constructor(
		public activeModal: NgbActiveModal,
		private walletService: WalletService
	){ 
		// this.faucet = { loading: false, error: '' };
		
		// this.modals = {
		// 	faucetDone: {
		// 		id: 'modalFaucetDone'
		// 	},
	}

	// getFaucet(w: Wallet) {
	// 	this.faucet.loading = true;
	// 	this.walletService.getFaucet(w.address).subscribe(_ => {
	// 		this.faucet.loading = false;
	// 		this.reloadWallet();
	// 		$('#modalDeposit').modal('hide');
	// 		$('#modalFaucetDone').modal('show');
	// 	},(res) => {
	// 		this.faucet.error = res.error.error;
	// 		this.faucet.loading = false;
	// 	});
	// }

	ngOnInit() {
		this.walletService.getTransactions(this.wallet.address).subscribe(txs => {
			this.txs = txs;
		});
		this.qr = 'bitcoin:' + this.wallet.address;
	}
}