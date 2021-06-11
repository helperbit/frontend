import { UtilsService } from "../../services/utils";
import { TranslateService } from '@ngx-translate/core';
import { Directive, ElementRef, Input, OnChanges } from '@angular/core';


@Directive({
	selector: '[imgAttrs]'
})
export class ImgAttrsDirective implements OnChanges {
	@Input() imgAttrs: any;
	@Input() imgSrc: string;
	@Input() imgType: string;

	constructor(
		private element: ElementRef,
		private translate: TranslateService,
		private utilsService: UtilsService
	) { }

	ngOnChanges() {
		let alt = '';
		switch (this.imgType) {
			case 'user': {
				alt += this.imgAttrs.username;
				break;
			}
			case 'event': {
				alt += this.translate.instant(this.imgAttrs.type) + ' ' + this.translate.instant('in') + ' ' + this.utilsService.getCountryOfISO(this.imgAttrs.affectedcountries);
				break;
			}
			case 'project': {
				alt += this.utilsService.getSString(this.imgAttrs.title);
				alt = alt + ' - ' + this.imgAttrs.owner;
				break;
			}
			case 'campaign': {
				alt += this.imgAttrs.title;
				alt = alt + ' - ' + this.imgAttrs.owner;
				break;
			}
			case 'activity': {
				alt += this.utilsService.getSString(this.imgAttrs.title);
				alt = alt + ' - ' + this.imgAttrs.owner;
				break;
			}
			default: {
				alt = this.imgAttrs.alt;
				break;
			}
		}

		let newSrc = this.imgSrc;

		if (this.imgAttrs.media && this.imgAttrs.media.length > 0) {
			const ns = newSrc.split('/media/');
			newSrc = ns[0] + '/m/' + ns[1] + '/t/' + alt;
		}

		// Sanitize
		newSrc = newSrc.replace(/#/g, '');

		if (alt != undefined && alt != 'undefined')
			this.element.nativeElement.alt = alt;

		this.element.nativeElement.src = newSrc;
	}
}

