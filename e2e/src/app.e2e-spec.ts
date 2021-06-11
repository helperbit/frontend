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

import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('app', () => {
	let page: AppPage;

	beforeEach(() => {
		page = new AppPage();
	});

	it('should load something', () => {
		page.navigateTo();
	});

	// afterEach(async () => {
	// 	// Assert that there are no errors emitted from the browser
	// 	const logs = await browser.manage().logs().get(logging.Type.BROWSER);
	// 	expect(logs).not.toContain(jasmine.objectContaining({
	// 		level: logging.Level.SEVERE,
	// 	} as logging.Entry));
	// });
});
