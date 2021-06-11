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

import { Component, Input } from '@angular/core';
import { WalletService, Wallet } from '../../../../models/wallet';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'wallet-settings-modal',
	templateUrl: 'settings.html'
})
export class WalletSettingsModal {
	@Input() wallet: Wallet;
	public error: string = '';
	public loading: boolean;

	constructor(
		public activeModal: NgbActiveModal,
		private walletService: WalletService
	) {
	}

	deleteWallet(w) {
		this.loading = true;

		this.walletService.delete(w.address).subscribe(_ => {
			this.loading = false;
			this.walletService.onReload.emit();
			this.activeModal.close();
		}, (res) => {
			this.error = res.error.error;
			this.loading = false;
		});
	}

	updateLabel() {
		this.walletService.updateLabel(this.wallet.address, this.wallet.label).subscribe(_ => {
			this.walletService.onReload.emit();
			this.activeModal.close();
		}, (res) => {
			this.error = res.error.error;
		});
	}
}