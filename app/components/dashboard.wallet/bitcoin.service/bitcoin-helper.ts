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

import { Payment, payments, ECPair, Network, ECPairInterface, address } from 'bitcoinjs-lib';
import AES from 'crypto-js/aes';
import AppSettings from 'app/app.settings';

export const ONESATOSHI = 0.00000001;

export interface BitcoinSignService {
	sign(txhex: string, options: BitcoinSignOptions, callback?): Promise<string>;
}

export type BitcoinKeys = { private: string; public: string; pair: ECPairInterface };

export type BackupFileMultisig = {
	pubkeysrv: string;
	walletid: string;
	label: string;
	organization: string;
};

export type BackupFileSingle = {
	address: string;
	pubkeys: string[];
};

export type BackupFile = (BackupFileSingle | BackupFileMultisig) & {
	user: string;
	scripttype: BitcoinScriptType;
	encprivkey: string;
	pubkey: string;
};


export type BitcoinUTXO = { value: number; tx: string; n: number };

export type BitcoinScriptType = 'p2wsh' | 'p2sh' | 'p2sh-p2wsh';

export type BitcoinSignOptions = {
	seed?: string;
	wif?: string;
	n?: number;
	scripttype: BitcoinScriptType;
	utxos: BitcoinUTXO[];
	pubkeys: string[];
};



export function checkBitcoinAddress(addr: string, network = AppSettings.network): boolean {
	try {
		address.toOutputScript(addr, network);
		return true;
	} catch (e) {
		return false;
	}
}


/* Decrypt key */
export function decryptKeys(encpriv: string, password: string): BitcoinKeys | null {
	const hex2a = function (hex) {
		let str = '';
		for (let i = 0; i < hex.length; i += 2)
			str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		return str;
	};

	const privkeye = AES.decrypt(encpriv, password, { iv: password });
	const privkey = hex2a(privkeye.toString());

	let upair = null;
	try {
		upair = ECPair.fromWIF(privkey, AppSettings.network);
	} catch (e) {
		return null;
	}

	const priv = upair.toWIF();
	const pub = upair.publicKey.toString('hex');

	return { private: priv, public: pub, pair: upair };
}

export function decryptBackup(backup: BackupFile, password: string, multisig: boolean = false): BitcoinKeys {
	if (backup === null)
		throw "XNJ";

	if (!('encprivkey' in backup) || !('pubkey' in backup))
		throw "XNJ";
	if (!multisig && !('address' in backup))
		throw "XNJ";
	if (multisig && !('walletid' in backup))
		throw "XNJ";

	const keys: BitcoinKeys = decryptKeys(backup.encprivkey, password);
	if (keys == null)
		throw "XWP";

	if (keys.public != backup.pubkey)
		throw "XWP";

	return keys
}

/* Encrypt key */
export function encryptKeys(privateKey: string, password: string): string {
	const ence = AES.encrypt(privateKey, password, { iv: password });
	return ence.toString();
}

export function loadBackup(file: File): Promise<BackupFile> {
	return new Promise((resolve, reject) => {
		if (file === null)
			return reject(null);

		const reader = new FileReader();

		reader.onload = (event: any) => {
			const data = event.target.result;
			try {
				resolve(JSON.parse(data));
			} catch (err) {
				reject(err);
			}
		};
		reader.readAsText(file);
	});
}

export function randomBytes(size: number): Buffer {
	const Buffer = require('safe-buffer').Buffer
	const crypto = (global as any).crypto || (global as any).msCrypto;
	// phantomjs needs to throw
	if (size > 65536) throw new Error('requested too many random bytes')
	// in case browserify  isn't using the Uint8Array version
	const rawBytes = new global.Uint8Array(size)

	// This will not work in older browsers.
	// See https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
	if (size > 0) {
		// getRandomValues fails on IE if size == 0
		crypto.getRandomValues(rawBytes)
	}

	return Buffer.from(rawBytes);
}

export function toHexString(buffer: Buffer): string {
	return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

export function toByteArray(hexString: string): Buffer {
	const Buffer = require('safe-buffer').Buffer
	const result = Buffer.alloc(hexString.length / 2);
	let i = 0;
	while (hexString.length >= 2) {
		result[i] = parseInt(hexString.substring(0, 2), 16);
		i += 1;
		hexString = hexString.substring(2, hexString.length);
	}
	return result;
}

export function compressPublicKey(pk: string): string {
	return toHexString(ECPair.fromPublicKey(toByteArray(pk)).publicKey);
}

export type Scripts = {
	address: string;
	scripttype: BitcoinScriptType;
	p2sh?: Payment;
	p2wsh?: Payment;
};

export function prepareScripts(scripttype: BitcoinScriptType, n: number, pubkeys: string[], network: Network): Scripts {
	const pubkeysRaw = pubkeys.map(hex => Buffer.from(hex, 'hex'));
	const p2ms = payments.p2ms({ m: n, pubkeys: pubkeysRaw, network: network });

	switch (scripttype) {
		case 'p2sh': {
			const p2sh = payments.p2sh({ redeem: p2ms, network: network });
			const res: Scripts = {
				address: p2sh.address,
				scripttype: scripttype,
				p2sh: p2sh
			};
			return res;
		}

		case 'p2sh-p2wsh': {
			const p2wsh = payments.p2wsh({ redeem: p2ms, network: network });
			const p2sh = payments.p2sh({ redeem: p2wsh, network: network });
			const res: Scripts = {
				address: p2sh.address,
				scripttype: scripttype,
				p2sh: p2sh,
				p2wsh: p2wsh
			};
			return res;
		}

		case 'p2wsh': {
			const p2wsh = payments.p2wsh({ redeem: p2ms, network: network });
			const res: Scripts = {
				address: p2wsh.address,
				scripttype: scripttype,
				p2wsh: p2wsh
			};
			return res;
		}
	}
}



/* Random keypair */
export function randomKeys(): BitcoinKeys {
	const pair2 = ECPair.makeRandom({ network: AppSettings.network, rng: randomBytes });
	const priv2 = pair2.toWIF();
	const pub2 = pair2.publicKey.toString('hex');

	return { private: priv2, public: pub2, pair: pair2 };
}

export function scriptTypeOfBitcoinScriptType(st: BitcoinScriptType) {
	switch (st) {
		case 'p2sh':
			return 'p2sh-p2pkh';
		case 'p2sh-p2wsh':
			return 'p2sh-p2wsh-p2pk';
		case 'p2wsh':
			return 'p2wsh-p2pkh';
	}
}

export function evaluteFee(fees, inputs, outputs, fast) {
	let speed = 'halfHourFee';
	if (fast) speed = 'fastestFee';

	return (outputs * 34 + inputs * 180 + 10) * fees[speed] / 100000000.0;
}