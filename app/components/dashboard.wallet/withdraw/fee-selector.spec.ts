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
import { FeeSelectorComponent } from './fee-selector';
import { TooltipDirective } from 'app/shared/directives/tooltip';
import { MoneyPipe } from 'app/shared/filters/money';
import { FormsModule } from '@angular/forms';


describe('FeeSelectorComponent (isolated test)', () => {
	let component: FeeSelectorComponent;

	beforeEach(() => {
		component = new FeeSelectorComponent();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
		expect(component.profile).toBe('fastest');
	});
});



describe('FeeSelectorComponent (shallow test)', () => {
	let component: FeeSelectorComponent;
	let fixture: ComponentFixture<FeeSelectorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [FeeSelectorComponent, TooltipDirective, MoneyPipe],
			providers: [],
			// schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot(), FormsModule]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FeeSelectorComponent);
		component = fixture.componentInstance;
		component.fees = {
			fees: 0.1,
			fastest: 0.1,
			hour: 0.09,
			halfhour: 0.04,
			slowest: 0.01
		};
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should trigger change when selecting a profile', (done) => {
		component.changedProfile.subscribe(value => {
			fixture.detectChanges();
			expect(value).toEqual('slowest');
			expect(component.profile).toBe('slowest');
			done();
		});
		const select = fixture.debugElement.nativeElement.querySelector('.form-control');
		select.value = select.options[3].value;
		select.dispatchEvent(new Event('change'));
	});
});
