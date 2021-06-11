import { openSubscribeModal } from "../widgets/subscribe/subscribe";
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'seo-footer-component',
	templateUrl: 'seofooter.html',
	styleUrls: ['seofooter.scss']
}) export class SeoFooterComponent {
	constructor(private modalService: NgbModal) {}

	openSubscribeModal() {
		openSubscribeModal(this.modalService);
	}
}