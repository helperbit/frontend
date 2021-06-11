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

import { Component } from '@angular/core';
import AppSettings from '../../../../app.settings';
import { UtilsService } from '../../../../services/utils';
import { TranslateService } from '@ngx-translate/core';
import { Validators } from '@angular/forms';
import { FormGroupEx } from '../../../../shared/ngx-formly/form-group-ex';

@Component({
	selector: 'about-section-contact-component',
	templateUrl: 'contact.html',
	styleUrls: ['contact.scss']
})
export class AboutSectionContactComponent {
	form: FormGroupEx<{
		lastName?: string;
		firstName?: string;
		message?: string;
		email?: string;
		subject?: string;
	}>;

	constructor(
		private translate: TranslateService,
		private utilsService: UtilsService
	) {
		this.form = new FormGroupEx();

		this.form.addField({
			type: 'input',
			key: 'firstName',
			validators: {
				validation: [
					Validators.minLength(AppSettings.form.length.min.firstName)
				]
			},
			templateOptions: {
				type: 'text',
				label: translate.instant('First Name'),
				placeholder: translate.instant('First Name'),
				required: false
			}
		});

		this.form.addField({
			type: 'input',
			key: 'lastName',
			validators: {
				validation: [
					Validators.minLength(AppSettings.form.length.min.lastName)
				]
			},
			templateOptions: {
				type: 'text',
				label: translate.instant('Last Name'),
				placeholder: translate.instant('Last Name'),
				required: false
			}
		});

		this.form.addField({
			type: 'email',
			key: 'email',
			templateOptions: {
				required: true
			}
		});

		this.form.addField({
			type: 'input',
			key: 'subject',
			validators: {
				validation: [
					Validators.minLength(AppSettings.form.length.min.contact.subject)
				]
			},
			templateOptions: {
				type: 'text',
				label: translate.instant('Subject'),
				placeholder: translate.instant('Subject'),
				required: true
			}
		});

		this.form.addField({
			type: 'textarea',
			key: 'message',
			validators: {
				validation: [
					Validators.minLength(AppSettings.form.length.min.contact.message)
				]
			},
			templateOptions: {
				label: translate.instant('Message'),
				placeholder: translate.instant('Message'),
				required: true
			}
		});

		this.form.addField({ type: 'recaptcha', key: 'captcha' });
	}

	submit(model) {
		this.form.resetResponse();

		const json: any = {
			email: model.email,
			subject: model.subject,
			message: model.message
		};

		if (model.firstName)
			json.firstname = model.firstName;

		if (model.lastName)
			json.lastname = model.lastName;

		this.utilsService.sendContact(json).subscribe(_ => {
			this.form.reset();
			this.form.setResponse('success', {
				text: this.translate.instant('Your message was sent succesfully')
			});
		}, res => {
			// this.form.captchaExpire();
			this.form.setResponse('error', res.error);
		});
	}
}