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

// import * as html2canvas from 'html2canvas';
import { UtilsService } from '../../../../services/utils';
import AppSettings from '../../../../app.settings';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgWizardStep } from 'app/shared/helpers/ng-wizard-step';
import { TranslateService } from '@ngx-translate/core';
import { WizardComponent } from 'angular-archwizard';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { getLocalStorage } from 'app/shared/helpers/utils';

export function openFeedbackModal(modalService: NgbModal) {
	modalService.open(FeedbackComponent, {
		size: 'lg',
		centered: true,
		backdrop: 'static',
		keyboard: false
	}).result.then((v) => { }, () => { });
}

/** Feedback modal */
@Component({
	selector: 'feedback',
	templateUrl: 'feedback.html'
})
export class FeedbackComponent implements OnInit {
	public wizardHandler: WizardComponent;
	wizard: {
		step0: NgWizardStep<{
			email: string;
			description: string;
			// capture: boolean;
		}>;
		step1: NgWizardStep<void>;
	};

	@ViewChild(WizardComponent) set contentMulti(content: WizardComponent) {
		this.wizardHandler = content;

		this.wizard.step0.setHandler(this.wizardHandler);
		this.wizard.step0.setHandler(this.wizardHandler);
	};

	constructor(
		private utilsService: UtilsService,
		public activeModal: NgbActiveModal,
		translate: TranslateService,
	) {
		this.wizard = { step0: new NgWizardStep(), step1: new NgWizardStep() };

		this.wizard.step0.setTitles({ main: 'Info' });


		//description
		this.wizard.step0.addField({
			type: 'textarea',
			key: 'description',
			templateOptions: {
				label: translate.instant('Description'),
				placeholder: translate.instant('Leave us a feedback, suggestion or comments...'),
				required: true,
				hideAsterisk: true,
				minLength: AppSettings.form.length.min.feedback.description,
				// labelPlaceholder: true
			}
		});

		//email
		this.wizard.step0.addField({
			type: 'email',
			key: 'email',
			templateOptions: { //margin-bottom-15
				label: translate.instant('Email'),
				placeholder: translate.instant('Email'),
				required: true,
				hideAsterisk: true,
				labelPlaceholder: true
			}
		});

		//capture
		// this.wizard.step0.addField({
		// 	type: 'checkbox',
		// 	key: 'capture',
		// 	templateOptions: { //margin-bottom-15
		// 		label: translate.instant('Include a capture of the current page')
		// 	}
		// });

		this.wizard.step0.addField({ type: 'recaptcha', key: 'captcha' });


		//FINISH
		this.wizard.step1 = NgWizardStep.createFinishStep(translate);
	}


	submit(model) {
		this.wizard.step0.resetResponse();

		const json = {
			description: model.description + '\n USER AGENT: ' + window.navigator.userAgent,
			email: model.email,
			file: null
		};

		// Without screen
		// if (!model.capture) {
		return this.utilsService.sendFeedback(json).subscribe(_ => {
			this.wizard.step0.next();
		}, (res) => {
			this.wizard.step0.captchaExpire();
			this.wizard.step0.setResponse('error', res.error);
		});
		// }

		/*
		// With screen
		$('.modal').hide();
		$('.modal-backdrop').hide();

		(html2canvas as any)(document.body).then((canvas) => {
			canvas.toBlob((blob) => {
				json.file = blob;

				this.utilsService.sendFeedback(json).subscribe(_ => {
					$('.modal').show();
					$('.modal-backdrop').show();
					this.wizard.step0.next();
				}, res => {
					$('.modal').show();
					$('.modal-backdrop').show();
					this.wizard.step0.captchaExpire();
					this.wizard.step0.setResponse('error', res.error);
				});
			});
		});*/
	}

	ngOnInit() {
		this.wizard.step0.initializeModel({
			email: getLocalStorage().getItem('email'),
			// capture: false,
			description: ''
		});
	}
}