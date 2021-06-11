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

