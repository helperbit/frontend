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
import { TranslateModule } from '@ngx-translate/core';
import { SeoFooterComponent } from './seofooter';
import { MockNgbModalService } from 'app/shared/helpers/mocks';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SubscribeComponent } from '../widgets/subscribe/subscribe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { UtilsService } from 'app/services/utils';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AppRoutingModule } from 'app/app.routing';
import { MetaModule } from 'ng2-meta';

describe('SeoFooterComponent (isolated test)', () => {
	let component: SeoFooterComponent;

	beforeEach(() => {
		component = new SeoFooterComponent(null);
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
});



describe('SeoFooterComponent (shallow test)', () => {
	let component: SeoFooterComponent;
	let fixture: ComponentFixture<SeoFooterComponent>;
	let ngbModalService: NgbModal;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SeoFooterComponent],
			providers: [
				{ provide: NgbModal, useClass: MockNgbModalService }
			],
			// schemas: [NO_ERRORS_SCHEMA],
			imports: []
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SeoFooterComponent);
		component = fixture.componentInstance;
		ngbModalService = TestBed.get(NgbModal);
		spyOn(ngbModalService, 'open').and.returnValue({ result: new Promise(r => r()) } as any);
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should click on subscribe button', () => {
		fixture.nativeElement.querySelector('.btn').click();
		expect(ngbModalService.open).toHaveBeenCalled();
	});
});



describe('SeoFooterComponent (integrated test)', () => {
	let component: SeoFooterComponent;
	let fixture: ComponentFixture<SeoFooterComponent>;
	let ngbModalService: NgbModal;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SeoFooterComponent, SubscribeComponent],
			providers: [UtilsService],
			imports: [HttpClientModule, AppRoutingModule, NgbModule, TranslateModule.forRoot(), MetaModule.forRoot()],
			schemas: [NO_ERRORS_SCHEMA],
		}).overrideModule(BrowserDynamicTestingModule, {
			set: {
				entryComponents: [SubscribeComponent],
			}
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SeoFooterComponent);
		component = fixture.componentInstance;
		ngbModalService = TestBed.get(NgbModal);
		spyOn(ngbModalService, 'open').and.callThrough();
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should click on subscribe button', () => {
		fixture.nativeElement.querySelector('.btn').click();
		expect(ngbModalService.open).toHaveBeenCalled();
	});
});