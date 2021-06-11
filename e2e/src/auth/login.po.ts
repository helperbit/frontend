import { browser, by, element } from 'protractor';
import { CommonPage } from '../common.po';

export const testUserCredentials = {
	"cioco3": {
		usertype: 'singleuser',
		username: 'cioco3',
		password: 'Prova1234!',
	}
}

export class LoginPage extends CommonPage {
    async navigateTo() {
		browser.waitForAngularEnabled(false);
        await browser.get(browser.baseUrl + 'auth/login');
		await this.waitForPageChange('auth/login');
    }

    async fillCredential(username: string, password: string = null) {
		if (password == null) {
			password = testUserCredentials[username].password;
			username = testUserCredentials[username].username;
		}

        await this.fillInput(element(by.css('input[type=text]')), username);
        await this.fillInput(element(by.css('input[type=password]')), password);
    }

    loginButton() {
        return element(by.css('button[type=submit]'));
	}

    errorAlert() {
        return element(by.className('alert-danger'));
	}

	async logout() {
		await browser.executeScript('window.localStorage.clear();');
		await browser.refresh();
		await this.navigateTo();
	}
	
	async loginTo(username: string, password: string = null) {
		if ((await browser.getCurrentUrl()).indexOf('login') == -1) {
			this.navigateTo();
			await this.waitSeconds(1);
		}

		await this.fillCredential(username, password);
		await this.loginButton().click();
	}
}
