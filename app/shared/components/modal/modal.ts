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

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalConfig } from './oldModal/modal';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigationStart, Router } from '@angular/router';

export function openModal(modalService: NgbModal, config: ModalConfig) {
	const modalRef = modalService.open(ModalComponent2, {
		size: 'lg'
	});
	modalRef.componentInstance.config = config;

	return modalRef;
}

@Component({
	selector: 'modal2',
	templateUrl: 'modal.html',
	styleUrls: ['modal.scss']
})
export class ModalComponent2<T = {}> implements OnInit, OnDestroy {
	@Input() config: ModalConfig & T;

	constructor(public activeModal: NgbActiveModal, private router: Router) { }

	ngOnDestroy() {
		this.activeModal.dismiss();
	}

	ngOnInit() {
		this.router.events.subscribe(e => {
			if (e instanceof NavigationStart) {
				this.ngOnDestroy();
			}
		});
	}
}