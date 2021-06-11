import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'home-news-ambassador',
	templateUrl: 'ambassador.html'
})
export class HomeNewsAmbassadorComponent {
	public lang: string;

	constructor(translate: TranslateService) {
		this.lang = translate.currentLang;
	}
}