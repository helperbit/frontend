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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CookieComponent } from './cookie';
import { MockTranslateService } from 'app/shared/helpers/mocks';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PageHeaderComponent } from 'app/shared/components/page-header/page-header';
import { SeoFooterComponent } from 'app/components/parts/seofooter/seofooter';
import { WizardProcedureComponent } from 'app/shared/components/wizard-procedure/wizard-procedure';
import { SVGIconComponent } from 'app/shared/components/svg-icon/svg-icon';
import { TooltipDirective } from 'app/shared/directives/tooltip';
import { DashboardService } from 'app/models/dashboard';
import { UtilsService } from 'app/services/utils';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'app/app.routing';

describe('CookieComponent (isolated test)', () => {
	let component: CookieComponent;

	beforeEach(() => {
		component = new CookieComponent(new MockTranslateService as any);
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
});


describe('CookieComponent (shallow test)', () => {
	let component: CookieComponent;
	let fixture: ComponentFixture<CookieComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CookieComponent],
			providers: [
				{ provide: TranslateService, useClass: MockTranslateService }
			],
			imports: [],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CookieComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
});



describe('CookieComponent (integrated test)', () => {
	let component: CookieComponent;
	let fixture: ComponentFixture<CookieComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CookieComponent, PageHeaderComponent, SeoFooterComponent],
			providers: [UtilsService, DashboardService],
			imports: [HttpClientModule, AppRoutingModule, TranslateModule.forRoot()],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CookieComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
});