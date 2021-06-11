import { UtilsService } from "../../services/utils";
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'seourl' })
export class SeourlPipe implements PipeTransform {
	constructor(private utilsService: UtilsService) { }

	transform(ob: any, type: 'event' | 'project', sub?: string) {
		const toSeo = (text: string): string => text.replace(/[^\w\s]/gi, '').replace(/_/g, '').replace(/ /g, '-').toLowerCase();

		if (ob === null || ob === undefined) return '';
		else {
			switch (type) {
				case 'event':
					return '/event/' + ob._id + '/'
						+ this.utilsService.getSString(ob.type) + '-in-'
						+ toSeo(this.utilsService.getCountryOfISO(ob.affectedcountries[0]))
						+ (sub || '');
				case 'project':
					return '/project/' + ob._id + '/'
						+ toSeo(this.utilsService.getSString(ob.title))
						+ (sub || '');
			}
		}
	}
}