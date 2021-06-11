import { TranslateService } from '@ngx-translate/core';
import { StaticPageBase } from "./static-page-base";
import { Component } from '@angular/core';
import { UtilsService } from 'app/services/utils';


@Component({
	selector: 'static-legal-body-verify-component',
	templateUrl: 'legal-body-verify.html',
	styleUrls: ['static-page.scss']
})
export class StaticLegalBodyVerifyComponent extends StaticPageBase {
	constructor(utilsService: UtilsService, translate: TranslateService) {
		super(translate, utilsService, (translate) => ({
			header: {
				title: translate.instant('Verification process for a Legal Body')
			},
			image: {
				url: '/media/staticpages/npo_verification.png',
				alt: translate.instant('Verification process for a Legal Body')
			},
			meta: {
				title: translate.instant('Verification process for a Legal Body'),
				image: '/media/staticpages/npo_verification.png',
				description: translate.instant('The verification procedure for non-profit organizations, public and private bodies allows these users to start transparent fundraising and receive bitcoin donations.')
			}
		}));
	}
}
