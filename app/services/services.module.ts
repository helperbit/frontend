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