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

import { buildErrorResponseMessage } from '../../../../../shared/components/response-messages/response-messages';
import { DashboardService } from '../../../../../models/dashboard';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgWizardStep } from 'app/shared/helpers/ng-wizard-step';
import { WizardComponent } from 'angular-archwizard';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'me-verify-provider-gps-component',
	templateUrl: 'gps.html',
	styleUrls: ['gps.scss']
})
export class ModalMeVerifyProviderGpsComponent implements OnInit {
	public wizardHandler: WizardComponent;

	@ViewChild(WizardComponent) set contentMulti(content: WizardComponent) {
		this.wizardHandler = content;

		this.wizard.step1.setHandler(this.wizardHandler);
		this.wizard.step2.setHandler(this.wizardHandler);
	};

	loading: boolean;
	geolocation: boolean;

	wizard: {
		step1: NgWizardStep<any>;
		step2: NgWizardStep<any>;
	};

	constructor(
		private dashboardService: DashboardService,
		private translate: TranslateService,
		public activeModal: NgbActiveModal
	) {
		this.geolocation = false;
		this.loading = false;

		/* FORMS */

		this.wizard = { step1: null, step2: null };

		//STEP 1

		this.wizard.step1 = new NgWizardStep();

		this.wizard.step1.setTitles({
			main: translate.instant('GPS'),
			heading: translate.instant('Verify your position with device geoverification')
		});

		//STEP 2
		
		this.wizard.step2 = NgWizardStep.createFinishStep(this.translate);
	}

	geolocalize() {
		navigator.geolocation.getCurrentPosition(position => {
			this.wizard.step1.resetResponse();
			this.loading = true;

			const json = {
				'lat': position.coords.latitude,
				'lon': position.coords.longitude
			};

			this.dashboardService.doVerificationStep('gps', 0, json).subscribe(_ => {
				this.loading = false;
				this.dashboardService.emitNotificationUpdate('verify');
				this.wizardHandler.goToNextStep();
			}, res => {
				this.wizard.step1.setResponse('error', buildErrorResponseMessage(res.error));
				this.loading = false;
			});
		});
	}

	ngOnInit() {
		if (navigator.geolocation)
			this.geolocation = true;
	}
}