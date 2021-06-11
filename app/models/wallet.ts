import { ObjectId, unwrap, ISODate } from "./common";
import { BitcoinScriptType, BitcoinUTXO } from "../components/dashboard.wallet/bitcoin.service/bitcoin-helper";
import AppSettings from "../app.settings";
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TLTransaction {
	wallet: {
		id: string;
		address: string;
		ismultisig: boolean;
		label: string;
		hardware: HardwareWalletType;
	};
	txid: string;
	status: WalletVerificationStatus;
	scripttype: BitcoinScriptType;
	onlycheck: boolean;
	pubkeys: string[];
	hardwareadmins: string[];
	hardwaretypes: HardwareWalletType[];
	signers: string[];
	admins: string[];
	_id: string;
	utxos: BitcoinUTXO[];
	time: ISODate;
	from: string;
	to: string;
	toalternative: string;
	n: number;
	locktime: number;
	hex: string;
	recoveryhex: string;
}


export interface WithdrawFees {
	fees: number;
	fastest: number;
	slowest: number;
	hour: number;
	halfhour: number;
}

export interface WithdrawData {
	value: number;
	destination: string;
	fee: number;
	description?: string;
	ror?: ObjectId;
}

export interface WithdrawReply {
	utxos: BitcoinUTXO[];
	txhex: string;
}

export type HardwareWalletType = 'ledgernanos' | 'none';

export type WalletVerificationStatus = 'signing' | 'signed' | 'creation';

export interface Wallet {
	_id: ObjectId;
	address: string;
	scripttype: BitcoinScriptType;
	pubkeys: string[];
	ismultisig: boolean;
	hardware: HardwareWalletType;
	hardwareadmins?: string[];
	hardwaretypes?: HardwareWalletType[];
	label: string;
	pubkeysrv: string;
	active: boolean;
	multisig: {
		active: boolean;
		doneadmins: string[];
		n: number;
		admins: string[];
	};
}

export interface TransactionPublic {
	_id: ObjectId;
	txid: string;
	from: string;
	to: string;
	status: 'confirmed' | 'broadcasted' | 'signing' | 'signed' | 'waiting' | 'hidden' | 'doublespent' | 'refused';
	fee: number;
	description: string;
	time: ISODate;
	value: number;
}

export interface Transaction extends TransactionPublic {
	scripttype: BitcoinScriptType;
	pubkeys: string[];
	hardwareadmins: string[];
	hardwaretypes: HardwareWalletType[];
	signers: string[];
	refused: string[];
	admins: string[];
	n: number;
	hex: string;
	value_historic: {
		eur?: number;
		usd?: number;
		gbp?: number;
	};
	wallet: {
		id: ObjectId;
		label: string;
		address: string;
	};
	ror?: ObjectId;
}

export interface WalletLoadData {
	wallets: Wallet[];
	receiveaddress: string;
	adminof: Wallet[];
}

export interface WalletBalance {
	balance: number;
	unconfirmed: number;
	received: number;
}

export interface WalletList {
	wallets: Wallet[];
	adminof: Wallet[];
	receiveaddress: string;
}

export interface WalletTransaction {
	txid: string;
	value: number;
	time: ISODate;
	confirmations: number;
	in: boolean;
}


export interface DonationReply extends WithdrawReply {
	fee: number;
	value: number;
	donation: ObjectId;
}

export interface DonationRequest {
	address: string;
	value: number;
	users: { [user: string]: number }[];
	fee: number;
}

export interface WalletVerificationHistory {
	status: WalletVerificationStatus;
	time: string;
	value: number;
	locktime: number;
	signers: number;
	admins: number;
}

export interface WalletVerification {
	address: string;
	label: string;
	ismultisig: boolean;
	lastverify: string;
	scripttype: BitcoinScriptType;
	hardware: HardwareWalletType;
	history: WalletVerificationHistory[];
}

export interface WalletVerificationResponse {
	verifications: WalletVerification[];
}

export interface WalletPendingVerification {
	_id: string;
	status: WalletVerificationStatus;
	time: string;
	value: number;
	locktime: number;
	wallet: {
		id: string;
		label: string;
		address: string;
		ismultisig: boolean;
	};
}

export interface WalletPendingVerificationsResponse {
	pending: WalletPendingVerification[];
}

@Injectable({
	providedIn: 'root'
})
export class WalletService {
	public onReload: EventEmitter<void> = new EventEmitter();
	public onLoad: EventEmitter<WalletLoadData> = new EventEmitter();

	constructor(private http: HttpClient) { }

	create(scripttype: BitcoinScriptType, pubkeys: string[], hardware: boolean, hardwaretype: string): Observable<Wallet> {
		return this.http.post<Wallet>(AppSettings.apiUrl + '/wallet/create', {
			scripttype: scripttype,
			hardware: hardware,
			hardwaretype: hardwaretype,
			pubkeys: pubkeys
		});
	}

	createMultisig(scripttype: BitcoinScriptType, label: string, n: number, admins: string[]): Observable<Wallet> {
		return this.http.post<Wallet>(AppSettings.apiUrl + '/wallet/multisig/create', {
			scripttype: scripttype,
			label: label,
			n: n,
			admins: admins
		});
	}

	createEventDonation(event: ObjectId, donreq: DonationRequest): Observable<DonationReply> {
		return this.http.post<DonationReply>(AppSettings.apiUrl + '/donation/event/' + event + '/create', donreq);
	}

	withdraw(address: string, wData: WithdrawData): Observable<WithdrawReply> {
		return this.http.post<WithdrawReply>(AppSettings.apiUrl + '/wallet/' + address + '/withdraw', wData);
	}


	withdrawFees(address: string, destination: string, value: number): Observable<WithdrawFees> {
		const wData = {
			value: value,
			destination: destination
		};
		return this.http.post<WithdrawFees>(AppSettings.apiUrl + '/wallet/' + address + '/withdraw/fees', wData);
	}


	withdrawDistributionFees(address: string, distribution: { [user: string]: number }, value: number): Observable<WithdrawFees> {
		const wData = {
			value: value,
			distribution: distribution
		};
		return this.http.post<WithdrawFees>(AppSettings.apiUrl + '/wallet/' + address + '/withdraw/fees', wData);
	}

	sendTransaction(address: string, txhex: string, donation?: string): Observable<string> {
		const data: { txhex: string; donation?: string } = { txhex: txhex };
		if (donation)
			data.donation = donation;

		return this.http.post<string>(AppSettings.apiUrl + '/wallet/' + address + '/send', data)
			.pipe(unwrap('txid'));
	}

	get(address: string): Observable<Wallet> {
		return this.http.get<Wallet>(AppSettings.apiUrl + '/wallet/' + address);
	}

	getList(ignoreLoadingBar: boolean = false): Observable<WalletList> {
		return this.http.get<WalletList>(AppSettings.apiUrl + '/wallet',
			{ headers: { ignoreLoadingBar: String(ignoreLoadingBar) } });
	}

	getTransaction(txid: string): Observable<Transaction> {
		return this.http.get<Transaction>(AppSettings.apiUrl + '/transaction/' + txid);
	}

	getTransactions(address: string): Observable<WalletTransaction[]> {
		return this.http.get<WalletTransaction[]>(AppSettings.apiUrl + '/wallet/' + address + '/txs',
			{ headers: { ignoreLoadingBar: String(true) } })
			.pipe(unwrap('txs'));
	}

	getMultisigTransactions(): Observable<Transaction[]> {
		return this.http.get<Transaction[]>(AppSettings.apiUrl + '/wallet/multisig/txs',
			{ headers: { ignoreLoadingBar: String(true) } })
			.pipe(unwrap('txs'));
	}

	getBalance(address: string): Observable<WalletBalance> {
		return this.http.get<WalletBalance>(AppSettings.apiUrl + '/wallet/' + address + '/balance',
			{ headers: { ignoreLoadingBar: String(true) } });
	}

	getFaucet(address: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/wallet/' + address + '/faucet', {});
	}

	delete(address: string): Observable<void> {
		return this.http.delete<void>(AppSettings.apiUrl + '/wallet/' + address);
	}

	updateReceive(address: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/wallet/' + address + '/update', { receive: true });
	}

	updateLabel(address: string, label: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/wallet/' + address + '/update', { label: label });
	}

	feedMultisig(wallet: string, publicKey: string, hardware: boolean, hardwaretype: string): Observable<Wallet> {
		return this.http.post<Wallet>(AppSettings.apiUrl + '/wallet/multisig/feed', { hardware: hardware, hardwaretype: hardwaretype, pubkey: publicKey, wallet: wallet });
	}

	signMultisigTransaction(txid: string, txhex: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/wallet/multisig/' + txid + '/sign', { txhex: txhex });
	}

	refuseMultisigTransaction(txid: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/wallet/multisig/' + txid + '/refuse', {});
	}

	deleteMultisigTransaction(txid: string): Observable<void> {
		return this.http.delete<void>(AppSettings.apiUrl + '/wallet/multisig/' + txid,
			{ headers: { ignoreLoadingBar: String(true) } });
	}

	getWalletVerificationList(): Observable<WalletVerificationResponse> {
		return this.http.get<WalletVerificationResponse>(AppSettings.apiUrl + '/wallet/verify/list',
			{ headers: { ignoreLoadingBar: String(true) } });
	}

	getWalletVerificationPending(): Observable<WalletPendingVerificationsResponse> {
		return this.http.get<WalletPendingVerificationsResponse>(AppSettings.apiUrl + '/wallet/verify/pending',
			{ headers: { ignoreLoadingBar: String(true) } });
	}

	startWalletVerification(address: string): Observable<TLTransaction> {
		return this.http.post<TLTransaction>(AppSettings.apiUrl + '/wallet/' + address + '/verify/start', {});
	}

	getTLTransaction(id: string): Observable<TLTransaction> {
		return this.http.get<TLTransaction>(AppSettings.apiUrl + '/wallet/verify/' + id);
	}

	feedTLTransaction(address: string, txhex: string, rechex: string): Observable<TLTransaction> {
		return this.http.post<TLTransaction>(AppSettings.apiUrl + '/wallet/' + address + '/verify/feed', {
			txhex: txhex,
			recoveryhex: rechex
		});
	}

	signTLTransaction(address: string, txhex: string, rechex: string): Observable<TLTransaction> {
		return this.http.post<TLTransaction>(AppSettings.apiUrl + '/wallet/' + address + '/verify/sign', {
			txhex: txhex,
			recoveryhex: rechex
		});
	}
}