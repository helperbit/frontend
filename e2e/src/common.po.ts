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

import { browser, ExpectedConditions, by, element } from 'protractor';

export class CommonPage {
	async checkCaptcha() {
		await browser.switchTo().frame(0);

		var checkbox = element(by.css(".recaptcha-checkbox-border")); // recaptcha-checkbox-checkmark"));
		await browser.actions().mouseMove(checkbox as any).perform();
		await browser.sleep(500);
		await checkbox.click();
		await browser.sleep(1500);
		const handles = await browser.getAllWindowHandles();
		await browser.switchTo().window(handles[0]);
	}

	async fillInput(el, text) {
		await el.click()
		await el.clear();
		await el.sendKeys(text);
	}

	async waitForPageChange(urlContains: string = null, timeout: number = 5000) {
		const current = await browser.getCurrentUrl();

		await browser.wait(async () => {
			if (urlContains)
				return (await browser.getCurrentUrl()).indexOf(urlContains) != -1;
			else
				return (await browser.getCurrentUrl()).indexOf(current) == -1;
		}, timeout);
	}

	async waitSeconds(seconds: number = 1) {
		return await browser.sleep(seconds * 1000)
	}

	async waitForElement(finder, timeout: number = 15000) {
		return await browser.wait(
			ExpectedConditions.not(ExpectedConditions.presenceOf(finder)),
			timeout
		);
	}
}