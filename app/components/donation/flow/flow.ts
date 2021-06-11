import { DonationListConfig } from "../../../shared/components/donation-list/donation-list";
import { Component } from '@angular/core';

@Component({
	selector: 'donation-flow-component',
	templateUrl: 'flow.html',
	styleUrls: ['flow.scss']
})
export class DonationFlowComponent {
	listConfig: DonationListConfig;

	constructor() {
		this.listConfig = {
			columnsType: 'full',
			pagination: true,
			fullSize: false
		}
	}
}