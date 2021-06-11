import { isEmpty } from '../../../shared/helpers/utils';
import { BrowserHelperService } from '../../../services/browser-helper';
import { TranslateService } from '@ngx-translate/core';
import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';


@Component({
	selector: 'options-sidebar',
	templateUrl: 'options-sidebar.html',
	styleUrls: ['options-sidebar.scss']
})
export class OptionsSidebarComponent implements OnChanges, OnInit {
	@Input() options: { icon: any; text: string; value: string; active: boolean }[];
	@Input() multipleSelection: boolean;
	@Input() openSidebar: boolean;
	@Output() optionClick: EventEmitter<any> = new EventEmitter();

	activeOptions: { newValue: any; oldValue: any };

	constructor(
		private translate: TranslateService,
		private browserHelperService: BrowserHelperService
	) {
		this.multipleSelection = false;
		this.openSidebar = false;

		this.activeOptions = { newValue: null, oldValue: null };
	}

	public clickOption(option) {
		if (this.multipleSelection) {
			option.active = !option.active;
		} else {
			this.activeOptions.oldValue = this.activeOptions.newValue;
			this.activeOptions.newValue = option;

			this.activeOptions.oldValue.active = false;
			this.activeOptions.newValue.active = true;
		}

		this.optionClick.emit(option);
	}

	ngOnChanges(changes) {
		if ((changes.options && changes.options.currentValue) || (changes.multipleSelection && changes.multipleSelection.currentValue)) {
			if (changes.multipleSelection && typeof changes.multipleSelection.currentValue != 'boolean')
				this.multipleSelection = (changes.multipleSelection.currentValue == 'true');

			this.options = this.options.map(o => { if (isEmpty(o.active)) o.active = false; return o; });

			if (!this.multipleSelection)
				this.options.forEach(o => { if (o.active) this.activeOptions.newValue = o; });
		}

		if (changes.openSidebar && changes.openSidebar.currentValue)
			if (typeof changes.openSidebar.currentValue != 'boolean')
				this.openSidebar = (changes.openSidebar.currentValue == 'true');
	}

	ngOnInit() {
		if (this.browserHelperService.currentResolution != 'xs' && !this.openSidebar) {
			//set tooltip over options-sidebar
			const el = $('.options-sidebar');

			el.ready(() => {
				el.tooltip({
					title: this.translate.instant('Open the bar and select icons to filter results'),
					placement: 'right',
					trigger: 'manual'
				});

				//TODO senza setTimeout da errori su childNodes
				setTimeout(() => {
					el.tooltip('show');
					el.next().addClass('tooltip-yellow');
				}, 0);

				el.mouseenter(() => {
					el.tooltip('destroy');
					el.unbind('mouseenter');
				});
			});
		}
	}
}