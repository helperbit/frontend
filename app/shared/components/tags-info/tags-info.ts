import { Component, Input } from '@angular/core';
import { UtilsService } from '../../../services/utils';

@Component({
	selector: 'tags-info',
	templateUrl: 'tags-info.html',
	styleUrls: ['tags-info.scss']
})
export class TagsInfoComponent {
	@Input() tags: string[];
	public tagsData;

	constructor(utilsService: UtilsService) {
		this.tagsData = utilsService.tags();
	}
}
