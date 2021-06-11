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