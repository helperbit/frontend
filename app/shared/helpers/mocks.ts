import { Injectable, EventEmitter, Component, Inject } from '@angular/core';
import { CurrencyConfig } from '../../services/currency';
import { WalletBalance } from 'app/models/wallet';
import { Observable, throwError, of } from 'rxjs';
import { QueryResult } from 'app/services/utils';
import { ParamMap, convertToParamMap, Data } from '@angular/router';
import { AuthLoginData, AuthLogin } from 'app/models/auth';
import { UserPrivate, UserVerify, AdminList } from 'app/models/dashboard';
import { LangChangeEvent } from '@ngx-translate/core';

@Injectable()
export class MockEmptyService { }


@Injectable()
export class MockCookieService {
	cookies = {};

	set(key, data, a, path) { this.cookies[key] = data; }
	get(key, path) { return this.cookies[key]; }
	delete(key, path) { this.cookies[key] = undefined; }
}

@Injectable()
export class MockAuthService {
	onLoginStatusChange: EventEmitter<boolean> = new EventEmitter;

	login(data: AuthLoginData): Observable<AuthLogin> {
		if (data.password.indexOf('error') != -1) {
			return throwError({});
		}
		if (data.user.indexOf('error') != -1) {
			return throwError({});
		}

		return of({
			token: '123',
			username: data.user,
			email: data.user + '@gmail.com',
			usertype: 'singleuser',
			policyversion: {
				accepted: { terms: 2, privacy: 2 },
				current: { terms: 2, privacy: 2 }
			}
		});
	}
}

@Injectable()
export class MockUtilsService {
	snackbar(text: string) { }
	getCountryOfISO(iso: string) { return iso; }
	setMeta(a: string, b: string) { }

	search(q: string): Observable<QueryResult[]> {
		switch (q) {
			case 'user_result':
				return of([{
					media: '',
					type: 'user',
					id: 'dakk',
					mainInfo: 'Davide Gessa',
					secondaryInfo: 'npo',
					tertiaryInfo: 'ITA',
					time: ''
				}]);
			default:
				return of([]);
		}
	}
}


@Injectable()
export class MockRouter {
	navigateByUrl(url: string) { }
}

@Injectable()
export class MockActivatedRoute {
	snapshot: {
		queryParamMap: ParamMap;
		paramMap: ParamMap;
		data: Data;
		fragment?: string;
	};

	constructor() {
		this.snapshot = {
			queryParamMap: convertToParamMap({}),
			paramMap: convertToParamMap({}),
			data: {},
			fragment: null
		}
	}

	setFragment(f) {
		this.snapshot.fragment = f;
	}

	setQueryParamMap(data) {
		this.snapshot.queryParamMap = convertToParamMap(data);
	}

	setDataParamMap(data) {
		this.snapshot.data = convertToParamMap(data);
	}

	setParamMap(data) {
		this.snapshot.paramMap = convertToParamMap(data);
	}
}

@Injectable()
export class MockTranslateService {
	currentLang: string = 'en';
	onLangChange: EventEmitter<LangChangeEvent> = new EventEmitter();

	_setMockCurrentLang(l: string) { 
		this.currentLang = l; 
		this.onLangChange.emit(null);
	}

	instant(text: string) { return text; }
}

@Injectable()
export class MockNgbModalService {
	open(component: Component, options: any) {
		return {
			result: new Promise((resolve, reject) => resolve())
		};
	}
}

@Injectable()
export class MockDashboardService {
	onProfileUpdate: EventEmitter<void> = new EventEmitter();
	user: UserPrivate = {
		username: 'gianni',
		usertype: 'singleuser'
	} as any;
	userVerify: UserVerify = null;
	userVerifyError: any = {
		fields: []
	};
	projects = [];
	admins: AdminList;

	_setMockAdmins(data: AdminList) { this.admins = data; }
	_setMockUser(data) { this.user = data as any };
	_setMockProjects(data) { this.projects = data as any };
	_setMockVerify(data) { this.userVerify = data as any };
	_setMockVerifyError(data) { this.userVerifyError = data as any };

	getAdminList() { return of(this.admins); }
	getProjects(ignore: boolean) { return of({ projects: this.projects }); }
	get() { return of(this.user); }
	getVerify() {
		if (this.userVerify == null)
			return throwError({ error: { error: 'EV1', data: this.userVerifyError } });
		return of(this.userVerify);
	}
}

@Injectable()
export class MockWalletService {
	mockBalance = { balance: 1.0, received: 1.5, unconfirmed: 0.3 };
	mockAddresses = {};
	mockWallets = [];
	mockReceiveAddress = null;

	onLoad = new EventEmitter;

	_setMockWalletList(wallets, receive) {
		this.mockWallets = wallets;
		this.mockReceiveAddress = receive;
	}

	_setMockBalance(bal: WalletBalance, address?: string) {
		if (address)
			this.mockAddresses[address] = bal;
		else
			this.mockBalance = bal;
	}

	getList() {
		return of({
			receiveaddress: this.mockReceiveAddress,
			wallets: this.mockWallets
		});
	}

	getBalance(address: string): Observable<WalletBalance> {
		if (address in this.mockAddresses)
			return of(this.mockAddresses[address]);

		return of(this.mockBalance);
	}
}

@Injectable()
export class MockCurrencyService {
	public onCurrencyChange: EventEmitter<CurrencyConfig> = new EventEmitter();

	public currencies: { [currency: string]: CurrencyConfig } = {
		'USD': { code: 'USD', symbol: '\u0024', value: 2, name: 'dollar' },
		'EUR': { code: 'EUR', symbol: '\u20AC', value: 3, name: 'euro' },
		'BTC': { code: 'BTC', symbol: '\u0E3F', value: 1.0, name: 'bitcoin' }
	};

	public currency: CurrencyConfig = {
		name: 'dollar',
		symbol: '$',
		code: 'USD',
		value: 2
	};

	public setCurrency(code: string) {
		this.currency = this.currencies[code];
		this.onCurrencyChange.emit(this.currency);
	}

	public getCurrencyCode() {
		return this.currency.code;
	}
}