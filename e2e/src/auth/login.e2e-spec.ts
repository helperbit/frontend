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

