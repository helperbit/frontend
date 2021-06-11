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
