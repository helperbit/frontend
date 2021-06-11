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

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/parts/header/header';
import { LoadingBarComponent } from './components/parts/loading-bar';
import { FooterComponent } from './components/parts/footer/footer';
import { RouterOutlet, RouterModule, RouterLink } from '@angular/router';
import { LanguageSelectorComponent } from './shared/components/language-selector/language-selector';
import { CurrencySelectorComponent } from './shared/components/currency-selector/currency-selector';
import { AvatarPipe } from './shared/filters/avatar';
import { SharedModule } from './shared/shared.module';
import { ServicesModule } from './services/services.module';
import { PartsModule } from './components/parts/parts.module';
import { AppModule } from './app.module';

describe('AppModule', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				// SharedModule,
				// ServicesModule,
				// PartsModule,
				AppModule
			],
			declarations: [
				// AppComponent
			],
		}).compileComponents();
	}));

	// it('should create the app component', () => {
	// 	const fixture = TestBed.createComponent(AppComponent);
	// 	const app = fixture.debugElement.componentInstance;
	// 	expect(app).toBeTruthy();
	// });

	// it(`should have as title 'test'`, () => {
	//   const fixture = TestBed.createComponent(AppComponent);
	//   const app = fixture.debugElement.componentInstance;
	//   expect(app.title).toEqual('Home | Helperbit');
	// });

	// it('should render title in a h1 tag', () => {
	//   const fixture = TestBed.createComponent(AppComponent);
	//   fixture.detectChanges();
	//   const compiled = fixture.debugElement.nativeElement;
	//   expect(compiled.querySelector('h1').textContent).toContain('Welcome to test!');
	// });
});
