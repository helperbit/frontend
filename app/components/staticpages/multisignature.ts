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
import { StaticPageBase } from "./static-page-base";
import { Component } from '@angular/core';
import { UtilsService } from 'app/services/utils';

@Component({
	selector: 'static-multisignature-component',
	templateUrl: 'multisignature.html',
	styleUrls: ['static-page.scss']
})
export class StaticMultisignatureComponent extends StaticPageBase {
	constructor(utilsService: UtilsService, translate: TranslateService) {
		super(translate, utilsService, (translate) => ({
			header: {
				title: translate.instant('Multisignature Bitcoin Wallet')
			},
			image: {
				url: '/media/staticpages/wallet_multiple.png',
				alt: translate.instant('multisignature wallet')
			},
			meta: {
				title: translate.instant('Multisignature Bitcoin Wallet'),
				image: '/media/staticpages/wallet_multiple.jpg',
				description: translate.instant('Description of the bitcoin wallet used in Helperbit and its characteristics for the different types of users.')
			}
		}));
	}
}