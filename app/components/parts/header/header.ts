import { DashboardService, UserPrivate } from '../../../models/dashboard';
import { AuthService } from '../../../models/auth';
import { UtilsService } from '../../../services/utils';
import {Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { getLocalStorage } from 'app/shared/helpers/utils';
import { CookieService } from 'ngx-cookie-service';

@Component({
	selector: 'header-component',
	templateUrl: 'header.html',
	styleUrls: ['header.scss']
})
export class HeaderComponent implements OnInit {
	public isNavCollapsed: boolean = false;
	pagectrl: string;
	logged: boolean;
	user: UserPrivate;
	username: string;
	usertype: string;
	snackbar: { text: string; visible: boolean; msleft: number };
	outdatedpolicy: { terms: boolean; privacy: boolean };


	constructor(
		private authService: AuthService,
		private dashboardService: DashboardService,
		private cookieService: CookieService,
		private utilsService: UtilsService,
		private router: Router,
		private element: ElementRef
	) {
		this.logged = false;
		this.user = null;
		this.snackbar = { text: '', visible: false, msleft: 0 };
	}

	logout() {
		const cleanCookies = () => {
			this.cookieService.delete('token', '/');
			getLocalStorage().removeItem('token');
			getLocalStorage().removeItem('username');
			getLocalStorage().removeItem('email');
			getLocalStorage().removeItem('outdatedpolicy');
			window.location.href = '/';
			this.authService.onLoginStatusChange.emit(false);
		};
		if (getLocalStorage().getItem('token'))
			this.authService.logout().subscribe(() => { cleanCookies() }, () => { cleanCookies() });
		else
			window.location.href = '/';
	}


	updateLogged() {
		if (!getLocalStorage().getItem('token')) {
			this.logged = false;
			this.username = '';
			return;
		}

		this.logged = true;
		this.username = getLocalStorage().getItem('username');
		this.usertype = getLocalStorage().getItem('usertype');
		try {
			this.outdatedpolicy = JSON.parse(getLocalStorage().getItem('outdatedpolicy')) || { terms: false, privacy: false };
		} catch (err) {
			this.outdatedpolicy = { terms: false, privacy: false };
		}
		this.dashboardService.get().subscribe((user: UserPrivate) => {
			this.user = user;
		});
	}

	policyModal() {
		// const modalI = this.$uibModal.open({
		// 	component: 'policyModalComponent',
		// 	size: 'lg',
		// 	backdrop: 'static',
		// 	keyboard: false,
		// 	resolve: {
		// 		modalData: () => {
		// 			return {
		// 				method: 'login',
		// 				outdated: this.outdatedpolicy
		// 			};
		// 		}
		// 	}
		// });

		// return modalI.result.then((v) => {
		// 	this.updateLogged();
		// 	this.outdatedpolicy = { terms: false, privacy: false };
		// 	this.router.navigateByUrl('/');
		// }, () => {
		// 	this.router.navigateByUrl('/me/delete');
		// });
	}

	ngOnInit() {
		this.updateLogged();
		
		this.authService.onLoginStatusChange.subscribe(logged => {
			this.updateLogged();
		});

		this.utilsService.onSnackbar.subscribe((data: { text: string; timeout?: number }) => {
			if (this.snackbar.visible) return;

			const x = document.getElementById("snackbar");

			if (x) {
				x.className = "show";
			}
			this.snackbar.text = data.text;
			this.snackbar.visible = true;
			this.snackbar.msleft = data.timeout || 5000;

			setTimeout(() => {
				if (x) {
					x.className = x.className.replace("show", "");
				}
				this.snackbar.visible = false;
			}, this.snackbar.msleft);
		});


		this.router.events.subscribe(e => {
			if (! (e instanceof NavigationStart) || !this.element) 
				return;

			const navbar = this.element.nativeElement.querySelector('.navbar-collapse');
			if(navbar && navbar.classList.contains('in'))
				navbar.classList.remove('in');
		});
	}
}

