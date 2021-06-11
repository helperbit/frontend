import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfig } from '../../../../../shared/components/modal/oldModal/modal';
import { ModalComponent2 } from 'app/shared/components/modal/modal';

export function openModalNotSaved(modalService: NgbModal, config: ModalConfig): NgbModalRef {
	const modalRef: NgbModalRef = modalService.open(ModalNotSavedComponent, {
		size: 'lg'
	});
	modalRef.componentInstance.config = config;
	// modalRef.result.then((v) => {  }, () => { });

	return modalRef;
}

@Component({
	selector: 'modal-not-saved',
	templateUrl: 'not-saved.html',
})
export class ModalNotSavedComponent extends ModalComponent2 {
}