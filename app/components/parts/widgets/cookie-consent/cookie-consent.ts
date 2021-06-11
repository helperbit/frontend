import { Component } from '@angular/core';
import { getLocalStorage } from 'app/shared/helpers/utils';

@Component({
	selector: 'cookie-consent',
	templateUrl: 'cookie-consent.html',
	styleUrls: ['cookie-consent.scss']
})
export class CookieConsentComponent {
	showBanner: boolean;

	constructor() {
		this.showBanner = false;

		if (!getLocalStorage().getItem('cookie-consent-accepted'))
			this.showBanner = true;
	}

	accept() {
		getLocalStorage().setItem('cookie-consent-accepted', 'true');
		this.showBanner = false;
	}
}
