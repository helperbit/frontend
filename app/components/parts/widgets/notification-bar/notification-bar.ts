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

