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