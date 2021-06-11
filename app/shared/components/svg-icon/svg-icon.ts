import { Component, Input } from '@angular/core';

@Component({
	selector: 'svg-icon',
	templateUrl: 'svg-icon.html',
	styleUrls: ['svg-icon.scss']
})

export class SVGIconComponent {
	@Input() iconId: string;
	@Input() iconSrc: string;
};