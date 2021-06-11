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

import { NgModule, InjectionToken, Optional, SkipSelf, Inject, ModuleWithProviders } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
// import RealtimeService from './realtime';
import { ArticleService } from './article';
import { BrowserHelperService } from './browser-helper';
import { UtilsService } from './utils';
import { CurrencyService } from './currency';
import { FormlyInit2Service } from './formly-init2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export const SERVICES_CONFIG = new InjectionToken<any>('SERVICES_CONFIG');

@NgModule({
	imports: [
		CommonModule,
		TranslateModule
	],
	providers: [
		DatePipe,

		// RealtimeService,
		ArticleService,
		BrowserHelperService,
		UtilsService,
		CurrencyService,
		FormlyInit2Service
	],
	exports: [
	],
	declarations: [
	]
})
export class ServicesModule {
	constructor(@Inject(SERVICES_CONFIG) config: any, private browserHelperService: BrowserHelperService, private currencyService: CurrencyService, private utilsService: UtilsService, private formlyInit2: FormlyInit2Service, @Optional() @SkipSelf() parentModule: ServicesModule) {
		if (parentModule) {
			throw new Error(
				'ServicesModule is already loaded. Import it in the AppModule only');
		}

		this.browserHelperService.init();
		this.currencyService.init(this.utilsService);
		this.formlyInit2.init();

		// this.router.initialNavigation();
	}

	static forRoot(config): ModuleWithProviders<ServicesModule> {
		return {
			ngModule: ServicesModule,
			providers: [
				{ provide: SERVICES_CONFIG, useValue: config },
				TranslateService,
				BrowserHelperService,
				CurrencyService,
				UtilsService,
				FormlyInit2Service
			],
		};
	}
} 