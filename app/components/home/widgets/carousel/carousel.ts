/* 
 *  Helperbit: a p2p donation platform (frontend)
 *  Copyright (C) 2016-2021  Davide Gessa (gessadavide@gmail.com)
 *  Copyright (C) 2016-2021  Helperbit team
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

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
