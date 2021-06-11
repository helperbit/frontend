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

import { BitcoinService, mnemonicToKeys } from '../bitcoin.service/mnemonic';
import { BitcoinLedgerService } from '../bitcoin.service/ledger';
import { Wallet, HardwareWalletType, Transaction, TLTransaction } from '../../../models/wallet';
import { LedgerWaitStatus } from '../widgets/ledger-wait/ledger-wait';
import { BitcoinUTXO, BitcoinSignOptions, BackupFile, loadBackup, decryptBackup, BitcoinKeys } from '../bitcoin.service/bitcoin-helper';
import { Async } from '../../../shared/helpers/async';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { getLocalStorage } from 'app/shared/helpers/utils';

export interface SignConfig {
	type: 'single' | 'multi' | 'verify';
	wallet?: Wallet;
	transaction?: Transaction;
	tltransaction?: TLTransaction;

	forceBackup?: boolean;
}

@Component({
	selector: 'wallet-sign',
	templateUrl: 'sign.html',
})
export class WalletSignComponent implements OnChanges, OnInit {
	@Input('config') signConfig: SignConfig;

	showpassphrase: boolean;
	username: string;
	email: string;
	ledgerWaitStatus: LedgerWaitStatus;
	model: {
		multisig: boolean;
		hardware: boolean;
		hardwareType: HardwareWalletType;
		useBackup: boolean;
		mnemonic: string;
		backup: {
			password: string;
			file: File;
			data: BackupFile;
		};
	}

	constructor(
		private bitcoinService: BitcoinService,
		private bitcoinLedgerService: BitcoinLedgerService
	) {
		this.showpassphrase = false;
		this.model = {
			multisig: false,
			hardware: false,
			hardwareType: 'none',
			useBackup: false,
			mnemonic: '',
			backup: {
				password: '',
				file: null,
				data: null
			}
		};

		this.ledgerWaitStatus = {
			phase: 0,
			status: 'wait'
		};
	}

	public signMany(txs: { txhex: string; utxos: BitcoinUTXO[] }[]): Promise<string[]> {
		return Async.map(txs, tx => this.sign(tx.txhex, tx.utxos));
	}

	public sign(txhex: string, utxos: BitcoinUTXO[]): Promise<string> {
		return new Promise((resolve, reject) => {
			this.updateData();

			const bsign: BitcoinSignOptions = {
				scripttype: null,
				pubkeys: [],
				utxos: utxos
			};

			switch (this.signConfig.type) {
				case 'multi':
					bsign.scripttype = this.signConfig.transaction.scripttype;
					bsign.pubkeys = this.signConfig.transaction.pubkeys;
					bsign.n = this.signConfig.transaction.n;
					break;
				case 'verify':
					bsign.scripttype = this.signConfig.tltransaction.scripttype;
					bsign.pubkeys = this.signConfig.tltransaction.pubkeys;
					if (this.signConfig.tltransaction.wallet.ismultisig)
						bsign.n = this.signConfig.tltransaction.n;
					break;
				case 'single':
					bsign.scripttype = this.signConfig.wallet.scripttype;
					bsign.pubkeys = this.signConfig.wallet.pubkeys;
			}

			// TODO: il problema sta qua, useBackup non e' definito!

			if (this.model.hardware && this.model.hardwareType == 'ledgernanos') {
				const ledgerWaitCallback = (phase, status) => {
					setTimeout(() => {
						this.ledgerWaitStatus = {
							...this.ledgerWaitStatus, ...{
								phase: phase,
								status: status
							}
						};
					});
				};

				if (this.signConfig.type == 'verify' && this.signConfig.tltransaction.onlycheck) {
					return this.bitcoinLedgerService.getPublicKey(ledgerWaitCallback).then(pubkey => {
						if (this.signConfig.tltransaction.pubkeys.indexOf(pubkey) != -1)
							return resolve('');
						else
							setTimeout(() => { reject('XHW1') });
					});
				}

				this.bitcoinLedgerService.sign(txhex, bsign, ledgerWaitCallback).then(txhex => {
					resolve(txhex);
				}).catch(_ => {
					// eslint-disable-next-line no-console
					console.log(_);
					setTimeout(() => { reject('XHW1') });
				});
			} else if (!this.model.hardware && !this.model.useBackup) {
				const keys: BitcoinKeys = mnemonicToKeys(this.model.mnemonic);

				if (bsign.pubkeys.indexOf(keys.public) == -1)
					return reject('XIM');

				if (this.signConfig.type == 'verify' && this.signConfig.tltransaction.onlycheck)
					return resolve('');

				bsign.seed = this.model.mnemonic;
				this.bitcoinService.sign(txhex, bsign).then(txhex => resolve(txhex)).catch(err => reject('E'));
			} else if (!this.model.hardware && this.model.useBackup) {
				if (this.model.backup.file === null)
					return reject('XNF');

				let keys: BitcoinKeys;
				try {
					keys = decryptBackup(this.model.backup.data, this.model.backup.password, this.model.multisig);
					bsign.wif = keys.private;
				} catch (err) {
					return reject(err);
				}

				if (!this.model.multisig && bsign.pubkeys.indexOf(keys.public) == -1)
					return reject('XWA');

				if (this.signConfig.type == 'verify' && this.signConfig.tltransaction.onlycheck)
					return resolve('');

				this.bitcoinService.sign(txhex, bsign).then(txhex => resolve(txhex)).catch(_ => reject('E'));
			}
		});
	}

	loadBackupFile(file: File) {
		this.model.backup.file = file;

		loadBackup(file).then(data => {
			this.model.backup.data = data;
		}).catch(_ => { });
	}

	updateData() {
		switch (this.signConfig.type) {
			case 'multi':
				this.model.multisig = true;

				if ('hardwareadmins' in this.signConfig.transaction && this.signConfig.transaction.hardwareadmins.indexOf(this.email) != -1) {
					this.model.hardwareType = this.signConfig.transaction.hardwaretypes[this.signConfig.transaction.hardwareadmins.indexOf(this.email)];
					this.model.hardware = this.model.hardwareType != 'none';
				}
				break;
			case 'verify':
				this.model.multisig = this.signConfig.tltransaction.wallet.ismultisig;

				if (this.model.multisig && 'hardwareadmins' in this.signConfig.tltransaction && this.signConfig.tltransaction.hardwareadmins.indexOf(this.email) != -1) {
					this.model.hardwareType = this.signConfig.tltransaction.hardwaretypes[this.signConfig.tltransaction.hardwareadmins.indexOf(this.email)];
					this.model.hardware = this.model.hardwareType != 'none';
				} else if (!this.model.multisig) {
					this.model.hardware = ['ledgernanos'].indexOf(this.signConfig.tltransaction.wallet.hardware || 'none') != -1;
					this.model.hardwareType = this.signConfig.tltransaction.wallet.hardware;
				}
				break;
			case 'single':
				this.model.multisig = false;

				this.model.hardware = ['ledgernanos'].indexOf(this.signConfig.wallet.hardware || 'none') != -1;
				this.model.hardwareType = this.signConfig.wallet.hardware;
		}
	}

	ngOnChanges(changes) {
		if (!this.signConfig || (!this.signConfig.wallet && !this.signConfig.tltransaction && !this.signConfig.transaction))
			return;

		this.updateData();

		this.model.useBackup = this.signConfig.forceBackup;
	}

	ngOnInit() {
		this.username = getLocalStorage().getItem('username');
		this.email = getLocalStorage().getItem('email');
	}
}
