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
import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { ModalConfig } from '../../../shared/components/modal/oldModal/modal';
import { AuthService } from '../../../models/auth';
import { DashboardService } from '../../../models/dashboard';
import { UtilsService } from '../../../services/utils';
import AppSettings from '../../../app.settings';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { FormGroupEx } from '../../../shared/ngx-formly/form-group-ex';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputSelectDateNumber } from '../../../shared/components/date-selector/date-selector';
import { DropzoneFile } from '../../../shared/components/dropzone/dropzone';
import { Tags, TString } from 'app/models/common';
import { Project } from 'app/models/project';
import { ChooseElementElement } from '../../../shared/components/choose-elements/choose-elements';
import { getLocalStorage } from 'app/shared/helpers/utils';
import { CookieService } from 'ngx-cookie-service';
import { OnTranslateLoad } from 'app/shared/helpers/on-translate-load';

const ga = window.ga;

@Component({
	selector: 'login-component',
	templateUrl: './login.html',
	styleUrls: ['../../../sass/main/custom/page.scss', 'login.scss']
})
export class LoginComponent extends OnTranslateLoad implements OnInit {
	localStorage = getLocalStorage();
	pageHeader: PageHeaderConfig;
	modals: { [modalName: string]: ModalConfig };
	form: FormGroupEx<{
		username?: string;
		password?: string;
		date: InputSelectDateNumber;
		myFiles: DropzoneFile[];
		decimal: number;
		tags: Tags[];
		myElement: ChooseElementElement;
		multiText: TString;
	}>;
	projects: {
		originals: Project[];
		edited: ChooseElementElement[];
	};

	constructor(
		private dashboardService: DashboardService,
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute,
		private utilsService: UtilsService,
		private cookieService: CookieService,
		translate: TranslateService
	) {
		super(translate);
	}

	ngOnTranslateLoad(translate) {
		this.pageHeader = {
			description: {
				title: translate.instant('login'),
				subTitle: translate.instant('Log into your account')
			}
		};

		this.modals = {
			socialFailed: {
				id: 'socialFailedModal',
				// modalClass: 'modal-md',
				// hideCloseButton: true,
				title: translate.instant('Social Login')
			},
			activation: {
				id: 'activationModal',
				// modalClass: 'modal-md',
				// hideCloseButton: true,
				title: translate.instant('Account activation')
			},
			activationResend: {
				id: 'activationResendModal',
				// modalClass: 'modal-md',
				// hideCloseButton: true,
				title: translate.instant('Resend Account activation')
			},
		};

		/* FORMS */

		this.form = new FormGroupEx();

		this.form.addField({
			type: 'input',
			key: 'username',
			validators: {
				validation: [
					Validators.minLength(AppSettings.form.length.min.username)
				]
			},
			templateOptions: {
				type: 'text',
				placeholder: translate.instant('Username or Email'),
				required: true,
				hideAsterisk: true,
				labelPlaceholder: true
			}
		});

		this.form.addField({
			type: 'password_nolabel',
			key: 'password',
			templateOptions: {
				required: true,
				hideAsterisk: true,
				labelPlaceholder: true
			}
		});

		if (AppSettings.features.captcha)
			this.form.addField({ type: 'recaptcha', key: 'captcha' });
	}

	socialLogin(socialName) {
		window.location.href = AppSettings.apiUrl + '/auth/social/' + socialName + '/login';
	}

	submit(model) {
		this.form.resetResponse();

		const json = {
			user: model.username.toLowerCase(),
			password: model.password,
			language: null
		};

		if (window.navigator.languages.length > 0)
			json.language = window.navigator.languages[0].substr(0, 2);

		this.authService.login(json).subscribe(data => {
			const expireDate = new Date();
			expireDate.setDate(expireDate.getDate() + 1);

			this.cookieService.set('token', data.token, null, '/');
			this.localStorage.setItem('token', data.token);
			this.localStorage.setItem('username', data.username);
			this.localStorage.setItem('email', data.email);
			this.localStorage.setItem('usertype', data.usertype);

			this.authService.onLoginStatusChange.emit(true);

			ga('send', {
				hitType: 'event',
				eventCategory: 'User',
				eventAction: 'login',
				eventLabel: data.username
			});

			if (this.route.snapshot.paramMap.has('redirect')) {
				window.open(AppSettings.baseUrl + this.route.snapshot.paramMap.get('redirect'), "_self");
				return;
			}

			this.utilsService.snackbar("You are now logged in as '" + data.username + "'");

			/* Check for outdated privacy and terms */
			const outdated = { terms: false, privacy: false };
			if (data.policyversion.current.terms !== data.policyversion.accepted.terms) {
				outdated.terms = true;
			}
			if (data.policyversion.current.privacy !== data.policyversion.accepted.privacy) {
				outdated.privacy = true;
			}
			this.localStorage.setItem('outdatedpolicy', JSON.stringify(outdated));

			if (outdated.terms || outdated.privacy) {
				// const modalI = this.$uibModal.open({
				// 	component: 'policyModalComponent',
				// 	size: 'lg',
				// 	backdrop: 'static',
				// 	keyboard: false,
				// 	resolve: {
				// 		modalData: () => {
				// 			return {
				// 				method: 'login',
				// 				outdated: outdated,
				// 				version: data.policyversion.current
				// 			};
				// 		}
				// 	}
				// });

				// return modalI.result.then((v) => {
				// 	this.localStorage.setItem('outdatedpolicy', JSON.stringify({ terms: false, privacy: false }), expireDate);
				// 	this.router.navigateByUrl('/');
				// }, () => {
				// 	this.router.navigateByUrl('/me/delete');
				// });
			}

			/* Redirect the user */
			switch (data.usertype) {
				case 'npo':
					this.dashboardService.getNPOStatus().then(status => {
						if (status)
							this.router.navigateByUrl('/');
						else
							this.router.navigateByUrl('/me/edit');
					});
					break;
				case 'singleuser':
					this.router.navigateByUrl('/me/controlpanel');
					break;
				default:
					this.router.navigateByUrl('/me/edit');
			}
		}, res => {
			this.form.captchaExpire();

			this.cookieService.delete('token', '/');
			this.localStorage.removeItem('token');
			this.localStorage.removeItem('username');
			this.localStorage.removeItem('email');
			this.localStorage.removeItem('usertype');
			this.authService.onLoginStatusChange.emit(false);
			this.form.setResponse('error', res.error);
		});
	}

	resendActivation() {
		this.form.resetResponse();

		this.authService.resendActivation(this.form.model.username.toLowerCase()).subscribe((_) => {
			$('#' + this.modals.activationResend.id).modal('show');
		}, (res) => {
			this.form.setResponse('error', res.error);
		});
	}

	ngOnInit() {
		this.ngOnTranslateLoad(this.translate);
		
		if (this.route.snapshot.queryParamMap.has('social') && this.route.snapshot.queryParamMap.has('status')) {
			if (this.route.snapshot.queryParamMap.get('status') === 'fail')
				return $('#' + this.modals.socialFailed.id).modal('show');

			const token = this.route.snapshot.queryParamMap.get('token');
			// const expiration = $routeParams.expiration;
			const username = this.route.snapshot.queryParamMap.get('username');
			const usertype = this.route.snapshot.queryParamMap.get('usertype');
			const email = this.route.snapshot.queryParamMap.get('email');

			const expireDate = new Date();
			expireDate.setDate(expireDate.getDate() + 1);

			this.localStorage.setItem('token', token);
			this.localStorage.setItem('username', username);
			this.localStorage.setItem('email', email);
			this.localStorage.setItem('usertype', usertype);
			this.authService.onLoginStatusChange.emit(true);

			ga('send', {
				hitType: 'event',
				eventCategory: 'User',
				eventAction: 'login',
				eventLabel: username
			});

			this.utilsService.snackbar("You are now logged in as '" + username + "'");
			this.router.navigateByUrl('/me/controlpanel');
		} else if (this.route.snapshot.queryParamMap.has('token') && this.route.snapshot.queryParamMap.has('email')) {
			this.authService.activate(this.route.snapshot.queryParamMap.get('email'), this.route.snapshot.queryParamMap.get('token')).subscribe((_) => {
				$('#' + this.modals.activation.id).modal('show');
				this.form.model.username = this.route.snapshot.queryParamMap.get('email');
			}, (res) => {
				this.form.setResponse('error', res.error);
			});
		}
	}
}