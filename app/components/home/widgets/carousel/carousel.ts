import { BrowserHelperService } from '../../../../services/browser-helper';
import { Component, Input } from '@angular/core';

export type CarouselConfig = {
	type: 'image';
	src: string;
	link?: string;
	text: {
		bottom: string;
		link: string;
	};
	url: string;
}[];

@Component({
	selector: 'carousel',
	templateUrl: 'carousel.html',
	styleUrls: ['carousel.scss']
})
export class CarouselComponent {
	@Input() config: CarouselConfig;

	movementIndex: number;
	hidePrev: boolean;
	hideNext: boolean;
	showingElements: number;

	constructor(private browserHelperService: BrowserHelperService) {
		this.movementIndex = 0;
		this.hidePrev = false;
		this.hideNext = false;
		this.showingElements = 0;
	}

	elementLeftValue(index) {
		switch (this.browserHelperService.currentResolution) {
			case 'lg': {
				this.showingElements = 5;
				break;
			}
			case 'md': {
				this.showingElements = 4;
				break;
			}
			case 'sm': {
				this.showingElements = 2;
				break;
			}
			case 'xs': {
				this.showingElements = 1;
				break;
			}
		}

		return 'calc(100%/' + this.showingElements + '*' + (index + this.movementIndex) + ')';
	}

	checkMovementIndex() {
		this.hidePrev = this.movementIndex == 0;
		this.hideNext = this.movementIndex == -(this.config.length - this.showingElements);
	}

	elementClick(element) {
		if (!element.link) return;
		window.open(element.link, "_blank");
	}

	$onChanges(changes) {
		if (!changes.config || !changes.config.currentValue)
			return;

		this.checkMovementIndex();
	}
}
