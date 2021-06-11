import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RecaptchaModule } from 'ng-recaptcha';
import { ArchwizardModule } from 'angular-archwizard';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { SharedModule } from './shared/shared.module';
import { PartsModule } from './components/parts/parts.module';
import { ServicesModule } from './services/services.module';
import { ModelsModule } from './models/models.module';
import { HomeModule } from './components/home/home.module';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { QRCodeModule } from 'angularx-qrcode';
import { AuthService } from './models/auth';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { MetaModule } from 'ng2-meta';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ServiceWorkerModule } from '@angular/service-worker';
import AppSettings from './app.settings';
import { FormlyWrapperFormField } from './shared/ngx-formly/wrapper/form-field';

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, './lang/', '.json');
}


// export function StaticTranslateLoaderFactory() {
// 	return {
// 		getTranslation: function (lang: string): Observable<any> {
// 			switch (lang) {
// 				case 'it':
// 					return of(require('./assets/lang/it.json'));
// 				case 'es':
// 					return of(require('./assets/lang/es.json'));
// 				case 'it':
// 					return of({});
// 			}
// 		}
// 	};
// }


@NgModule({
	bootstrap: [
		AppComponent
	],
	declarations: [
		AppComponent,
		FormlyWrapperFormField
	],
	imports: [
		BrowserModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		HttpClientModule,
		RecaptchaModule,
		FormsModule,
		ReactiveFormsModule,
		FormlyModule.forRoot({
			wrappers: [{
				name: 'form-field',
				component: FormlyWrapperFormField
			}]
		}),
		FormlyBootstrapModule,
		// QRCodeModule,
		MetaModule.forRoot({
			useTitleSuffix: true,
			defaults: {
				title: 'Helperbit bitcoin blockchain trasparency donation platform',
				description: 'Helperbit is a crypto platform that enables charities to accept Bitcoin and other cryptocurrencies in the safest and easiest way. Donate to crypto nonprofits or to individuals affected by natural disasters.',
				author: 'Helperbit Team',
				titleSuffix: ' | Helperbit',
				'og:image': 'https://app.helperbit.com/media/logo_round.png',
				image: 'https://app.helperbit.com/media/logo_round.png'
			}
		}),
		LeafletModule.forRoot(),
		LoadingBarHttpClientModule,
		LoadingBarRouterModule,
		LoadingBarModule,
		ArchwizardModule,
		// TagInputModule,
		BrowserAnimationsModule,

		ServicesModule.forRoot({}),
		ModelsModule,
		SharedModule,
		PartsModule,
		HomeModule,
		AppRoutingModule,
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: AppSettings.production,
			registrationStrategy: 'registerImmediately'
		})
	],
	providers: [
		CookieService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true,
			deps: [AuthService, CookieService, Router]
		}
	]
})
export class AppModule {
	constructor() { }
}
