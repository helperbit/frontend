import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'magnitude' })
export class MagnitudePipe implements PipeTransform {
	constructor(private translate: TranslateService) { }

	transform(value: number, etype: string) {
		if (etype === undefined || etype == 'earthquake')
			return value + ' ' + this.translate.instant("Richter");
		else if (etype == 'flood') {
			if (value<=6.0) return this.translate.instant("Flood");
			else if (value>=6.0 && value<7.0) return this.translate.instant("Moderate Flood");
			else if (value>=7.0 && value<8.0) return this.translate.instant("Strong Flood");
			else if (value>=8.0 && value<9.0) return this.translate.instant("Very Strong Flood");
			else if (value>=9.0) return this.translate.instant("Extreme Flood");
		}
		else if (etype == 'wildfire') {
			if (value<=6.0) return this.translate.instant("Wildfire");
			else if (value>=6.0 && value<7.0) return this.translate.instant("Wildfire");
			else if (value>=7.0 && value<8.0) return this.translate.instant("Wildfire");
			else if (value>=8.0 && value<9.0) return this.translate.instant("Widespread Wildfire");
			else if (value>=9.0) return this.translate.instant("Very Widespread Wildfire");
		} 
		else return String(value);
	}
}