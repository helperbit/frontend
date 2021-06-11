import { TranslateService } from '@ngx-translate/core';
import { StaticPageBase } from "./static-page-base";
import { Component } from '@angular/core';
import { UtilsService } from 'app/services/utils';


@Component({
	selector: 'static-manifesto-component',
	templateUrl: 'manifesto.html',
	styleUrls: ['static-page.scss']
})
export class StaticManifestoComponent extends StaticPageBase {
	constructor(utilsService: UtilsService, translate: TranslateService) {
		super(translate, utilsService, (translate) => ({
			header: {
				title: translate.instant('Helperbit\'s Manifesto')
			},
			image: {
				url: '/media/staticpages/manifesto.png',
				alt: translate.instant('manifesto')
			},
			meta: {
				title: translate.instant('Helperbit\'s Manifesto'),
				image: '/media/staticpages/manifesto.png',
				description: translate.instant('Introduction to the vision that brought to the foundation of Helperbit, the role of the blockchain technology in the donation transparency platform and the ambitions of the startup.')
			}
		}));
	}
}
