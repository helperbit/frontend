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

import { UtilsService } from '../../services/utils';
import { DashboardService } from '../../models/dashboard';
import { Component, Input, OnInit, HostListener } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { getLocalStorage } from 'app/shared/helpers/utils';

export type PolicyMethod = 'signup' | 'login';

export type PolicyModalData = {
	method: PolicyMethod;
	version: { privacy: boolean; terms: boolean };
	outdated: { privacy: boolean; terms: boolean };
};

export function openPolicyModal(modalService: NgbModal, policyModalData?: PolicyModalData): NgbModalRef {
	const modalRef = modalService.open(PolicyModalComponent, {
		size: 'lg',
		windowClass: 'policy-agree-modal',
	});

	if (policyModalData) {
		if (policyModalData.method) modalRef.componentInstance.method = policyModalData.method;
		if (policyModalData.version) modalRef.componentInstance.version = policyModalData.version;
		if (policyModalData.outdated) modalRef.componentInstance.outdated = policyModalData.outdated;
	}

	modalRef.result.then((v) => { }, () => { });

	return modalRef;
}

@Component({
	selector: 'policy-modal-component',
	templateUrl: 'modal.html',
	styleUrls: ['policy.scss']
})
export class PolicyModalComponent implements OnInit {
	@Input() method: PolicyMethod;
	@Input() version: any;
	@Input() outdated: { privacy: boolean; terms: boolean };

	loading: boolean;
	accept: { privacy: boolean; terms: boolean };
	scrolled: {
		privacy: { clickable: boolean; addClass: boolean };
		terms: { clickable: boolean; addClass: boolean };
	};

	constructor(private dashboardService: DashboardService, private utilsService: UtilsService, public modal: NgbActiveModal) {
		/* Il field method individua la modalita' di accettazione:
			- signup: accetta le ultime versioni
			- upgrade: controlla la versione attuale e quella accettata, mostra terms o privacy o entrambe ed
				aggiorna il profilo di conseguenza. La modalita' upgrade permette anche di essere reindirizzati
				alla pagina di cancellazione del profilo.
		*/

		this.method = 'signup';
		this.version = null;
		this.outdated = { terms: true, privacy: true };

		this.accept = { terms: false, privacy: false };
		this.scrolled = { terms: { clickable: false, addClass: false }, privacy: { clickable: false, addClass: false } };
		this.loading = false;
	}

	checkAlertLabel(key) {
		if (!this.scrolled[key].clickable && !this.scrolled[key].addClass)
			this.scrolled[key].addClass = true;
	}

	dismiss() {
		this.modal.dismiss('cancel');
	}

	isAccepted() {
		return !(!this.accept.privacy && this.outdated.privacy || !this.accept.terms && this.outdated.terms);
	}

	done() {
		if (this.method == 'login') {
			/* Save the new version */
			this.loading = true;
			this.dashboardService.edit({ policyversion: this.version }).subscribe(() => {
				getLocalStorage().removeItem('outdatedpolicy');
				this.modal.close(this.accept.terms && this.accept.privacy);
			}, err => {
				this.modal.close(this.accept.terms && this.accept.privacy);
			});
		}
		else
			this.modal.close(this.accept.terms && this.accept.privacy);
	}

	// @HostListener('scroll', ['$event']) ? ho trovato questo
	scrolling(what: 'terms' | 'privacy', event) {
		let toBottom = false;

		if (event.originalTarget) {
			toBottom = event.originalTarget.scrollTop >= event.originalTarget.scrollTopMax;
		} else if (event.srcElement){
			toBottom = event.srcElement.scrollTop >= (event.srcElement.scrollHeight - event.srcElement.clientHeight);
		} else {
			toBottom = true;
		}

		if (what == 'terms' && toBottom)
			this.scrolled = { ...this.scrolled, terms: { ...this.scrolled.terms, clickable: true } };
		else if (what == 'privacy' && toBottom)
			this.scrolled = { ...this.scrolled, privacy: { ...this.scrolled.privacy, clickable: true } };
	}

	ngOnInit() {
		//TODO - indagare meglio
		//sembra che gli input ricevuti in una modal siano accessibili nell'ngOnInit e non nell'ngOnChanges
		// if(changes.resolve && changes.resolve.currentValue.modalData) {
		// 	const modalData = changes.resolve.currentValue.modalData;
		// 	if(modalData.method) this.method = modalData.method;
		// 	if(modalData.version) this.version = modalData.version;
		// 	if(modalData.outdated) this.outdated = modalData.outdated;
		// }
		// if(changes.method && changes.method.currentValue)
		// 	this.method = changes.method.currentValue;

		// if(changes.version && changes.version.currentValue)
		// 	this.version = changes.version.currentValue;

		// if(changes.outdated && changes.outdated.currentValue)
		// 	this.outdated = changes.outdated.currentValue;

		if (this.version === null)
			this.utilsService.getPlatformInfoBase().subscribe(info => {
				this.version = info.policyversion;
			});
	}
}