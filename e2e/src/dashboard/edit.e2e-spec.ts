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

import { browser, by, element } from 'protractor';
import { CommonPage } from '../common.po';
import { EditPage } from './edit.po';
import { LoginPage } from '../auth/login.po';

describe('edit', () => {
	let page: EditPage;
	let loginPage: LoginPage = new LoginPage();

    beforeEach(() => {
        page = new EditPage();
    });

    it('should load edit page', async () => {
		loginPage.logout();
		loginPage.loginTo('cioco3');
		await page.waitForPageChange();
		
		expect(await browser.getCurrentUrl()).toContain('controlpanel');
		page.navigateTo();
		expect(await browser.getCurrentUrl()).toContain('edit');
	});
});

