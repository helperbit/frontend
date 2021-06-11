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
import { PageHeaderComponent } from './page-header';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockActivatedRoute } from 'app/shared/helpers/mocks';
import { ActivatedRoute } from '@angular/router';

describe('PageHeaderComponent (isolated test)', () => {
	let component: PageHeaderComponent;

	beforeEach(() => {
		component = new PageHeaderComponent(null);
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
});



describe('PageHeaderComponent (shallow test)', () => {
	let component: PageHeaderComponent;
	let fixture: ComponentFixture<PageHeaderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PageHeaderComponent],
			providers: [
				{ provide: ActivatedRoute, useClass: MockActivatedRoute }
			],
			imports: [],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageHeaderComponent);
		component = fixture.componentInstance;
		component.config = {
			description: {
				title: 'test title',
				subTitle: 'test subtitle'
			},
			info: {
				boxes: [
					{ title: 't1', subTitle: 's1' },
					{ title: 't2', subTitle: 's2' },
					{ title: 't3', subTitle: 's3' },
					{ title: 't4', subTitle: 's4' }
				]
			}
		}
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should have 4 boxes', () => {
		expect(fixture.nativeElement.querySelectorAll('.info').length).toBe(4);
	});

	it('should have title and subtitle', () => {
		expect(fixture.nativeElement.innerHTML).toContain(component.config.description.title);
		expect(fixture.nativeElement.innerHTML).toContain(component.config.description.subTitle);
	});
});

