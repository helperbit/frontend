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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslatedComponent } from './translated';
import { MockTranslateService } from 'app/shared/helpers/mocks';
import { EventEmitter } from '@angular/core';


describe('TranslatedComponent (isolated test)', () => {
	let component: TranslatedComponent;

	beforeEach(() => {
		component = new TranslatedComponent({ 
			currentLang: 'it',
			onLangChange: new EventEmitter() 
		} as any);
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should run set visible to true', () => {
		component.lang = 'it';
		component.ngOnInit();
		expect(component.visible).toBeTrue;
	});

	it('should run set visible to false', () => {
		component.lang = 'es';
		component.ngOnInit();
		expect(component.visible).toBeFalse;
	});
});



describe('TranslatedComponent (shallow test)', () => {
	let component: TranslatedComponent;
	let fixture: ComponentFixture<TranslatedComponent>;
	let mockTranslateService: MockTranslateService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TranslatedComponent],
			providers: [{ provide: TranslateService, useClass: MockTranslateService }],
			// schemas: [NO_ERRORS_SCHEMA],
			imports: []
		}).compileComponents();
		mockTranslateService = TestBed.get(TranslateService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TranslatedComponent);
		component = fixture.componentInstance;
	});

	it('should instantiate', () => {
		component.lang = "en";
		component.langs = ["en", "it", "es"];
		fixture.detectChanges();
		expect(component).toBeDefined();
	});

	it('should set visible to true', () => {
		mockTranslateService._setMockCurrentLang('en');
		component.lang = "en";
		component.langs = ["en", "it", "es"];
		fixture.detectChanges();
		expect(component.visible).toBeTrue();
	});

	it('should set visible to false', () => {
		mockTranslateService._setMockCurrentLang('it');
		component.lang = "en";
		component.langs = ["en", "it", "es"];
		fixture.detectChanges();
		expect(component.visible).toBeFalse();
	});

	it('should update visible on lang change', () => {
		mockTranslateService._setMockCurrentLang('it');
		component.lang = "en";
		component.langs = ["en", "it", "es"];
		fixture.detectChanges();
		expect(component.visible).toBeFalse();
		mockTranslateService._setMockCurrentLang('en');
		fixture.detectChanges();
		expect(component.visible).toBeTrue();
	});
});



describe('TranslatedComponent (integrated test)', () => {
	let component: TranslatedComponent;
	let fixture: ComponentFixture<TranslatedComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TranslatedComponent],
			providers: [],
			imports: [TranslateModule.forRoot()]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TranslatedComponent);
		component = fixture.componentInstance;
		component.lang = "en";
		component.langs = ["en", "it", "es"];
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
});
