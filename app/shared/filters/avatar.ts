import { UtilsService } from "../../services/utils";
import AppSettings from "../../app.settings";
import { Pipe, PipeTransform } from '@angular/core';
import { getMediaUrl } from '../helpers/utils';

@Pipe({ name: 'avatar' })
export class AvatarPipe implements PipeTransform {
	constructor() { }

	transform(user: any | string) {
		if (!user)
			return AppSettings.media.avatar.singleuser.notDeclared;

		if (typeof user == 'object' && user.avatar != null)
			return getMediaUrl(user.avatar, 'image', 400);
		else if (typeof user == 'string')
			return getMediaUrl(user, 'avatar');
		else
			switch (user.usertype) {
				case 'singleuser':
					if (user.gender)
						switch (user.gender) {
							case 'm': return AppSettings.media.avatar.singleuser.male;
							case 'f': return AppSettings.media.avatar.singleuser.female;
							default: return AppSettings.media.avatar.singleuser.notDeclared;
						}
					else
						return AppSettings.media.avatar.singleuser.notDeclared;
				case 'npo':
					if (user.subtype == 'municipality') return AppSettings.media.avatar.municipality;
					else return AppSettings.media.avatar.npo;
				case 'company':
					return AppSettings.media.avatar.company;
			}
	}
}