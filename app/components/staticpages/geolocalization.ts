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
