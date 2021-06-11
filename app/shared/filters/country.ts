import { UtilsService } from "../../services/utils";
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'country' })
export class CountryPipe implements PipeTransform {
	constructor(private utilsService: UtilsService) { }

	transform(isocode: string[] | string, what?: 'name' | 'string' | 'flag'): string {
		return this.utilsService.getCountryOfISO(isocode, what);
	}
}