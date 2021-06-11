import { FieldType, FormlyFieldConfig } from "@ngx-formly/core";
import { Component, Inject } from "@angular/core";
import { openPolicyModal } from "app/components/policy/policy";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
	selector: 'formly-field-policy-consent',
	templateUrl: 'policy-consent.html',
	styleUrls: ['policy-consent.scss']
})
export class FormlyFieldPolicyConsent extends FieldType {
	constructor(private modalService: NgbModal) {
		super();
	}

	policyModal (event) {
		event.preventDefault();
		const modalRef = openPolicyModal(this.modalService);

		modalRef.result.then(value => { 
			this.form.get(this.field.key).setValue(value);
			this.field.formControl.updateValueAndValidity({onlySelf: false, emitEvent: true});
		}, () => {
			//TODO a che serve?
			// this.terms = false;
		});
	}

	prePopulate(field: FormlyFieldConfig) {
		field.validators = {
			policy: () => field.model[field.key]
		};
	}
}