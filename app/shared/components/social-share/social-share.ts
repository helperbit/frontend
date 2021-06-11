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

import { TranslateService } from '@ngx-translate/core';
import { OnChanges, Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import AppSettings from 'app/app.settings';

/** Share buttons for supported socials 
 *	title: The title to show
 *	hashtags: The words to tag
 *	tags: A json object that contains the tagged user for each social; the correct user replace
 *		{tag} in title. If a tag is not present for a social, it put the 'default' value	
 */

export interface SocialShareConfig {
	title: string;
	hashtags?: string[];
	socialsUsernames?: any;
	url?: string;
}

export interface SocialShareStyle {
	type?: 'block' | 'circle' | 'default';
	colored: boolean;
	size?: number;
	spaced?: boolean;
}


@Component({
	selector: 'social-share',
	templateUrl: 'social-share.html',
	styleUrls: ['social-share.scss']
})
export class SocialShareComponent implements OnChanges {
	@Input() hideLink: boolean;
	@Input('socialStyle') style: SocialShareStyle;
	@Input('socialConfig') config: SocialShareConfig;

	encodedUrl: string;
	buttons: any;

	constructor(
		private location: Location,
		private translate: TranslateService
	) { }

	private setClass(buttonType) {
		let res = 'icon-new';

		switch (this.style.type) {
			case 'circle':
				res = res.concat(' icon-circle');
				break;
			case 'block':
				if (this.hideLink) 
					res = res.concat(' icon-block-2');
				else
					res = res.concat(' icon-block');
				break;
		}

		if (this.style.spaced || this.style.type == 'circle')
			res = res.concat(' icon-spaced');

		switch (this.style.size) {
			case 1: {
				res = res.concat(' icon-1x');
				break;
			}
			case 1.5: {
				res = res.concat(' icon-1-5x');
				break;
			}
			case 2: {
				res = res.concat(' icon-2x');
				break;
			}
			case 2.5: {
				res = res.concat(' icon-2-5x');
				break;
			}
			default: {
				res = res.concat(' icon-1x');
				break;
			}
		}

		if (this.style.colored) {
			switch (buttonType) {
				case 'facebook': {
					res = res.concat(' icon-facebook');
					break;
				}
				case 'twitter': {
					res = res.concat(' icon-twitter');
					break;
				}
				case 'linkedin': {
					res = res.concat(' icon-linkedin');
					break;
				}
				case 'google': {
					res = res.concat(' icon-google');
					break;
				}
				default: {
					res = res.concat(' icon-default');
					break;
				}
			}
		} else {
			res = res.concat(' icon-default');
		}

		return res;
	}

	private formatTitle(social: string, title: string) {
		if (this.config.socialsUsernames[social])
			return title.replace('__USERNAME__', '@' + this.config.socialsUsernames[social]);
		else
			return title.replace('__USERNAME__ ', '');
	}

	ngOnChanges(changes) {
		if (!changes.config && !this.config)
			return;

		if (this.config.url)
			this.encodedUrl = encodeURIComponent(this.config.url);
		else
			this.encodedUrl = encodeURIComponent(AppSettings.baseUrl + this.location.path());

		if (!('type' in this.style))
			this.style.type = 'default';

		if (!('hashtags' in this.config))
			this.config.hashtags = [];

		if (!('socialsUsernames' in this.config))
			this.config.socialsUsernames = {};

		this.buttons = {
			facebook: {
				href: 'https://www.facebook.com/dialog/share?app_id=923885957687450&display=page&href=' + this.encodedUrl + 'redirect_uri=' + this.encodedUrl + '&caption=' + this.formatTitle('facebook', this.config.title),
				target: '_blank',
				class: this.setClass('facebook'),
				icon: 'fa-facebook',
				show: true,
				tooltip: {
					content: this.translate.instant('Share on') + ' Facebook'
				}
			},
			twitter: {
				href: 'https://twitter.com/share?url=' + this.encodedUrl + '&text=' + this.formatTitle('twitter', this.config.title) + '&via=helperbit&hashtags=' + this.config.hashtags.join(','),
				target: '_blank',
				class: this.setClass('twitter'),
				icon: 'fa-twitter',
				show: true,
				tooltip: {
					content: this.translate.instant('Share on') + ' Twitter'
				}
			},
			linkedin: {
				href: 'http://www.linkedin.com/shareArticle?url=' + this.encodedUrl + '&title=' + this.config.title,
				target: '_blank',
				class: this.setClass('linkedin'),
				icon: 'fa-linkedin',
				show: false,
				tooltip: {
					content: this.translate.instant('Share on') + ' Linkedin'
				}
			},
			google: {
				href: 'https://plus.google.com/share?url=' + this.encodedUrl,
				target: '_blank',
				class: this.setClass('google'),
				icon: 'fa-google',
				show: false,
				tooltip: {
					content: this.translate.instant('Share on') + ' Google'
				}
			},
			link: {
				href: 'javascript:void(0)',
				target: '_this',
				class: this.setClass('link'),
				icon: 'fa-link',
				show: !this.hideLink,
				tooltip: {
					content: this.translate.instant('Click to copy the address URL')
				}
			}
		};
	}
}