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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { SeoFooterComponent } from './seofooter/seofooter';
import { CookieConsentComponent } from './widgets/cookie-consent/cookie-consent';
import { FooterComponent } from './footer/footer';
import { NgbModalModule, NgbTabsetModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header';
import { SubscribeComponent } from './widgets/subscribe/subscribe';
import { FormlyModule } from '@ngx-formly/core';
import { LoadingBarComponent } from './loading-bar';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FeedbackComponent } from './widgets/feedback/feedback';
import { ArchwizardModule } from 'angular-archwizard';
import { SearchBarComponent } from './widgets/search-bar/search-bar';
import { NotificationBarComponent } from './widgets/notification-bar/notification-bar';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		FormsModule,
		NgbTabsetModule,
		NgbModalModule,
		NgbDropdownModule,
		ReactiveFormsModule,
		FormlyModule,
		LoadingBarHttpClientModule,
		RouterModule,
		// LoadingBarRouterModule,
		LoadingBarModule,
		TranslateModule,
		ArchwizardModule
	],
	exports: [
		SeoFooterComponent,
		CookieConsentComponent,
		FooterComponent,
		HeaderComponent,
		SubscribeComponent,
		LoadingBarComponent,
		FeedbackComponent
	],
	entryComponents: [
		FeedbackComponent,
		SubscribeComponent,
		SearchBarComponent,
		NotificationBarComponent
	],
	declarations: [
		SeoFooterComponent,
		CookieConsentComponent,
		FooterComponent,
		HeaderComponent,
		SubscribeComponent,
		LoadingBarComponent,
		FeedbackComponent,
		SearchBarComponent,
		NotificationBarComponent
	],
	providers: [
	]
})
export class PartsModule {
	constructor() { }
} 