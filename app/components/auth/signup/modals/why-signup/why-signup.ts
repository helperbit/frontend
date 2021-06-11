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