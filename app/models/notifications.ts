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

import { ObjectId, unwrap, ISODate } from "./common";
import { TranslateService } from '@ngx-translate/core';
import AppSettings from "../app.settings";
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { interpolateString } from "app/shared/helpers/utils";

export interface Notification {
	_id: ObjectId;
	time: ISODate;
	redirect: string;
	code: string;
	unread: boolean;
	data: any;
}

export interface NotificationVisualizable extends Notification {
	text?: string;
	icon?: string;
}


@Injectable({
	providedIn: 'root'
})
export class NotificationService {
	public onUpdate: EventEmitter<string> = new EventEmitter();
	private notifications: { [code: string]: { text: string; icon: string } };


	constructor(
		private http: HttpClient,
		private translate: TranslateService
	) {
		this.notifications = {
			'1': {
				text: translate.instant("You haven't yet created a wallet; start to receive and donate by creating one"),
				icon: "bitcoin"
			},
			'2': {
				text: translate.instant("You are not geolocalized yet; set your position to receive donations"),
				icon: "globe"
			},
			'3': {
				text: translate.instant("You are not verified; start the verification process to achieve more trust"),
				icon: "check"
			},
			'4': {
				text: translate.instant("You have received a donation of {{amount}} BTC from {{from}}"),
				icon: "check"
			}, /*({{fromcountry}})*/
			'5': {
				text: translate.instant("You are now admin of {{user}}"),
				icon: "users"
			},
			'6': {
				text: translate.instant("The organization {{user}} requires your consensus for creating a new wallet '{{label}}'"),
				icon: "bitcoin"
			},
			'7': {
				text: translate.instant("The organization {{user}} wants to send a transaction from '{{label}}'; sign it now"),
				icon: "bitcoin"
			},
			'8': {
				text: translate.instant("Welcome to Helperbit!"),
				icon: "home"
			},
			'9': {
				text: translate.instant("Your password has been reset"),
				icon: "home"
			}, // Should be not visualized
			'10': {
				text: translate.instant("Your account is active"),
				icon: "home"
			}, // Should be not visualized
			'11': {
				text: translate.instant("The multisig wallet '{{label}}' has been created"),
				icon: "bitcoin"
			},
			'12': {
				text: translate.instant("You are now a verified user"),
				icon: "graduation-cap"
			},
			'13': {
				text: translate.instant("Your multisig transaction has been broadcasted"),
				icon: "send"
			},
			'14': {
				text: translate.instant("The one time code letter has been sent to your home address"),
				icon: "graduation-cap"
			},
			'15': {
				text: translate.instant("You are removed from admins of {{user}}"),
				icon: "users"
			},
			'16': {
				text: translate.instant("You have received a refund claim from {{from}} of {{value}} {{currency}}"),
				icon: "users"
			},
			'17': {
				text: translate.instant("Your refund claim to {{to}} of value {{value}} {{currency}} has been rejected with this reason: \"{{reason}}\""),
				icon: "users"
			},
			'18': {
				text: translate.instant("Your refund claim to {{to}} of value {{value}} {{currency}} has been accepted"),
				icon: "users"
			},
			'19': {
				text: translate.instant("Your refund claim to {{to}} of value {{value}} {{currency}} has been accepted and the funds has sent"),
				icon: "users"
			},
			'20': {
				text: translate.instant("The organization {{user}} wants to send a refund transaction to {{toname}} of {{value}} BTC; sign it now"),
				icon: "bitcoin"
			},
			'21': {
				text: translate.instant("Your multisig refund transaction has been broadcasted."),
				icon: "send"
			},
			'22': {
				text: translate.instant("The user {{user}} requested the invoice for a donation you received"),
				icon: "print"
			},
			'23': {
				text: translate.instant("The user {{user}} signed up using your referral link"),
				icon: "chain"
			},
			'24': {
				text: translate.instant("Your project \"{{title}}\" has been approved by Helperbit and it's now visible"),
				icon: "child"
			},
			'25': {
				text: translate.instant("Your project \"{{title}}\" has been rejected by Helperbit admin"),
				icon: "frown-o"
			},
			'30': {
				text: translate.instant("Your document Id is now verified"),
				icon: "graduation-cap"
			},
			'31': {
				text: translate.instant("Your proof of residence is now verified"),
				icon: "graduation-cap"
			},
			'32': {
				text: translate.instant("Your address is now verified"),
				icon: "graduation-cap"
			},
			'33': {
				text: translate.instant("Your documents are now verified"),
				icon: "graduation-cap"
			},
			'34': {
				text: translate.instant("You are now a fully verified user"),
				icon: "graduation-cap"
			},
			'35': {
				text: translate.instant("Your documents are now verified"),
				icon: "graduation-cap"
			},
			'36': {
				text: translate.instant("Your documents has been rejected"),
				icon: "frown-o"
			},
			'37': {
				text: translate.instant("Your statute document is now verified"),
				icon: "graduation-cap"
			},
			'38': {
				text: translate.instant("Your memorandum document is now verified"),
				icon: "graduation-cap"
			},
			'39': {
				text: translate.instant("Your admins document is now verified"),
				icon: "graduation-cap"
			},
			'40': {
				text: translate.instant("You have received a donation of {{amount}} BTC to your campaign"),
				icon: "heart"
			},
			'41': {
				text: translate.instant("Your running campaign is now expired"),
				icon: "heart"
			},
			'42': {
				text: translate.instant("Your running campaign is now concluded"),
				icon: "heart"
			},
			'43': {
				text: translate.instant("Your campaign has been deleted because it violates terms of service; check your email for more information"),
				icon: "heart"
			},
			'44': {
				text: translate.instant("Your birthday is approaching, celebrate it by creating a fundraising campaign!"),
				icon: "heart"
			},
			'50': {
				text: translate.instant("You won a merchandise object!"),
				icon: "trophy"
			},
			'51': {
				text: translate.instant("You achieved a new badge: {{badge}}"),
				icon: "trophy"
			},
			'60': {
				text: translate.instant("The organization {{user}} wants to verify the keys for the wallet '{{label}}'; sign it now"),
				icon: "bitcoin"
			}
		};
	}

	read(nid: ObjectId): Observable<any> {
		return this.http.delete(AppSettings.apiUrl + '/me/notification/' + nid,
			{ headers: { ignoreLoadingBar: String(true) } });
	}

	getList(): Observable<Notification[]> {
		return this.http.get<Notification[]>(AppSettings.apiUrl + '/me/notifications',
			{ headers: { ignoreLoadingBar: String(true) } })
			.pipe(unwrap('notifications'));
	}

	getVisualizableList(): Promise<{ unread: number; notifications: NotificationVisualizable[] }> {
		return new Promise((resolve, reject) => {
			let unread = 0;
			const vnotifications: NotificationVisualizable[] = [];

			this.getList().subscribe((notifications) => {
				for (let i = 0; i < notifications.length; i++) {
					if (notifications[i].code in this.notifications) {
						const notification: NotificationVisualizable = notifications[i];

						/* Anonymous user handling */
						if (notification.data && 'from' in notification.data && notification.data.from === null)
							notification.data.from = this.translate.instant('an anonymous user');


						notification.text = interpolateString(this.notifications[notification.code].text, notification.data || {});
						notification.icon = this.notifications[notification.code].icon;

						if (notification.unread)
							unread += 1;

						vnotifications.push(notification);
					}
				}

				return resolve({ unread: unread, notifications: vnotifications });
			});
		})
	}
}