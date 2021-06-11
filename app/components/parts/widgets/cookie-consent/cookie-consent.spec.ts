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

import { CookieConsentComponent } from './cookie-consent';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('CookieConsentComponent (isolated test)', () => {
	let component: CookieConsentComponent;

	beforeEach(() => {
		window.localStorage.removeItem('cookie-consent-accepted');
		component = new CookieConsentComponent();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should have showBanner true', () => {
		expect(component.showBanner).toBe(true);
	});

	it('should update showBanner', () => {
		component.accept();
		expect(component.showBanner).toBe(false);
	});
});



describe('CookieConsentComponent (shallow test)', () => {
	let component: CookieConsentComponent;
	let fixture: ComponentFixture<CookieConsentComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CookieConsentComponent],
			providers: [],
			imports: [TranslateModule.forRoot()]
		}).compileComponents();
	}));

	beforeEach(() => {
		window.localStorage.removeItem('cookie-consent-accepted');
		fixture = TestBed.createComponent(CookieConsentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should display banner', () => {
		expect(fixture.nativeElement.querySelector('.alert-dismissible')).toBeDefined();
	});

	it('should hide banner on button accept', () => {
		fixture.nativeElement.querySelector('.btn').click();
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('.alert-dismissible')).toBeNull();
	});
});

