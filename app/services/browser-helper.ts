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

import { LoadingBarService } from '@ngx-loading-bar/core';
import { Injectable, Inject } from '@angular/core';
import { getSessionStorage, getWindow, getLocalStorage } from "../shared/helpers/utils";
import { Location } from '@angular/common';
import AppSettings from 'app/app.settings';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as itLocale from 'date-fns/locale/it';
import * as esLocale from 'date-fns/locale/es';
import * as enLocale from 'date-fns/locale/en-US';

function userAgentContains(userAgentName) {
	return window.navigator.userAgent.indexOf(userAgentName) !== -1;
}

class Browser {
	key: string;
	name: string;
	uaNameVersion: string;
	uaContain: string;
	uaNotContain: string;
	version: number;
	es5From: number;
	es6From: number;
	css3From: number;
	isMobile: boolean;
	checkers: { checker: string; version: string }

	constructor(key, name, userAgentNameVersion, userAgent, minimumVersion, checkers) {
		this.key = key;
		this.name = name;
		this.uaNameVersion = userAgentNameVersion;
		this.uaContain = userAgent.contain;
		this.uaNotContain = userAgent.notContain;
		this.version = null;
		this.es5From = minimumVersion.es5;
		this.es6From = minimumVersion.es6;
		this.css3From = minimumVersion.css3;
		this.checkers = checkers;
		this.isMobile = userAgentContains('Mobi');
	}

	isChrome() { return this.key == 'chrome' || this.key == 'chromium'; }
	isIE() { return this.key == 'ie' || this.key == 'ieMobile'; }
	isES5Available() { return this.es5From && this.version >= this.es5From; }
	isES6Available() { return this.es6From && this.version >= this.es6From; }
	isCSS3Available() { return this.css3From && this.version >= this.css3From; }
	isTotallyUsable() { return this.isES5Available() && this.isES6Available() && this.isCSS3Available(); }

	getVersion() {
		const checkBrowserVersion = () => {
			const res = window.navigator.userAgent.split(this.uaNameVersion);
			let ver = null;

			if (res.length > 1)
				ver = res[1].split(' ')[0];
			else
				ver = res[0];

			const verSplit = ver.split('.');

			if (verSplit.length > 1)
				ver = verSplit[0] + '.' + verSplit[1];
			else
				ver = verSplit[0];

			return parseFloat(ver);
		};

		const checkBrowserVersionInternetExplorer = () => {
			const res = window.navigator.userAgent.split('; MSIE ');
			let ver = null;

			if (res.length > 1)
				ver = res[1].split(';')[0];
			else
				ver = res[0];

			const verSplit = ver.split('.');

			if (verSplit.length > 1)
				ver = verSplit[0] + '.' + verSplit[1];
			else
				ver = verSplit[0];

			return parseFloat(ver);
		};

		const checkBrowserVersionMobileOpera = () => 0;

		switch (this.checkers.version) {
			case 'opera':
				return checkBrowserVersionMobileOpera();
			case 'ie':
				return checkBrowserVersionInternetExplorer();
			default:
				return checkBrowserVersion();
		}
	}

	check() {
		//most browsers
		const checkBrowserUserAgent = () => {
			for (let i = 0; i < this.uaContain.length; i++) {
				const userAgentName = this.uaContain[i];

				if (!userAgentContains(userAgentName))
					return false;
			}

			for (let i = 0; i < this.uaNotContain.length; i++) {
				const userAgentName = this.uaNotContain[i];

				if (userAgentContains(userAgentName))
					return false;
			}

			return true;
		};

		//DESKTOP

		//opera
		function checkBrowserUserAgentOpera() {
			//OPR version >=12
			//Opera version <12
			if (!userAgentContains('OPR/') && !userAgentContains('Opera/'))
				return false

			return true;
		};

		//MOBILE

		//edge
		function checkBrowserUserAgentMobileEdge() {
			//EdgA version Android
			//EdgiOS version iOS
			if (!userAgentContains('Mobi'))
				return false
			else if (!userAgentContains('EdgA/') && !userAgentContains('EdgiOS/'))
				return false

			return true;
		};

		//firefox
		function checkBrowserUserAgentMobileFirefox() {
			if (!userAgentContains('Mobile') && !userAgentContains('Tablet'))
				return false
			else if (!userAgentContains('Firefox/'))
				return false

			return true;
		};

		//opera
		function checkBrowserUserAgentMobileOpera() {
			//OPR version >=12
			//Opera Mobi version <12
			if (!userAgentContains('Mobi') && !userAgentContains('Mobile Safari'))
				return false
			else if (!userAgentContains('OPR/') && !userAgentContains('Opera Mobi/'))
				return false

			return true;
		};

		this.version = this.getVersion();

		switch (this.checkers.checker) {
			case 'opera':
				return checkBrowserUserAgentOpera();
			case 'mobileEdge':
				return checkBrowserUserAgentMobileEdge();
			case 'mobileFirefox':
				return checkBrowserUserAgentMobileFirefox();
			case 'mobileOpera':
				return checkBrowserUserAgentMobileOpera();
			default:
				return checkBrowserUserAgent();
		}
	}

	supportCSS3() {
		//from https://www.sitepoint.com/detect-css3-property-browser-support/
		// CSS support detection
		const props = "textShadow,textStroke,boxShadow,borderRadius,borderImage,opacity".split(",");
		const CSSprefix = "Webkit,Moz,O,ms,Khtml".split(",");
		const d = document.createElement("detect");
		let pty;

		// test prefixed code
		function TestPrefixe(prop) {
			const Uprop = prop.charAt(0).toUpperCase() + prop.substr(1);
			const all = (prop + ' ' + CSSprefix.join(Uprop + ' ') + Uprop).split(' ');

			for (let n = 0, np = all.length; n < np; n++) {
				if (d.style[all[n]] === "") return true;
			}

			return false;
		}

		for (const p in props) {
			pty = props[p];
			if (!TestPrefixe(pty))
				return false;
		}

		return true;
	}
}

@Injectable({
	providedIn: 'root'
})
export class BrowserHelperService {
	captchaid: string;
	currentResolution: string;
	oldBrowser: { showMainAlert: boolean; showBannerAlert: boolean };
	browserDetected: Browser;

	constructor(
		private location: Location,
		// private loadingBar: LoadingBarService,
		private translate: TranslateService,
		private route: ActivatedRoute,
		private router: Router
	) {
		this.router.events.subscribe(ev => {
			if (ev instanceof NavigationEnd)
				this.detectLanguage();
		});
	}

	private checkBrowser() {
		const browsers = {
			desktop: [
				new Browser('ie', 'Internet Explorer', '; MSIE ', { contain: ['; MSIE '], notContain: [] }, { es5: 10, es6: false, css3: false }, { checker: 'standard', version: 'ie' }),
				new Browser('edge', 'Edge', 'Edge/', { contain: ['Edge/'], notContain: [] }, { es5: 12, es6: 12, ccs3: 14 }, { checker: 'standard', version: 'standard' }),
				new Browser('firefox', 'Firefox', 'Firefox/', { contain: ['Firefox/'], notContain: ['Seamonkey/'] }, { es5: 21, es6: 45, css3: 50 }, { checker: 'standard', version: 'standard' }),
				new Browser('chrome', 'Chrome', 'Chrome/', { contain: ['Chrome/'], notContain: ['Chromium/', 'OPR/', 'Opera/', 'Edge/'] }, { es5: 23, es6: 49, css3: 56 }, { checker: 'standard', version: 'standard' }),
				new Browser('chromium', 'Chromium', 'Chromium/', { contain: ['Chromium/'], notContain: [] }, { es5: 23, es6: 49, css3: 56 }, { checker: 'standard', version: 'standard' }),
				new Browser('safari', 'Safari', 'Safari/', { contain: ['Safari/'], notContain: ['Chrome/', 'Chromium/'] }, { es5: 6, es6: 9, ccs3: 10 }, { checker: 'standard', version: 'standard' }),
				new Browser('opera', 'Opera', 'OPR/', { contain: ['OPR/', 'Opera/'], notContain: [] }, { es5: 15, es6: 36, css3: 43 }, { checker: 'opera', version: 'standard' }),
			],
			mobile: [
				new Browser('iosSafari', 'IOS Safari', 'Safari/', { contain: ['Mobi', 'Safari/'], notContain: ['Chrome/', 'OPR/'] }, { es5: 6, es6: 9, css3: 10 }, { checker: 'standard', version: 'standard' }),
				// operaMini: new Browser('Opera Mini', false, false),
				new Browser('androidBrowser', 'Android Browser', 'Mobile Safari/', { contain: ['Mobi', 'Mobile Safari/'], notContain: ['Chrome/', 'OPR/'] }, { es5: 4.4, es6: 67, css3: 67 }, { checker: 'standard', version: 'standard' }),
				// blackberryBrowser: new Browser('Blackberry Browser', 10, false),
				new Browser('operaMobile', 'Opera Mobile', 'OPR/', { contain: ['Mobi', 'Mobile Safari/', '/OPR'], notContain: [] }, { es5: 46, es6: 46, css3: 46 }, { checker: 'mobileOpera', 'version': 'mobileOpera' }),
				new Browser('chromeForAndroid', 'Chrome for Android', 'Chrome/', { contain: ['Mobi', 'Mobile Safari/', 'Chrome/'], notContain: ['OPR/', 'UCBrowser/', 'EdgA/', 'EdgiOS/'] }, { es5: 70, es6: 70, css3: 70 }, { checker: 'standard', version: 'standard' }),
				new Browser('firefoxForAndroid', 'Firefox for Android', 'Firefox/', { contain: ['Mobi', 'Mobile', 'Firefox/'], notContain: [] }, { es5: 63, es6: 63, css3: 63 }, { checker: 'mobileFirefox', version: 'standard' }),
				new Browser('ieMobile', 'IE Mobile', 'IEMobile/', { contain: ['Mobi', 'IEMobile/'], notContain: [] }, { es5: 10, es6: false, css3: 11 }, { checker: 'standard', version: 'standard' }),
				new Browser('edgeMobile', 'Edge Mobile', 'EdgA/', { contain: ['Mobi', 'EdgA/', 'EdgiOS'], notContain: [] }, { es5: 12, es6: 12, css3: 12 }, { checker: 'mobileEdge', version: 'standard' }),
				new Browser('ucBrowserForAndroid', 'UC Browser for Android', 'UCBrowser/', { contain: ['Mobi', 'UCBrowser/'], notContain: [] }, { es5: 11.8, es6: 11.8, css3: 11.8 }, { checker: 'standard', version: 'standard' }),
				// samsungInternet: new Browser('Samsung Internet', 4, 5),
				// QQBrowser: new Browser('QQ Browser', 1.2, false),
				// baiduBrowser: new Browser('Baidu Browser', 7.12, 7.12),
			],
			other: new Browser('other', 'OTHER', 'OTHER', { contain: [], notContain: [] }, { es5: false, es6: false, css3: false }, { 'checker': 'false', version: 'false' })
		};

		const checkBrowsersList = (list: Browser[]) => {
			for (let i = 0; i < list.length; i++) {
				const b = list[i];

				if (b.check())
					return b;
			}
			return browsers.other;
		}

		this.browserDetected = checkBrowsersList(!userAgentContains('Mobi') ? browsers.desktop : browsers.mobile);

		// eslint-disable-next-line no-console
		console.log(`Detected browser: ${this.browserDetected.name} ${this.browserDetected.version} => %cECMA5 %cECMA6 %cCSS3 %cCSS3CST`,
			`color:${this.browserDetected.isES5Available() ? 'green' : 'red'}`,
			`color:${this.browserDetected.isES6Available() ? 'green' : 'red'}`,
			`color:${this.browserDetected.isCSS3Available() ? 'green' : 'red'}`,
			`color:${this.browserDetected.supportCSS3() ? 'green' : 'red'}`
		);

		// sessionStorage.removeItem('oldBrowser');
		const sessionStorage = getSessionStorage();

		if (!sessionStorage.getItem('oldBrowser')) {
			this.oldBrowser = {
				showMainAlert: false,
				showBannerAlert: false
			};

			//ALERT il controllo su es5/es6 e css3 è concettualmente giusto ma efficacemente sbagliato.
			//ad esempio android 63 che stà su android 8.0 tecnicamente non supporta ec5, ma facendo il transpile è supportato.
			// this.oldBrowser.showMainAlert = (this.browserDetected.isIE() || (this.browserDetected.key != 'other' && !browserDetected.isTotallyUsable()) || !supportCss3());
			this.oldBrowser.showMainAlert = (this.browserDetected.isIE() || !this.browserDetected.supportCSS3());
			sessionStorage.setItem('oldBrowser', JSON.stringify(this.oldBrowser));
		}
		else
			this.oldBrowser = JSON.parse(sessionStorage.getItem('oldBrowser'));

		(getWindow() as any).oldBrowser = this.oldBrowser;
	}

	checkResolution() {
		let resolution = '';
		const width = $(document).width();
		if (width >= 1200)
			resolution = 'lg';
		else if (width >= 992 && width <= 1199)
			resolution = 'md';
		else if (width >= 768 && width <= 991)
			resolution = 'sm';
		else if (width <= 767)
			resolution = 'xs';

		this.currentResolution = resolution;
	}

	// captchaInit(wid: string) {
	// 	this.vcRecaptchaService.destroy(this.captchaid);
	// 	this.vcRecaptchaService.reload(this.captchaid);
	// 	getLocalStorage().removeItem('captcha');
	// 	if (wid)
	// 		this.captchaid = wid;
	// }

	// captchaSuccess(response) {
	// 	getLocalStorage().setItem('captcha', response, null, '/');
	// }

	// captchaExpire() {
	// 	this.vcRecaptchaService.destroy(this.captchaid);
	// 	getLocalStorage().removeItem('captcha');
	// 	this.vcRecaptchaService.reload(this.captchaid);
	// }

	configureLoading() {
		// this.cfpLoadingBar.sstart = this.cfpLoadingBar.start;
		// this.cfpLoadingBar.scomplete = this.cfpLoadingBar.complete;

		// this.cfpLoadingBar.start = () => {
		// 	$('#loading-box').show();
		// 	this.cfpLoadingBar.sstart();
		// };
		// this.cfpLoadingBar.complete = () => {
		// 	$('#loading-box').hide();
		// 	this.cfpLoadingBar.scomplete();
		// };
		// this.cfpLoadingBar.error = (error, id) => {
		// 	this.cfpLoadingBar.scomplete();
		// 	if (error != 'E2')
		// 		getLocalStorage().setItem('lasturl', window.location.href, null, '/');
		// 	else
		// 		getLocalStorage().setItem('lasturl', '/', null, '/');
		// 	this.$location.path('/error').search({ error: error, id: id });
		// };
	}

	isLedgerSupported() {
		return this.browserDetected.isChrome();
	}

	init() {
		$(window).resize(this.checkResolution);
		this.checkBrowser();
		this.checkResolution();
		this.configureLoading();

		this.translate.setDefaultLang('en');
		this.translate.use('en');
		this.detectLanguage();
	}


	private lang: string = 'en';

	getLanguage() { return this.lang; }

	detectLanguage() {
		let lang = 'en';

		if (window.navigator.languages && window.navigator.languages.length !== 0) {
			lang = window.navigator.languages[0].split('-')[0].toLowerCase();
			if (lang.length > 2)
				lang = lang.substring(0, 2);
		}

		if (getLocalStorage().getItem('overrideLang'))
			lang = getLocalStorage().getItem('overrideLang');

		if (this.route.snapshot.queryParamMap.has('lang'))
			lang = this.route.snapshot.queryParamMap.get('lang');

		this.lang = lang;
		this.translate.use(lang);

		console.log('Detected:', lang);

		/* Create the alternate urls */
		let basecpath = this.location.path();
		AppSettings.languages.forEach(l => {
			basecpath = basecpath.replace('/' + l, '');
		});
		// this.languri = {
		// 	'en': AppSettings.baseUrl + basecpath,
		// 	'it': AppSettings.baseUrl + basecpath + '?lang=it',
		// 	'es': AppSettings.baseUrl + basecpath + '?lang=es'
		// };

		if (AppSettings.languages.indexOf(lang) != -1 || lang == 'en') {
			this.translate.use(lang);

			if (AppSettings.languages.indexOf(lang) != -1 || lang == 'en') {
				if (lang == 'it')
					(window as any).dateLocale = itLocale.default;
				else if (lang == 'es')
					(window as any).dateLocale = esLocale.default;
				else
					(window as any).dateLocale = enLocale.default;
			}

			/* Redirect to lang subdir */
			// const cpath = this.location.path();
			// let t = false;

			// AppSettings.languages.forEach(l => {
			// 	if (cpath.indexOf('/' + l + '/') != -1)
			// 		t = true;
			// });

			// if (!t && this.lang !== undefined && this.lang != 'en') {
			// 	this.router.navigateByUrl('/' + this.lang + cpath);
			// }
		}
		// else if (lang == '{{ngMeta.image}}') {
		// 	this.$location.path('/');
		// }
	}
}
