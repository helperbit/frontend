import { UtilsService } from './utils';
import { parseNumber, roundNumber, getLocalStorage } from '../shared/helpers/utils';
import { Injectable, EventEmitter } from '@angular/core';

const currencySymbols = {
	crypto: {
		btc: {
			full: '\u0E3F',
			sat: 'SAT',
			msat: 'MSAT'
		}
	},
	fiat: {
		eur: {
			full: '\u20AC'
		},
		usd: {
			full: '\u0024'
		}
	}
};

export function fromSATtoBTC(SAT: number, maxRound?: number) {
	if (!maxRound)
		maxRound = 8;

	const btc = (SAT / 100000000);

	return btc;
	// return roundNumber(btc, maxRound);
}

export function fromMSATtoBTC(MSAT: number, maxRound?: number) {
	if (!maxRound)
		maxRound = 8;

	const btc = (MSAT / (1000 * 100000000));

	return btc;
	// return roundNumber(btc, maxRound);
}

export function fromBTCtoSAT(BTC) {
	return Math.round(BTC * 100000000);
}

export function fromBTCtoMSAT(BTC) {
	return Math.round(BTC * (1000 * 100000000));
}


export interface Fees {
	fastestFee: number;
	halfHourFee: number;
	hourFee: number;
	slowest?: number;
}

export interface Prices {
	usd: number;
	eur: number;
	cny: number;
	gbp: number;
	cad: number;
	rub: number;
	hkd: number;
	jpy: number;
	aud: number;
	btc: number;
}

export interface CurrencyConfig {
	code: string;
	symbol: string;
	value: number;
	name: string;
}

@Injectable({
	providedIn: 'root'
})
export class CurrencyService {
	public onCurrencyChange: EventEmitter<CurrencyConfig> = new EventEmitter();
	public onPriceChange: EventEmitter<void> = new EventEmitter();

	isInit: boolean;
	btcprice: Prices;
	fees: Fees;
	currencies: { [currency: string]: CurrencyConfig };
	currency: CurrencyConfig;

	constructor() {
		this.isInit = false;

		this.btcprice = {
			"usd": 0,
			"eur": 0,
			"cny": 0,
			"gbp": 0,
			"cad": 0,
			"rub": 0,
			"hkd": 0,
			"jpy": 0,
			"aud": 0,
			"btc": 1
		};
		this.fees = { "fastestFee": 14, "halfHourFee": 10, "hourFee": 8, "slowest": 4 };
		this.currency = { code: 'BTC', symbol: '\u0E3F', value: 1.0, name: 'bitcoin' };
	}

	/* NEVER USED 
	fetchPrices(ignoreLoadingBar: boolean = true): Observable<Prices> {
		return deserializeCall<Prices>(this.http.get(this.config.apiUrl + '/blockchain/prices', { cache: true, ignoreLoadingBar: ignoreLoadingBar }));
	}

	fetchFees(ignoreLoadingBar: boolean = true): Observable<Fees> {
		return deserializeCall<Fees>(this.http.get(this.config.apiUrl + '/blockchain/fees', { ignoreLoadingBar: ignoreLoadingBar }));
	}
	*/

	convertCurrency(value: number, from: string, to: string, toParseNumber?: boolean, symbol?: boolean) {
		/*
			from/to: ['crypto', 'fiat'],
			fromWhat/toWhat: ['btc', 'eth', 'eur', 'usd'],
			fromFormat/toFormat: ['full', 'sat', 'msat'],
			toParseNumber: [true, false]

			check from
				btc, eth, sat, msat -> crypto
				eur, usd -> fiat

		*/
		if (value === undefined) return;

		const fromFIATtoBTC = (value, fiat, maxRound) => {
			if (!maxRound)
				maxRound = 8;

			return value / this.btcprice[fiat];
			// return roundNumber(value / this.btcprice[fiat], maxRound);
		};

		const fromBTCtoFIAT = (value, fiat) => {
			return Number((value * this.btcprice[fiat]).toFixed(2));
		};


		value = Number(value);

		const crypto = ['btc', 'sat', 'msat', 'eth'];
		const fiat = ['eur', 'usd'];

		//define from properties
		let fromType = null;
		let fromWhat = null;
		let fromFormat = null;

		if (crypto.indexOf(from) != -1) {
			fromType = 'crypto';

			if (from == 'sat' || from == 'msat') {
				fromWhat = 'btc';
				fromFormat = from;
			}
			else {
				fromWhat = from;
				fromFormat = 'full';
			}
		}
		else if (fiat.indexOf(from) != -1) {
			fromType = 'fiat';
			fromWhat = from;
			fromFormat = 'full';
		}

		//define to properties
		let toType = null;
		let toWhat = null;
		let toFormat = null;

		if (crypto.indexOf(to) != -1) {
			toType = 'crypto';

			if (to == 'sat' || to == 'msat') {
				toWhat = 'btc';
				toFormat = to;
			}
			else {
				toWhat = to;
				toFormat = 'full';
			}
		}
		else if (fiat.indexOf(to) != -1) {
			toType = 'fiat';
			toWhat = to;
			toFormat = 'full';
		}

		const conversion = {
			from: {
				crypto: {
					btc: {
						full: val => val,
						sat: val => fromSATtoBTC(val),
						msat: val => fromMSATtoBTC(val)
					}
				},
				fiat: {
					eur: {
						full: val => fromFIATtoBTC(val, 'eur', 11)
					},
					usd: {
						full: val => fromFIATtoBTC(val, 'usd', 11)
					}
				}
			},
			to: {
				crypto: {
					btc: {
						full: val => val,
						sat: val => fromBTCtoSAT(val),
						msat: val => fromBTCtoMSAT(val)
					}
				},
				fiat: {
					eur: {
						full: val => fromBTCtoFIAT(val, 'eur')
					},
					usd: {
						full: val => fromBTCtoFIAT(val, 'usd')
					}
				}
			}
		};

		const btc = conversion.from[fromType][fromWhat][fromFormat](value);
		let res = conversion.to[toType][toWhat][toFormat](btc);

		if (toParseNumber)
			res = parseNumber(res);

		if (symbol)
			if (toWhat == 'btc' && toFormat == 'full')
				res = roundNumber(res, 11) + ' ' + currencySymbols[toType][toWhat][toFormat];
			else
				res = res + ' ' + currencySymbols[toType][toWhat][toFormat];

		return res;
	}

	detectCurrency() {
		let loc = window.navigator.language.split('-')[1] || 'BTC';

		if (getLocalStorage().getItem('currency'))
			loc = getLocalStorage().getItem('currency');

		//ngIntlTelInputProvider.set ({ initialCountry: loc.toLowerCase () });

		this.currencies = {
			'USD': { code: 'USD', symbol: '\u0024', value: this.btcprice.usd, name: 'dollar' },
			'EUR': { code: 'EUR', symbol: '\u20AC', value: this.btcprice.eur, name: 'euro' },
			'RUB': { code: 'RUB', symbol: '\u20BD', value: this.btcprice.rub, name: 'rublo' },
			'BTC': { code: 'BTC', symbol: '\u0E3F', value: 1.0, name: 'bitcoin' }
		};

		let r = this.currencies['BTC'];
		if (loc == 'USD' || loc == 'US')
			r = this.currencies['USD'];
		else if (loc == 'EUR' || loc == 'IT')
			r = this.currencies['EUR'];
		else if (loc == 'RUB' || loc == 'RU')
			r = this.currencies['RUB'];

		getLocalStorage().setItem('currency', r.code);
		this.currency = r;
		return r;
	}

	getCurrency(): CurrencyConfig {
		return this.currency;
	}

	getCurrencyCode(): string {
		return this.currency.code;
	}

	setCurrency(currency) {
		this.currency = this.currencies[currency];
		getLocalStorage().setItem('currency', this.currencies[currency].code);
		this.onCurrencyChange.emit(this.currency);
	}


	init(utilsService: UtilsService) {
		this.currency = this.detectCurrency();
		utilsService.getPlatformInfoBase().subscribe(info => {
			this.btcprice = info.prices;
			this.fees = info.fees;
			this.currency = this.detectCurrency();
			this.onPriceChange.emit();
			this.onCurrencyChange.emit(this.currency);
			this.isInit = true;
		});
	}
}
