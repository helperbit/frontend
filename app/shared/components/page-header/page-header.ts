import { Component, Input } from "@angular/core";
import { ActivatedRoute } from '@angular/router';

type PageHeaderBox = {
	title: string;
	subTitle?: string;
};

export type PageHeaderConfig = {
	description?: PageHeaderBox;
	info?: {
		boxes: PageHeaderBox[];
	};
};

@Component({
	selector: 'page-header',
	templateUrl: 'page-header.html',
	styleUrls: ['page-header.scss']
})

export class PageHeaderComponent {
	wizardProcedureEnable: boolean;
	@Input() config: PageHeaderConfig;

	constructor(private route: ActivatedRoute) {
		this.wizardProcedureEnable = false;
	}

	ngOnInit(){
		if (this.route.snapshot.data.meta && this.route.snapshot.data.meta.showWizardProcedure) {
			this.wizardProcedureEnable = true;
		}
	}
}