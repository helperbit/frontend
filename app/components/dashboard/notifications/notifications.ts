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
