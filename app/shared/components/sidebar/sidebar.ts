import { DashboardService, UserPrivate } from '../../../models/dashboard';
import AppSettings from '../../../app.settings';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NotificationService } from 'app/models/notifications';
import { Router, NavigationStart } from '@angular/router';


@Component({
	selector: 'sidebar-component',
	templateUrl: 'sidebar.html',
	styleUrls: ['sidebar.scss']
})
export class SidebarComponent implements OnInit {
	currentRoutePath: string;
	user: UserPrivate;
	missingFields: any;
	errorsProfile: string[];
	errorsGelocalization: string[];

	constructor(
		private router: Router,
		private notificationService: NotificationService,
		private dashboardService: DashboardService,
		private location: Location
	) {
		this.user = null;
		this.currentRoutePath = null;
		this.missingFields = {
			profile: [],
			geolocalization: [],
			verification: []
		};
		this.errorsProfile = [];
		this.errorsGelocalization = [];
	}

	showCondition() {
		return this.user.usertype != 'npo'
			|| (
				this.user.trustlevel > 90
				&& this.user.receiveaddress
				&& this.user.receiveaddress.length > 0
			);
	}


	checkCurrentRoute(toCheck) {
		if (!this.currentRoutePath || !toCheck)
			return false;

		return this.currentRoutePath.indexOf(toCheck) != -1;
	}

	updateNotifications() {
		this.dashboardService.getVerify().subscribe((data) => {
			//reset profile and geolocalization notifications if were visible
			if (this.missingFields.profile.length > 0)
				this.missingFields.profile = [];
			if (this.missingFields.geolocalization.length > 0)
				this.missingFields.geolocalization = [];

			this.missingFields.verification = data.available;
		}, d => {
			const res = d.error;

			if (res.error != 'EV1')
				return;

			const profileMissingFields = [];
			const geolocalizationMissingFields = [];
			const verificationMissingFields = [];

			res.data.fields.forEach(e => {
				if (this.errorsProfile.indexOf(e) != -1) {
					profileMissingFields.push(e);
				}
				if (this.errorsGelocalization.indexOf(e) != -1) {
					geolocalizationMissingFields.push(e);
				}
			});

			this.missingFields.profile = profileMissingFields;
			this.missingFields.geolocalization = geolocalizationMissingFields;

			if (profileMissingFields.length > 0)
				verificationMissingFields.push('profile')

			if (geolocalizationMissingFields.length > 0)
				verificationMissingFields.push('geolocalization')

			this.missingFields.verification = verificationMissingFields;
		});
	}

	ngOnInit() {
		this.dashboardService.get().subscribe(user => {
			this.user = user;
			this.errorsProfile = AppSettings.verify.errors.profile;
			this.errorsGelocalization = AppSettings.verify.errors.geolocalization;
			this.currentRoutePath = this.location.path();
			this.updateNotifications();
		});

		this.notificationService.onUpdate.subscribe(_ => {
			this.updateNotifications();
		});


		this.router.events.subscribe(e => {
			if (e instanceof NavigationStart) {
				this.currentRoutePath = e.url;
			}
		});
	}
}