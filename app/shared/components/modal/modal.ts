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