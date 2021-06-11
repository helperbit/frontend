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

import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService, NotificationVisualizable } from '../../../models/notifications';
import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'me-notifications-component',
	templateUrl: 'notifications.html',
	styleUrls: ['../../../sass/main/custom/page.scss', 'notifications.scss']
})
export class MeNotificationsComponent implements OnInit {
	notifications: NotificationVisualizable[];
	unread: number;
	pageHeader: PageHeaderConfig;

	constructor(translate: TranslateService, private notificationService: NotificationService) {
		this.notificationService = notificationService;

		this.notifications = [];
		this.unread = 0;

		this.pageHeader = {
			description: {
				title: translate.instant('notifications'),
				subTitle: translate.instant('Read your profile notifications')
			}
		}
	}

	private updateNotifications() {
		this.notificationService.getVisualizableList().then(nf => {
			this.notifications = nf.notifications;
			this.unread = nf.unread;
		});
	}

	notificationClick(n) {
		if (!n.unread)
			return;

		this.notificationService.read(n._id).subscribe(_ => {
			this.notificationService.onUpdate.emit('view');
			n.unread = false;

			if (this.unread > 0)
				this.unread -= 1;
			//if (n.redirect)
			//	$location.path (n.redirect);
		}, err => {
			//if (n.redirect)
			//	$location.path (n.redirect);
		});
	}

	pageClass() {
		if (this.notifications.length === 0)
			return 'page-tiny';
		else
			return 'page-large';
	}

	readAll() {
		for (let i = 0; i < this.notifications.length; i++) {
			this.notifications[i].unread = false;
			this.unread -= 1;

			this.notificationService.read(this.notifications[i]._id).subscribe(_ => {
				this.notificationService.onUpdate.emit('view');
			});
		}
	}

	ngOnInit() {
		this.updateNotifications();

		this.notificationService.onUpdate.subscribe(from => {
			if (from != 'view')
				this.updateNotifications();
		});
	}
}
