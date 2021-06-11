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
	selector: 'static-geolocalization-component',
	templateUrl: 'geolocalization.html',
	styleUrls: ['static-page.scss']
})
export class StaticGeolocalizationComponent extends StaticPageBase {
	constructor(utilsService: UtilsService, translate: TranslateService) {
		super(translate, utilsService, (translate) => ({
			header: {
				title: translate.instant('Geolocation as a Verification Process to Receive Humanitarian Aid'),
			},
			image: {
				url: '/media/staticpages/geolocalization.png',
				alt: translate.instant('geolocation as a verification process to receive humanitarian aid')
			},
			meta: {
				title: translate.instant('Geolocation as a Verification Process to Receive Humanitarian Aid'),
				image: '/media/staticpages/geolocalization.png',
				description: translate.instant('Helperbit offers different geoverification steps: according to the completed level, when a natural disaster occurs, users can receive direct donations. This does not compromise the user’s privacy, which, on the contrary, is safeguarded through appropriate procedures.')
			}
		}));
	}
}
