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

import { WalletService, HardwareWalletType } from "../../models/wallet";
import { TranslateService } from '@ngx-translate/core';
import {BitcoinLedgerService} from "./bitcoin.service/ledger";
import { BitcoinService, createMnemonicChallenge, checkMnemonicChallenge, generateMnemonicPhrase } from "./bitcoin.service/mnemonic";
import { PageHeaderConfig } from "../../shared/components/page-header/page-header";
import { BitcoinScriptType } from "./bitcoin.service/bitcoin-helper";
import { LedgerWaitStatus } from "./widgets/ledger-wait/ledger-wait";
import { BrowserHelperService } from '../../services/browser-helper';
import { DashboardService } from '../../models/dashboard';
import { NgWizardStep } from '../../shared/helpers/ng-wizard-step';
import { ActivatedRoute } from '@angular/router';

export class CreateWallet {
	public onFirstStep: boolean = true;
	pageHeader: PageHeaderConfig;
	username: string;
	rnd: string;

	model: {
		ledgerSupport: boolean;
		accept: boolean;
		hardwareWallet: boolean;
		hardwareWalletType: HardwareWalletType;
		hardwareWalletPublicKey: string;
		mnemonic: string;
		mnemonicConfirmChallenge: any[];
		backupPassword: string;
		backupPasswordRepeat: string;
		scripttype: BitcoinScriptType;
		downloadedBackup: boolean;
		file?: any;
		address: string;

		invalid: boolean;
		label?: string;
		organization?: string;
		labelShort?: string;
	};

	wizard: {
		step0: NgWizardStep<void>;
		step1Passphrase: NgWizardStep<void>;
		step1HardwareWallet: NgWizardStep<{ ledgerWaitStatus: LedgerWaitStatus; exec: () => void }>;
		step2Passphrase: NgWizardStep<void>;
		step3: NgWizardStep<{ passwordVisibility: string }>;
		step4: NgWizardStep<void>;
	};

	constructor(
		protected walletService: WalletService,
		protected route: ActivatedRoute,
		protected bitcoinService: BitcoinService,
		protected bitcoinLedgerService: BitcoinLedgerService,
		protected translate: TranslateService,
		protected browserHelperService: BrowserHelperService,
		protected dashboardService: DashboardService
	) {
		this.rnd = 'rnd' + Math.random() + '_';

		this.model = {
			invalid: false,
			ledgerSupport: browserHelperService.isLedgerSupported(),
			accept: false,
			hardwareWallet: false,
			hardwareWalletType: 'none',
			hardwareWalletPublicKey: '',
			mnemonic: generateMnemonicPhrase(),
			mnemonicConfirmChallenge: [],
			backupPassword: '',
			backupPasswordRepeat: '',
			scripttype: 'p2sh-p2wsh',
			downloadedBackup: false,
			file: null,
			address: ''
		};

		this.wizard = { step0: null, step1Passphrase: null, step1HardwareWallet: null, step2Passphrase: null, step3: null, step4: null };

		this.wizard.step0 = new NgWizardStep();
		this.wizard.step0.setTitles({
			main: this.translate.instant('Type'),
			heading: this.translate.instant('Choose wallet type')
		});


		this.wizard.step1Passphrase = new NgWizardStep();
		this.wizard.step1Passphrase.setTitles({
			main: this.translate.instant('Passphrase'),
			heading: this.translate.instant('Generate a random passphrase')
		});
		this.wizard.step1Passphrase.setNextInterceptor(() => {
			this.wizard.step2Passphrase.resetResponse();
			this.model.mnemonicConfirmChallenge = createMnemonicChallenge(this.model.mnemonic);
			this.wizard.step1Passphrase._next();
		});


		this.wizard.step1HardwareWallet = new NgWizardStep();
		this.wizard.step1HardwareWallet.setTitles({
			main: this.translate.instant('Hardware Wallet'),
			heading: this.translate.instant('Pair your hardware wallet')
		});
		this.wizard.step1HardwareWallet.initializeModel({
			ledgerWaitStatus: {
				phase: 0,
				status: 'wait'
			},
			exec: () => { this.pairHardwareWallet(); }
		});
		this.wizard.step1HardwareWallet.setNextInterceptor(() => {
			this.wizard.step1HardwareWallet._next();
			this.wizard.step1HardwareWallet._next();
		});


		this.wizard.step2Passphrase = new NgWizardStep();
		this.wizard.step2Passphrase.setTitles({
			main: this.translate.instant('Confirm'),
			heading: this.translate.instant('Prove you have written down your passphrase')
		});
		this.wizard.step2Passphrase.setNextInterceptor(() => {
			this.wizard.step2Passphrase.resetResponse();

			if (!checkMnemonicChallenge(this.model.mnemonicConfirmChallenge)) 
				// return $timeout(() => {
				return this.wizard.step2Passphrase.setResponse('error', { error: 'XM1' });
			// });

			this.wizard.step2Passphrase._next();
		});


		this.wizard.step3 = new NgWizardStep();
		this.wizard.step3.setTitles({
			main: this.translate.instant('Backup'),
			heading: this.translate.instant('Create a signature backup file')
		});
		this.wizard.step3.initializeModel({
			passwordVisibility: 'password'
		});


		this.wizard.step4 = new NgWizardStep();
		this.wizard.step4.setTitles({
			main: this.translate.instant('Done'),
			heading: this.translate.instant('Done')
		});
	}

	pairHardwareWallet() {
		const ledgerWaitCallback = (phase, status) => {
			// this.$timeout(() => {
			this.wizard.step1HardwareWallet.model.ledgerWaitStatus = {
				...this.wizard.step1HardwareWallet.model.ledgerWaitStatus, ...{
					phase: phase,
					status: status
				}
			};
			// });
		};

		this.wizard.step1HardwareWallet.loading = true;

		this.bitcoinLedgerService.getPublicKey(ledgerWaitCallback).then(pk => {
			// return this.$timeout(() => {
			this.wizard.step1HardwareWallet.loading = false;
			this.model.hardwareWalletPublicKey = pk;
			this.model.accept = true;
			this.wizard.step1HardwareWallet.setResponse('success', {
				text: this.translate.instant('Hardware Wallet successfully paired')
			});
			// });
		}).catch((err) => {
			// return this.$timeout(() => {
			this.model.hardwareWalletPublicKey = null;
			this.wizard.step1HardwareWallet.loading = false;
			// this.wizard.step1HardwareWallet.setResponse ('error', { error: 'XHW1' });
			// });
		});
	}

	downloadBackup() {
		this.model.downloadedBackup = true;
	}

	renewMnemonic() {
		this.model.mnemonic = generateMnemonicPhrase();
	}

	printMnemonic() {
		const oldtitle = document.title;
		document.title = 'helperbit_passphrase_' + this.username + '.pdf';
		window.print();
		document.title = oldtitle;
	}


	selectWalletType(wt: 'ledger' | 'mnemonic') {
		if (wt == 'ledger') {
			this.model.hardwareWallet = true;
			this.model.hardwareWalletType = 'ledgernanos';
		} else if (wt == 'mnemonic') {
			this.model.hardwareWallet = false;
			this.model.hardwareWalletType = 'none';
		}

		this.model.accept = false;
		this.wizard.step0.reset();
		setTimeout(() => this.wizard.step0.next(), 0);
	}
}
