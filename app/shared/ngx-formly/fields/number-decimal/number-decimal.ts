import { Component, OnInit } from "@angular/core";
import { FieldType } from "@ngx-formly/core";


@Component({
	selector: 'formly-field-dropzone',
	templateUrl: 'number-decimal.html',
	styleUrls: ['number-decimal.scss']
})
export class FormlyFieldNumberDecimal extends FieldType implements OnInit {
	public showErrorNumberDeciamal: boolean;
	
	constructor() {
		super();

		this.showErrorNumberDeciamal = false;
	}

	ngOnInit() {
		this.formControl.valueChanges.subscribe((n: number) => {
			let err = false;
			if(typeof this.formControl.errors == 'object' && this.formControl.errors != null) {
				for(const key in this.formControl.errors) {
					if(this.formControl.errors[key]) {
						err = true;
						break;
					}
				}
				
				this.showErrorNumberDeciamal = !this.formControl.pristine && err;
			}
			else
				this.showErrorNumberDeciamal = err;
		});
	}
}