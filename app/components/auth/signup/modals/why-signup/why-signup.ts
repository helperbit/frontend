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

import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfig } from '../../../../../shared/components/modal/oldModal/modal';
import { ModalComponent2 } from 'app/shared/components/modal/modal';

export interface UserTypeInfo { symbol: string; text: string }

export function openModalWhySignup(modalService: NgbModal, config: ModalConfig & { userTypeInfo: UserTypeInfo[] }): NgbModalRef {
	const modalRef: NgbModalRef = modalService.open(ModalWhySignupComponent, {
		size: 'lg'
	});
	modalRef.componentInstance.config = config;

	return modalRef;
}

@Component({
	selector: 'modal-why-signup',
	templateUrl: 'why-signup.html',
	styleUrls: ['why-signup.scss']
})
export class ModalWhySignupComponent extends ModalComponent2<{ userTypeInfo: UserTypeInfo[] }> {
}