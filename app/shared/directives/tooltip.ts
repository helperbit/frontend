import * as $ from 'jquery';
import * as bootstrap from "bootstrap";
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

// Le direttive attributo non capisco perche' ma non sono visibili nei template ajs;
// quindi qui abbiamo la stessa implementazione per enatrmbi: toglieremo quella ajs 
// quando non la useremo piu'.

// <span [tooltip]="'ciao'" [position]="'left'">ciao</span>

@Directive({
	selector: '[tooltip]'
})
export class TooltipDirective implements OnInit {
	@Input() tooltip: string;
	@Input() position?: string;

	constructor(private element: ElementRef) {}

	ngOnInit() {
		const options: any = {
			placement: this.position || 'top',
			animation: true,
			html: true,
			trigger: 'hover',
			title: this.tooltip
		};

		$(this.element.nativeElement).tooltip('destroy');
		$(this.element.nativeElement).tooltip(options);
	}
}
