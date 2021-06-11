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
import { LoginPage } from './login.po';
import { CommonPage } from '../common.po';

describe('login', () => {
    let page: LoginPage;

    beforeEach(() => {
        page = new LoginPage();
    });

    it('should display disabled login button', async () => {
        await page.navigateTo();
        const loginButton = page.loginButton();
        expect(loginButton.getText()).toEqual('LOGIN');
        expect(loginButton.isEnabled()).toBe(false);
    });

    it('should return wrong credentials error', async () => {
        await page.navigateTo();

        let loginButton = page.loginButton();
		expect(loginButton.isEnabled()).toBe(false);
		
        await page.fillCredential('cioco3', 'Prova1234!1');

        loginButton = page.loginButton();
        expect(loginButton.isEnabled()).toBe(true);
		await loginButton.click();
		await browser.waitForAngular();
		page.waitSeconds(1);
		expect(await page.errorAlert().getText()).toContain('Invalid');
    });

    it('should login singleuser and redirect to controlpanel', async () => {
        let loginButton = null;
        await page.navigateTo();

        loginButton = page.loginButton();
        expect(loginButton.isEnabled()).toBe(false);

        await page.fillCredential('cioco3');

        loginButton = page.loginButton();
        expect(loginButton.isEnabled()).toBe(true);

		await loginButton.click();
		await page.waitForPageChange();
		
		expect(await browser.getCurrentUrl()).toContain('controlpanel');
    });
});

