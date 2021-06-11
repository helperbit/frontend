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

import * as $ from 'jquery';
import { ModalsConfig } from '../modal/oldModal/modal';
import { formatUrl } from '../../../shared/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import {Component, Input, OnChanges} from '@angular/core';


/** External link visualization */
@Component({
	selector: 'external-link',
	templateUrl: 'external-link.html',
	styleUrls: ['external-link.scss']
})
export class ExternalLinkComponent implements OnChanges {
	@Input() url: string;
	@Input() text: string;

	modals: ModalsConfig;
	textClickable: string;
	urlFormatted: string;

	constructor(translate: TranslateService) {
		this.modals = {
			confirm: {
				id: 'modalConfirm' + Math.floor(Math.random() * 100000),
				modalClass: 'modal-md',
				hideCloseButton: true,
				title: translate.instant('Exiting Helperbit.com'),
				confirm: {
					method: () => { window.open(this.urlFormatted, "_blank"); },
					parameters: null,
					description: translate.instant('You are leaving Helperbit.com following an external link.')
				}
			}
		};
		this.textClickable = null;
	}

	ngOnChanges(changes) {
		this.urlFormatted = formatUrl(this.url);
		if (this.text)
			this.textClickable = this.text;
		else
			this.textClickable = this.urlFormatted;
	}

	gotoLink() {
		$('#' + this.modals.confirm.id).modal('show');
	}
}
