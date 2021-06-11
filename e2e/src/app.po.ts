import { browser, by, element } from 'protractor';
import { CommonPage } from './common.po';

export class AppPage extends CommonPage {
	navigateTo() {
		return browser.get(browser.baseUrl) as Promise<any>;
	}
}
