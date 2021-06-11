import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from "app/services/utils";

@Pipe({ name: 'stranslate', pure: false })
export class StranslatePipe implements PipeTransform {
	constructor(private utilsService: UtilsService) { }

	transform(ss: string | object) {
		return this.utilsService.getSString(ss);
	}
}