import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { AuthService } from '../../../models/auth';
import { Component } from '@angular/core';
import { FormGroupEx } from 'app/shared/ngx-formly/form-group-ex';
import { TranslateService } from '@ngx-translate/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'me-security-component',
	templateUrl: 'security.html',
	styleUrls: ['../../../sass/main/custom/page.scss']
})
export class MeSecurityComponent {
	pageHeader: PageHeaderConfig;

	form: FormGroupEx<{
		oldPassword: string;
		newPassword: string;
		newPasswordConfirm: string;
	}>;

	constructor(private authService: AuthService, private translate: TranslateService) {
		this.pageHeader = {
			description: {
				title: translate.instant('Security'),
				subTitle: translate.instant('Edit your security information')
			}
		};

		/* FORMS */

		this.form = new FormGroupEx();

		//newPassword
		this.form.addField({
			type: 'password',
			key: 'oldPassword',
			templateOptions: {
				label: translate.instant('Old Password'),
				placeholder: translate.instant('Old Password'),
				required: true,
			}
		});

		//oldPassword
		this.form.addField({
			type: 'password',
			key: 'newPassword',
			templateOptions: {
				label: translate.instant('New Password'),
				placeholder: translate.instant('New Password'),
				required: true,
				change: (field: FormlyFieldConfig, event?: any) => {
					if(this.form.model.newPasswordConfirm)
						this.form.setModelField('newPasswordConfirm', null);
				}
			}
		});

		//newPasswordConfirm
		this.form.addField({
			type: 'password',
			key: 'newPasswordConfirm',
			templateOptions: {
				label: translate.instant('New Password Confirm'),
				placeholder: translate.instant('New Password Confirm'),
				required: true
			},
			validators: {
				equals: {
					expression: (control: FormControl, field: FormlyFieldConfig) => control.value === this.form.model.newPassword,
					message: (err, field: FormlyFieldConfig) => translate.instant('This field must be equal to New Password')
				}
			}
		});

		this.form.addField({ type: 'recaptcha', key: 'captcha' });
	}

	public submit(model) {
		this.form.resetResponse();

		const json = {
			oldpassword: this.form.model.oldPassword,
			newpassword: this.form.model.newPassword
		};

		this.authService.changePassword(json).subscribe(_ => {
			this.form.setResponse('success', { text: this.translate.instant('Password update with success') });
		}, res => {
			this.form.captchaExpire();
			this.form.setResponse('error', res.error);
		});
	}
}