import { cropString } from "../../shared/helpers/utils";
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'crop' })
export class CropPipe implements PipeTransform {
	transform(str: string, len: number): string {
		return cropString(str, len);
	}
}