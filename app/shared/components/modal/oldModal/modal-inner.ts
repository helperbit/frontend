import { Component, Input } from '@angular/core';
import { ModalConfig } from './modal';

@Component({
	selector: 'modal-inner',
	templateUrl: 'modal-inner.html',
})
export class ModalInnerComponent {
	@Input() config: ModalConfig;

	constructor() {}

	onConfirm() {
		this.config.confirm.method.apply(null, this.config.confirm.parameters)
	}
}
