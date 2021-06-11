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
import { SimpleChange } from '@angular/core';
import { AddressBalanceComponent } from './address-balance';
import { WalletService } from 'app/models/wallet';
import { MoneyPipe } from 'app/shared/filters/money';
import { TooltipDirective } from 'app/shared/directives/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MockWalletService } from 'app/shared/helpers/mocks';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import AppSettings from 'app/app.settings';


const mockBalance = { balance: 1.0, received: 1.5, unconfirmed: 0.3 };

describe('AddressBalanceComponent (isolated test)', () => {
	let component: AddressBalanceComponent;

	beforeEach(() => {
		component = new AddressBalanceComponent(null);
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
});



describe('AddressBalanceComponent (shallow test)', () => {
	let component: AddressBalanceComponent;
	let fixture: ComponentFixture<AddressBalanceComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AddressBalanceComponent, MoneyPipe, TooltipDirective],
			providers: [
				{ provide: WalletService, useClass: MockWalletService }
			],
			// schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot()]
		}).compileComponents();
		(TestBed.get(WalletService) as MockWalletService)._setMockBalance(mockBalance);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AddressBalanceComponent);
		component = fixture.componentInstance;
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should initialize balance', (done) => {
		component.address = "1MN";
		component.ngOnChanges({ address: new SimpleChange(null, component.address, true) });
		fixture.detectChanges();

		fixture.whenStable().then(() => {
			fixture.detectChanges();
			expect(component.balance).toEqual(mockBalance);
			done();
		});
	});

	it('should show balance', () => {
		component.address = "1MN";
		component.mode = "balance";
		component.ngOnChanges({ address: new SimpleChange(null, component.address, true) });
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.innerHTML).toContain(String(mockBalance.balance));
	});

	it('should show received', () => {
		component.address = "1MN";
		component.mode = "received";
		component.ngOnChanges({ address: new SimpleChange(null, component.address, true) });
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.innerHTML).toContain(String(mockBalance.received));
	});
});



describe('AddressBalanceComponent (integrated test)', () => {
	let component: AddressBalanceComponent;
	let fixture: ComponentFixture<AddressBalanceComponent>;
	let httpMock: HttpTestingController;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AddressBalanceComponent, MoneyPipe, TooltipDirective],
			providers: [
				WalletService
			],
			imports: [HttpClientTestingModule, TranslateModule.forRoot()]
		}).compileComponents();
		httpMock = TestBed.get(HttpTestingController);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AddressBalanceComponent);
		component = fixture.componentInstance;
		component.address = "1MN";
		component.ngOnChanges({ address: new SimpleChange(null, component.address, true) });
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should initialize balance', () => {
		httpMock.expectOne(AppSettings.apiUrl + '/wallet/1MN/balance')
			.flush({ balance: 1, received: 2, unconfirmed: 3 });

		fixture.detectChanges();
		expect(component.balance).toEqual({ balance: 1, received: 2, unconfirmed: 3 });
	});
});
