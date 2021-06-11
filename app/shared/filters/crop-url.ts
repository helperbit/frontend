import { UtilsService } from "../../services/utils";
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cropUrl' })
export class CropUrlPipe implements PipeTransform {
	constructor() { }

	transform(url: string, what: 'url' | 'query') {
		if (what == 'url') {
			return url.split('?')[0];
		} else if (what == 'query') {
			const ps = {};
			let psplit = url.split('?');

			if (psplit.length == 1)
				return ps;

			psplit = psplit[1].split('&');
			for (let s of psplit) {
				ps[s.split('=')[0]] = s.split('=')[1];
			}
			
			return ps;
		} else {
			return url;
		}
	}
}