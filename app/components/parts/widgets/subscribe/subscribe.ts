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
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../../../services/utils';
import { Component } from '@angular/core';
import { FormGroupEx } from '../../../../shared/ngx-formly/form-group-ex';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export function openSubscribeModal(modalService: NgbModal) {
	modalService.open(SubscribeComponent, {
		size: 'lg',
		centered: true,
		backdrop: 'static',
		keyboard: false
	}).result.then((v) => { }, () => { });
}

@Component({
	selector: 'subscribe',
	templateUrl: 'subscribe.html',
	styleUrls: ['subscribe.scss']
})
export class SubscribeComponent {
	form: FormGroupEx<{ email: string }>;

	constructor(
		private utilsService: UtilsService, 
		public activeModal: NgbActiveModal,
		// private browserHelperService: BrowserHelperService, 
		private translate: TranslateService
	) {
		this.form = new FormGroupEx();

		this.form.addField({
			type: 'email',
			key: 'email',
			templateOptions: {
				required: true
			}
		});
		this.form.addField({ type: 'recaptcha', key: 'captcha' });
		// this.browserHelperService.currentResolution == 'xs' ? 'compact' : 'normal'
	}

	submit(model) {
		this.form.resetResponse();
		this.utilsService.subscribeEmail(model.email).subscribe(_ => {
			$('#subscribeModal').modal('show');
			this.form.setResponse('success', {
				text: this.translate.instant('You are now registered to our newsletter')
			});
		}, res => {
			this.form.captchaExpire();
			this.form.setResponse('error', res.error);
		});
	}
}
