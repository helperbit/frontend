import { Component, OnInit } from '@angular/core';
import { getLocalStorage } from 'app/shared/helpers/utils';
import { NotificationVisualizable, NotificationService } from 'app/models/notifications';
import { AuthService } from 'app/models/auth';

@Component({
	selector: '[notification-bar]',
	templateUrl: 'notification-bar.html',
	styleUrls: ['notification-bar.scss']
})
export class NotificationBarComponent implements OnInit {
	logged: boolean;
	notifications: NotificationVisualizable[];
	unread: number;

	constructor(
		private notificationService: NotificationService,
		private authService: AuthService
	) {
		this.notifications = [];
		this.unread = 0;
	}

	notificationClick(n) {
		if (!n.unread)
			return;

		this.notificationService.read(n._id).subscribe((data) => {
			this.notificationService.onUpdate.emit('header');

			n.unread = false;

			if (this.unread > 0)
				this.unread -= 1;
		});
	}

	updateNotifications() {
		if (!getLocalStorage().getItem('token')) return;

		this.notificationService.getVisualizableList().then(nf => {
			this.notifications = nf.notifications;
			this.unread = nf.unread;
		});
	}

	ngOnInit() {
		this.authService.onLoginStatusChange.subscribe(logged => {
			if (logged)
				this.updateNotifications();
		});

		this.notificationService.onUpdate.subscribe(from => {
			if (from != 'header')
				this.updateNotifications();
		});

		setInterval(() => { this.updateNotifications() }, 60000);
		this.updateNotifications();
	}
}

