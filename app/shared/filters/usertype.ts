import { TranslateService } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'usertype' })
export class UsertypePipe implements PipeTransform {
	constructor(private translate: TranslateService) { }

	transform(user: any, size?: 'short' | 'normal') {
		if (!size)
			size = 'normal';

		if (typeof (user) == 'string') {
			user = { usertype: user, subtype: 'none' };
		}

		if (user.usertype == 'npo' && user.username == 'helperbit')
			return this.translate.instant('company');
		else if (user.usertype == 'npo' && user.subtype == 'municipality')
			return this.translate.instant('municipality');
		else if (user.usertype == 'npo' && user.subtype == 'school')
			return this.translate.instant('school');
		else if (user.usertype == 'npo' && user.subtype == 'park')
			return this.translate.instant('park');
		else if (user.usertype == 'npo' && user.subtype == 'cultural')
			return this.translate.instant('cultural');
		else if (user.usertype == 'npo' && user.subtype == 'hospital')
			return this.translate.instant('hospital');
		else if (user.usertype == 'npo' && user.subtype == 'civilprotection')
			return this.translate.instant('civil protection');
		else if (user.usertype == 'npo' && user.subtype == 'none' && user.username != 'helperbit') {
			if (size === 'short')
				return this.translate.instant('npo');
			else
				return this.translate.instant('non-profit organization');
		} else if (user.usertype == 'singleuser')
			return this.translate.instant('user');
		else if (user.usertype == 'company')
			return this.translate.instant('company');
	}
}