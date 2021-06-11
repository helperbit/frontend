import { browser, by, element } from 'protractor';
import { CommonPage } from '../common.po';


export class EditPage extends CommonPage {
    async navigateTo() {
		browser.waitForAngularEnabled(false);
        await browser.get(browser.baseUrl + 'me/edit');
		await this.waitForPageChange('me/edit');
    }

}
