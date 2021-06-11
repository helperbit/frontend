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

import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { BrowserHelperService } from 'app/services/browser-helper';
import { getLocalStorage } from 'app/shared/helpers/utils';

@Component({
	selector: 'language-selector',
	templateUrl: 'language-selector.html',
	styleUrls: ['language-selector.scss']
})
export class LanguageSelectorComponent {
	activeLanguage: { lang: string };
	languages: any;
	style: any;

	constructor (
		private translate: TranslateService, 
		private browserHelper: BrowserHelperService,
		private router: Router
	) {
		this.languages = {
			it: {
				lang: 'it',
				img: '/media/countryflags/ITA.png'
			},
			en: {
				lang: 'en',
				img: '/media/countryflags/GBR.png'
			},
			es: {
				lang: 'es',
				img: '/media/countryflags/ESP.png'
			}
		};

		this.style = {
			button: { width: (100/Object.keys(this.languages).length) + '%;' },
			image: { width: '30px', height: '20px' }
		};

		this.activeLanguage = this.languages[browserHelper.getLanguage()];

		this.router.events.subscribe(ev => {
			if (ev instanceof NavigationEnd) {
				this.activeLanguage = this.languages[browserHelper.getLanguage()];
			}
		});
	}
	
	changeLanguage (language: { lang: string }) {
		this.activeLanguage = language;
		this.translate.use(language.lang);
		getLocalStorage().setItem('overrideLang', language.lang);
		this.browserHelper.detectLanguage();
	}
}

