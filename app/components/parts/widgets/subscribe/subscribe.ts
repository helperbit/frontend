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
