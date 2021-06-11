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
import { RoundImageProgressComponent } from './round-image-progress';
import { ImgAttrsDirective } from 'app/shared/directives/img-attrs';
import { AvatarPipe } from 'app/shared/filters/avatar';
import { MockTranslateService, MockDashboardService, MockUtilsService } from 'app/shared/helpers/mocks';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DashboardModule } from 'app/components/dashboard/dashboard.module';
import { DashboardService } from 'app/models/dashboard';
import { UtilsService } from 'app/services/utils';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MetaModule } from 'ng2-meta';


describe('RoundImageProgressComponent (isolated test)', () => {
	let component: RoundImageProgressComponent;

	beforeEach(() => {
		component = new RoundImageProgressComponent();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
});



describe('RoundImageProgressComponent (shallow test)', () => {
	let component: RoundImageProgressComponent;
	let fixture: ComponentFixture<RoundImageProgressComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RoundImageProgressComponent, ImgAttrsDirective, AvatarPipe],
			providers: [
				{ provide: TranslateService, useClass: MockTranslateService },
				{ provide: UtilsService, useClass: MockUtilsService },
				{ provide: DashboardService, useClass: MockDashboardService }
			],
			// schemas: [NO_ERRORS_SCHEMA],
			imports: []
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RoundImageProgressComponent);
		component = fixture.componentInstance;
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
	
	it('should show', () => {
		component.config = {
			percentage: 12,
			borderClass: '',
			user: {
				username: 'gianni',
				usertype: 'singleuser'
			} as any
		};
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelector('.circle')).toBeDefined();
		expect(fixture.debugElement.nativeElement.querySelector('.circle').getAttribute('stroke-dasharray'))
			.toBe('12, 100');
	});
});



describe('RoundImageProgressComponent (integrated test)', () => {
	let component: RoundImageProgressComponent;
	let fixture: ComponentFixture<RoundImageProgressComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RoundImageProgressComponent, ImgAttrsDirective, AvatarPipe],
			providers: [ UtilsService, DashboardModule ],
			// schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule,
				MetaModule.forRoot()]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RoundImageProgressComponent);
		component = fixture.componentInstance;
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
	
	it('should show', () => {
		component.config = {
			percentage: 12,
			borderClass: '',
			user: {
				username: 'gianni',
				usertype: 'singleuser'
			} as any
		};
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelector('.circle')).toBeDefined();
		expect(fixture.debugElement.nativeElement.querySelector('.circle').getAttribute('stroke-dasharray'))
			.toBe('12, 100');
	});
});
