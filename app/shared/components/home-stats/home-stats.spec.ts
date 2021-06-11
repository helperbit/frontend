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
import { HomeStatsComponent } from './home-stats';
import { MoneyPipe } from 'app/shared/filters/money';
import { NumberFormatterPipe } from 'app/shared/filters/number-formatter';
import { StatsService } from 'app/models/stats';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { MockTranslateService } from 'app/shared/helpers/mocks';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import AppSettings from 'app/app.settings';

const mockWorldStats = {
	_id: '',
	donated: 2.34,
	donateddonations: 43,
	projects: 3,
	users: 1024
};

@Injectable()
class MockStatsService {
	getCountryStats(country: string, short: boolean): Observable<any> {
		return of(mockWorldStats);
	}
}

describe('HomeStatsComponent (isolated test)', () => {
	let component: HomeStatsComponent;

	beforeEach(() => {
		component = new HomeStatsComponent(null, null);
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should start the incrementation process', (done) => {
		component.values = [{
			icon: '',
			text: '',
			amount: {
				start: 0,
				end: 1024
			}
		}];
		component.startIncrement();

		setTimeout(() => {
			expect(component.values[0].amount.start).toBeGreaterThan(0);
			expect(component.values[0].amount.end).toBe(1024);
			done();
		}, 1000);
	});
});



describe('HomeStatsComponent (shallow test)', () => {
	let component: HomeStatsComponent;
	let fixture: ComponentFixture<HomeStatsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [HomeStatsComponent, MoneyPipe, NumberFormatterPipe],
			providers: [
				{ provide: StatsService, useClass: MockStatsService },
				{ provide: TranslateService, useClass: MockTranslateService },
			],
			// schemas: [NO_ERRORS_SCHEMA],
			imports: []
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HomeStatsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should update view values', (done) => {
		const assertCounters = (f) => {
			fixture.debugElement.nativeElement.querySelectorAll('.count').forEach(c => {
				f(expect(Number(c.innerHTML.replace('฿', '').replace('$', ''))))
			});
		}

		assertCounters((e) => e.toBe(0));
		fixture.detectChanges();

		setTimeout(() => {
			fixture.detectChanges();
			assertCounters((e) => e.toBeGreaterThan(0));
			done();
		}, 1000);
	});
});



describe('HomeStatsComponent (integrated test)', () => {
	let component: HomeStatsComponent;
	let fixture: ComponentFixture<HomeStatsComponent>;
	let httpMock: HttpTestingController;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [HomeStatsComponent, MoneyPipe, NumberFormatterPipe],
			providers: [
				StatsService,
				{ provide: TranslateService, useClass: MockTranslateService }
			],
			imports: [HttpClientTestingModule]
		}).compileComponents();
		httpMock = TestBed.get(HttpTestingController);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HomeStatsComponent);
		component = fixture.componentInstance;

		spyOn(component, 'startIncrement');

		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should trigger startIncrement', ((done) => {
		httpMock.expectOne(AppSettings.apiUrl + '/stats/country/WRL/short')
			.flush(mockWorldStats);

		setTimeout(() => {
			fixture.detectChanges();
			expect(component.startIncrement).toHaveBeenCalled();
			done();
		}, 2000);
	}));
});
