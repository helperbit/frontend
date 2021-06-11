import { browser, by, element } from 'protractor';
import { CommonPage } from '../common.po';

export class LoginPage extends CommonPage {
    navigateTo() {
        return browser.get(browser.baseUrl + 'auth/signup') as Promise<any>;
    }

    signupButton() {
        return element(by.css('button[type=submit]'));
    }
}
