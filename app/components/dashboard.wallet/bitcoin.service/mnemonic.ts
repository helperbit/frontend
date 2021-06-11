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

import { ECPair, Psbt } from 'bitcoinjs-lib';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { fromSeed } from 'bip32';
import { BitcoinSignService, randomBytes, BitcoinSignOptions, BitcoinKeys } from './bitcoin-helper';
import AppSettings from '../../../app.settings';
import { Injectable } from '@angular/core';

export type MnemonicChallenge = { index: number; correct: string; insert: string }[];

export function checkMnemonicChallenge(challenge: MnemonicChallenge) {
	for (let i = 0; i < challenge.length; i++) {
		if (challenge[i].correct != challenge[i].insert) {
			return false;
		}
	}
	return true;
}

export function createMnemonicChallenge(mnemonic: string): MnemonicChallenge {
	const mn2 = mnemonic.split(' ');
	const el1 = Math.floor(Math.random() * 4);
	const el2 = Math.floor(Math.random() * 4);
	const el3 = Math.floor(Math.random() * 4);
	return [
		{ index: el1 + 1, correct: mn2[el1], insert: '' },
		{ index: el2 + 5, correct: mn2[4 + el2], insert: '' },
		{ index: el3 + 9, correct: mn2[8 + el3], insert: '' }
	];
}

/* Generate a new bip39 valid mnemonic */
export function generateMnemonicPhrase(): string {
	return generateMnemonic(128, randomBytes);
}

/* Return the keypair from a mnemonic */
export function mnemonicToKeys(secret: string): BitcoinKeys {
	const fixSeed = function (seed) {
		return seed
			.replace('%20', ' ')
			.replace('  ', ' ')
			.replace('\n', '')
			.replace('\r', '')
			.trim();
	};

	const seed = mnemonicToSeedSync(fixSeed(secret));
	const hd = ECPair.fromWIF(fromSeed(seed, AppSettings.network).toWIF(), AppSettings.network);
	const priv1 = hd.toWIF();
	const pub1 = hd.publicKey.toString('hex');
	return { private: priv1, public: pub1, pair: hd };
}


@Injectable()
export class BitcoinService implements BitcoinSignService {
	constructor() { }

	sign(txhex: string, options: BitcoinSignOptions): Promise<string> {
		if ('seed' in options)
			options.wif = mnemonicToKeys(options.seed).private;

		return new Promise((resolve, reject) => {
			const txb = Psbt.fromHex(txhex, { network: AppSettings.network });
			const upair = ECPair.fromWIF(options.wif, AppSettings.network);

			txb.signAllInputs(upair);
			resolve(txb.toHex());
		});
	}
}
