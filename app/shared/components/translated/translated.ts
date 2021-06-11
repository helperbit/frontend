import { TranslateService } from '@ngx-translate/core';
import AppSettings from "../../../app.settings";
import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'translated',
	templateUrl: 'translated.html',
	styleUrls: ['translated.scss']
})
export class TranslatedComponent implements OnInit {
	@Input() lang: string;
	@Input() langs?: string[];

	slangs: string[];
	visible: boolean;

	constructor(private translate: TranslateService) {
		this.visible = false;
		this.slangs = null;
	}

	private updateVisibility() {
		if (this.lang == this.translate.currentLang || (this.slangs.indexOf(this.translate.currentLang) == -1 && this.lang == 'en'))
			this.visible = true;
		else
			this.visible = false;
	}

	ngOnInit() {
		this.slangs = AppSettings.languages;

		if (this.langs)
			this.slangs = this.langs;

		this.translate.onLangChange.subscribe(() => {
			this.updateVisibility();
		});

		this.updateVisibility();
	}
}