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
import { MnemonicViewComponent } from './mnemonic-view';
import { OrdinalPipe } from 'app/shared/filters/ordinal';

const mockMnemonic = 'casa parco vela gianni sedia bottiglia telefono presa sigaretta cavo divano gatto';

describe('MnemonicViewComponent (isolated test)', () => {
	let component: MnemonicViewComponent;

	beforeEach(() => {
		component = new MnemonicViewComponent();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
});



describe('MnemonicViewComponent (shallow test)', () => {
	let component: MnemonicViewComponent;
	let fixture: ComponentFixture<MnemonicViewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MnemonicViewComponent, OrdinalPipe],
			providers: [],
			imports: [TranslateModule.forRoot()]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MnemonicViewComponent);
		component = fixture.componentInstance;
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should display every mnemonic word', async () => {
		let inspected = 0;
		component.mnemonic = mockMnemonic;
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.amnemonic).toEqual(mockMnemonic.split(' '));

		fixture.debugElement.nativeElement.querySelectorAll('.word-box').forEach((w, i) => {
			expect(w.innerHTML).toContain(mockMnemonic.split(' ')[i]);
			inspected += 1;
		});

		expect(inspected).toBe(12);
	});
});


