import * as $ from 'jquery';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

export type ModalConfig = {
	title?: string;
	description?: string;
	id?: string;
	modalClass?: string;
	hideCloseButton?: boolean;
	//TODO delete underafter modal migration
	confirm?: {
		description: string;
		method: any;
		parameters: any;
	};
};

export type ModalsConfig = {
	[modalName: string]: ModalConfig;
};

@Component({
	selector: 'modal',
	templateUrl: 'modal.html',
})
export class ModalComponent implements OnDestroy, OnInit {
	@Input() config: ModalConfig;

	constructor(private router: Router) {	}

	ngOnDestroy() {
		$('.modal-backdrop').remove();
		$('#' + this.config.id).modal('hide');
	}

	ngOnInit() {
		this.router.events.subscribe(e => {
			if (e instanceof NavigationStart) {
				this.ngOnDestroy();
			}
		});
	}
}
