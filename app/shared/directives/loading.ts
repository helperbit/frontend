import { Directive, ElementRef, Input, OnChanges, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Directive({
	selector: '[loading]'
})
export class LoadingDirective implements AfterViewInit, OnChanges {
	@Input() loading: boolean;
	private content: string;

	constructor(
		private translate: TranslateService,
		private element: ElementRef
	) {}

	ngOnChanges(changes) {
		if(!this.content) 
			return;

		if (this.loading) {
			this.element.nativeElement.innerHTML = `<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> <span translate>${this.translate.instant('Loading')}</span>...`;
			this.element.nativeElement.disabled = true;
		} else {
			this.element.nativeElement.innerHTML = this.content;
			this.element.nativeElement.disabled = false;
		}
	}

	ngAfterViewInit() {
		this.content = this.element.nativeElement.innerHTML;
	}
}
