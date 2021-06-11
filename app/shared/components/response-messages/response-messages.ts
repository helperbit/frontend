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

import { TranslateService } from '@ngx-translate/core';
import { CurrencyService } from '../../../services/currency';
import {Component, Input, OnChanges} from '@angular/core';
import { MoneyPipe } from '../../../shared/filters/money';
import { TimediffPipe } from '../../../shared/filters/timediff';
import { DecimalPipe } from '@angular/common';

export interface ErrorResponseMessageAPI {
	error: string;
	message?: string;
	data?: any;
}

export interface ErrorResponseMessageConfig {
	error: string;
}

export interface ResponseMessageConfig {
	type?: 'error' | 'success' | 'warning' | 'info';
	fixed?: boolean;
	text?: string;
	error?: string;
}

export function buildResponseMessage(type: 'error' | 'success', data: any, fixed: boolean = false): ResponseMessageConfig {
	data.type = type;
	if (fixed) data.fixed = fixed;
	return data;
}

export function buildErrorResponseMessage(data: ErrorResponseMessageConfig, fixed: boolean = false): ResponseMessageConfig {
	return buildResponseMessage('error', data, fixed);
}

export function buildSuccessResponseMessage(data: any, fixed: boolean = false): ResponseMessageConfig {
	return buildResponseMessage('success', data, fixed);
}

export function buildGenericErrorResponseMessage(fixed: boolean = false): ResponseMessageConfig {
	return buildErrorResponseMessage({ error: 'E' }, fixed)
}

function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.substring(1);
}


@Component({
	selector: 'response-messages',
	templateUrl: 'response-messages.html',
	styleUrls: ['response-messages.scss']
})
export class ResponseMessagesComponent implements OnChanges {
	@Input() message: ResponseMessageConfig;

	config: {
		show: boolean;
		type: string;
		text: string;
		fixed: boolean;
	};
	messagesData: any;

	constructor(
		translate: TranslateService, 
		currencyService: CurrencyService,
		moneyPipe: MoneyPipe,
		decimalPipe: DecimalPipe,
		timediffPipe: TimediffPipe
	) {
		this.config = {
			show: false,
			type: '',
			text: '',
			fixed: false
		};

		this.messagesData = {
			error: {
				/* Common */
				'E': { text: (r) => translate.instant('Generic error') },
				'E1': { text: (r) => translate.instant('You\'re not authenticated. Please log-in first') },
				'E2': { text: (r) => translate.instant('Invalid user') },
				'E3': {
					text: (r) => {
						if (!r.data || !r.data.name)
							return translate.instant('Invalid parameters');

						switch (r.data.name) {
							case 'title': {
								return translate.instant('Empty title not allowed');
							}
							case 'description': {
								return translate.instant('Empty description not allowed');
							}
							case 'target': {
								return translate.instant('Target must be greater than 0.01 BTC');
							}
							default: {
								switch (r.data.reason) {
									case 'invalid': {
										return capitalizeFirstLetter(translate.instant(r.data.name)) + ' ' + translate.instant('has an invalid value or is incomplete');
									}
									case 'missing': {
										return capitalizeFirstLetter(translate.instant(r.data.name)) + ' ' + translate.instant('is empty');
									}
									case 'big': {
										return capitalizeFirstLetter(translate.instant(r.data.name)) + ' ' + translate.instant('should be lower than') + ' ' + (r.data.type == 'money' ? moneyPipe.transform(r.data.max) : r.data.max);
									}
									case 'small': {
										return capitalizeFirstLetter(translate.instant(r.data.name)) + ' ' + translate.instant('should be higher than') + ' ' + (r.data.type == 'money' ? moneyPipe.transform(r.data.min) : r.data.min);
									}
									case 'lbig': {
										return capitalizeFirstLetter(translate.instant(r.data.name)) + ' ' + translate.instant('should be shorter than') + ' ' + (r.data.type == 'money' ? moneyPipe.transform(r.data.max) : r.data.max);
									}
									case 'lsmall': {
										return capitalizeFirstLetter(translate.instant(r.data.name)) + ' ' + translate.instant('should be longer than') + ' ' + (r.data.type == 'money' ? moneyPipe.transform(r.data.min) : r.data.min);
									}
									case 'notmatch': {
										return capitalizeFirstLetter(translate.instant(r.data.name)) + ' ' + translate.instant('not match the value') + ' ' + (r.data.type == 'money' ? moneyPipe.transform(r.data.value) : r.data.value);
									}
									default: {
										return capitalizeFirstLetter(translate.instant(r.data.name)) + ' ' + translate.instant('not valid');
									}
								}
							}
						}
					}
				},
				'E4': { text: (r) => translate.instant('Not yet implemented') }, //TO CHANGE TRANSALATION
				'E5': { text: (r) => translate.instant('Incomplete social profile') }, //TO CHANGE TRANSALATION
				'E6': { text: (r) => translate.instant('You\'re not authorized') }, //TO CHANGE TRANSALATION
				'E7': { text: (r) => translate.instant('Invalid captcha') },
				'E8': { text: (r) => translate.instant('NPO Profile not complete') }, //TO CHANGE TRANSALATION
				'E9': { text: (r) => translate.instant('The domain @') + r.data.domainref + ' ' + translate.instant('is not equal to the organization domain @') + r.data.domain + '. ' + translate.instant('Please use a correct email') },

				/* Auth */
				'EA1': { text: (r) => translate.instant('Invalid activation url') },
				'EA2': { text: (r) => translate.instant('An account is already associated to this social id') }, //TO CHANGE TRANSALATION
				'EA3': { text: (r) => translate.instant('Account not active') },
				'EA4': { text: (r) => translate.instant('This user is not in the allowed admin list you submitted during verification') },
				'EA5': { text: (r) => translate.instant('You are banned from Helperbit') },

				/* Alert */
				'EAL1': { text: (r) => translate.instant('This week you have already sent an alert') },
				'EAL2': { text: (r) => translate.instant('You are not geolocalized') },

				/* Campaign */
				'EC1': { text: (r) => translate.instant('you already have a running campaign') }, //TO CHANGE TRANSALATION
				'EC2': { text: (r) => translate.instant('can\'t delete a running campaign') }, //TO CHANGE TRANSALATION
				'EC3': { text: (r) => translate.instant('campaign info are not yet completed') }, //TO CHANGE TRANSALATION
				'EC4': { text: (r) => translate.instant('invalid resource') }, //TO CHANGE TRANSALATION
				'EC5': { text: (r) => translate.instant('You set a target above the max permitted. The selected project needs') + ' ' + r.data.max.amount + ' ' + currencyService.currencies[r.data.max.currency].symbol },
				'EC6': { text: (r) => translate.instant('Can\'t edit a concluded campaign') }, //TO CHANGE TRANSALATION

				/* Login */
				'EL1': { text: (r) => translate.instant('Invalid email/password combination') },
				'EL2': { text: (r) => translate.instant('You typed wrong credentials too many times. Your account will be unlocked') + ' ' + timediffPipe.transform(r.data.expiration) },
				'EL3': { text: (r) => translate.instant('Your email address is not verified') },

				/* Media */
				'EM1': { text: (r) => translate.instant('The file has an invalid format. Supported formats are:') + ' ' + r.data.supported.reduce((t, v) => t += (', ' + v)) },
				'EM2': { text: (r) => translate.instant('The file is above the maximum file size of') + ' ' + decimalPipe.transform(r.data.value / 1024 / 1024, '1.0-2') + " MB" },
				'EM6': { text: (r) => translate.instant('Invalid file') },

				/* Most wanted NPO */
				'EMWN3': { text: (r) => translate.instant('Organization already submitted') },

				/* Projects */
				'EP1': { text: (r) => translate.instant('This wallet is already associated with one of your projects') },
				'EP2': { text: (r) => translate.instant('This event is already associated with one of your projects') },

				/* Reset */
				'ER1': { text: (r) => translate.instant('This email is not associated to any account') },
				'ER2': { text: (r) => translate.instant('Invalid reset link') },
				'ER3': { text: (r) => translate.instant('Expired reset link') },

				/* ROR */
				'EROR1': { text: (r) => translate.instant('There are already refund claims pending') },
				'EROR2': { text: (r) => translate.instant('Can\'t create a refund claim with this user') },
				'EROR3': { text: (r) => translate.instant('Can\'t remove this refund claim') },
				'EROR4': { text: (r) => translate.instant('You don\'t have a wallet to receive funds. Create one') },

				/* Signup */
				'ES1': { text: (r) => translate.instant('Username already registered') },
				'ES2': { text: (r) => translate.instant('Email already registered') },
				'ES4': { text: (r) => translate.instant('Password should be at least 8 character long') },
				'ES5': { text: (r) => translate.instant('Disposable email domains are not allowed') },

				/* User data edit */
				'EU1': { text: (r) => translate.instant('You can\'t geolocalize in the sea') },
				'EU2': { text: (r) => translate.instant('Invalid address') },

				/* Verification */
				'EV1': { text: (r) => translate.instant('Your profile is not complete (missing') + ' ' + r.data.fields + ')' },
				'EV3': { text: (r) => translate.instant('Locked fields are\'t editable') },
				'EV4': { text: (r) => translate.instant('Invalid code') },
				'EV5': { text: (r) => translate.instant('Your GPS position doesn\'t match with your geolocalization inputs') },
				'EV6': { text: (r) => translate.instant('Verification not completed') },

				/* Wallet */
				'EW1': { text: (r) => translate.instant('Not enough funds') },
				'EW2': { text: (r) => translate.instant('Bad address') },
				'EW6': { text: (r) => translate.instant('Max 10 addresses allowed') },
				'EW10': { text: (r) => translate.instant('Multisig wallets need at least n+1 admins').replace('n+1', '3') },
				'EW11': { text: (r) => translate.instant('Multisig wallets need at least 3 admins') },
				'EW14': { text: (r) => translate.instant('Multisig wallets can have maximum 10 admins') },
				'EW13': { text: (r) => translate.instant('This admin belongs to a multisig wallet') },
				'EW15': { text: (r) => translate.instant('Duplicated publickey: you can\'t use the same hardware wallet of another admin') },

				'XD': { text: (r) => translate.instant('Already present') },

				'XEPE': { text: (r) => translate.instant('Empty proof list') },
				'XEW': { text: (r) => translate.instant('The wallet is empty') },

				'XF1': { text: (r) => translate.instant('Empty description') },
				'XF2': { text: (r) => translate.instant('Empty email') },

				'XHW1': { text: (r) => translate.instant('Unable to get information from the hardware wallet') },

				'XIM': { text: (r) => translate.instant('Invalid passphrase') },

				'XM1': { text: (r) => translate.instant('You typed the wrong words') },

				'XNA': { text: (r) => translate.instant('Geolocalization not supported by your browser') },
				'XNF': { text: (r) => translate.instant('No backup file selected') },
				'XNI': { text: (r) => translate.instant('No image selected') },
				'XNJ': { text: (r) => translate.instant('Not a backup file') },
				'XNV': { text: (r) => translate.instant('Invalid amount value') },

				'XPM': { text: (r) => translate.instant('Passwords mismatch') },

				'XSV': { text: (r) => translate.instant('You just typed your VAT number, you need to type the VAT number of the company that have emitted the invoice') },

				'XUW': { text: (r) => translate.instant('Username should be a string with only alphanumeric characters') },

				'XWA': { text: (r) => translate.instant('Wrong backup file: address mismatch') },
				'XWAP': { text: (r) => translate.instant('Wrong backup file or backup password') },
				'XWP': { text: (r) => translate.instant('Wrong backup password') }
			}
		};
	}

	ngOnChanges(changes) {
		if (!changes.message || !changes.message.currentValue)
			return;

		if (!this.message) return;

		this.config.show = this.message.type == 'error' || this.message.type == 'success';
		this.config.type = this.message.type;
		this.config.fixed = this.message.fixed;

		if ('error' in this.message && this.message.error in this.messagesData.error)
			this.config.type = 'error';

		switch (this.message.type) {
			case 'error': {
				if (!(this.message.error in this.messagesData.error)) {
					this.config.show = false;
				} else {
					this.config.text = this.messagesData.error[this.message.error].text(this.message);
				}
				break;
			}
			case 'success': {
				this.config.text = this.message.text;
				break;
			}
			case 'warning': { break; }
			case 'info': { break; }
			default: { break; }
		}
	}

	/* Metodi accessibili con viewChild */
	public reset() {
		this.message = {};
	}
}