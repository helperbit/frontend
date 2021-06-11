import { Component } from "@angular/core";
import { FieldType } from "@ngx-formly/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { openChooseElementsModal, ChooseElementElement } from "app/shared/components/choose-elements/choose-elements";

@Component({
	selector: 'formly-field-choose-elements',
	templateUrl: 'choose-elements.html',
	styleUrls: ['choose-elements.scss']
})
export class FormlyFieldChooseElements extends FieldType {
	constructor (private modalService: NgbModal) {
		super();
	}

	public openModal () {
		const modalRef = openChooseElementsModal(this.modalService, this.field.templateOptions.config);

		modalRef.result.then((element: ChooseElementElement) => {
			this.formControl.setValue(element);
			this.field.templateOptions.config.selectedElementText = element.title;
			if (this.field.templateOptions.config.onChange)
				this.field.templateOptions.config.onChange(element);
		}, () => { });
	}
}