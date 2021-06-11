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