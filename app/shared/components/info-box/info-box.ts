import { Component, Input } from '@angular/core';
import { heightExpandAnimation } from "../../../shared/helpers/utils";

export interface InfoBoxConfig {
	title: string;
	description?: string;
	link?: string;
	transclude?: boolean;
}

@Component({
	selector: 'info-box',
	templateUrl: 'info-box.html',
	styleUrls: ['info-box.scss']
})
export class InfoBoxComponent {
	@Input() config: InfoBoxConfig;
	infoBoxOpen: boolean;

	constructor() {
		this.infoBoxOpen = false;
	}

	openBox() {
		heightExpandAnimation($('.infobox-content')[0]);
		this.infoBoxOpen = !this.infoBoxOpen;
	}
}
