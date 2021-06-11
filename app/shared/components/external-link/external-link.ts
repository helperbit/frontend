import * as $ from 'jquery';
import { ModalsConfig } from '../modal/oldModal/modal';
import { formatUrl } from '../../../shared/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import {Component, Input, OnChanges} from '@angular/core';


/** External link visualization */
@Component({
	selector: 'external-link',
	templateUrl: 'external-link.html',
	styleUrls: ['external-link.scss']
})
export class ExternalLinkComponent implements OnChanges {
	@Input() url: string;
	@Input() text: string;

	modals: ModalsConfig;
	textClickable: string;
	urlFormatted: string;

	constructor(translate: TranslateService) {
		this.modals = {
			confirm: {
				id: 'modalConfirm' + Math.floor(Math.random() * 100000),
				modalClass: 'modal-md',
				hideCloseButton: true,
				title: translate.instant('Exiting Helperbit.com'),
				confirm: {
					method: () => { window.open(this.urlFormatted, "_blank"); },
					parameters: null,
					description: translate.instant('You are leaving Helperbit.com following an external link.')
				}
			}
		};
		this.textClickable = null;
	}

	ngOnChanges(changes) {
		this.urlFormatted = formatUrl(this.url);
		if (this.text)
			this.textClickable = this.text;
		else
			this.textClickable = this.urlFormatted;
	}

	gotoLink() {
		$('#' + this.modals.confirm.id).modal('show');
	}
}
