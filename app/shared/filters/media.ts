import { UtilsService } from "../../services/utils";
import { Pipe, PipeTransform } from '@angular/core';
import { getMediaUrl } from '../helpers/utils';

@Pipe({ name: 'media' })
export class MediaPipe implements PipeTransform {
	constructor() { }

	transform(mid: string, what?: string, size?: number) {
		return getMediaUrl(mid, what, size);
	}
}