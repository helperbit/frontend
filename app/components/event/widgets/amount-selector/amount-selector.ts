import { EventEmitter, Output, Component, OnChanges, OnInit } from '@angular/core';
import { ResponseMessageConfig } from '../../../../shared/components/response-messages/response-messages';
import { CurrencyService } from '../../../../services/currency';
import { MoneyPipe } from '../../../../shared/filters/money';


/** Amount selector widget */
@Component({
	selector: 'amount-selector',
	templateUrl: 'amount-selector.html',
	styleUrls: ['amount-selector.scss']
})
export class AmountSelectorComponent implements OnInit, OnChanges {
	@Output() change: EventEmitter<number> = new EventEmitter();

	responseMessage: ResponseMessageConfig;
	amount: string;
	manual: { enabled: boolean; amount: string };


	constructor(private moneyPipe: MoneyPipe, private currencyService: CurrencyService) { }

	formatValue(value: number) {
		return this.moneyPipe.transform(
			this.moneyPipe.transform(value, -1, false),
			8,
			false,
			true
		);
	}

	updateValue(value: string) {
		if (value == null || value === undefined) {
			this.manual.enabled = true;
			this.amount = this.manual.amount;
		}
		else {
			this.manual.enabled = false;
			this.amount = value;
		}

		if (!isNaN(Number(this.amount)))
			return this.change.emit(Number(this.amount));
	}

	ngOnChanges(changes) {
		if (!isNaN(Number(this.amount)))
			return this.change.emit(Number(this.amount));
	}

	ngOnInit() {
		if (!this.currencyService.isInit)
			this.currencyService.onPriceChange.subscribe(_ => {
				this.amount = (this.moneyPipe.transform(this.moneyPipe.transform(0.01, -1, false), 8, false, true));
				this.manual = {
					enabled: false,
					amount: (this.moneyPipe.transform(this.moneyPipe.transform(0.015, -1, false), 8, false, true))
				};
			});
		else {
			this.amount = (this.moneyPipe.transform(this.moneyPipe.transform(0.01, -1, false), 8, false, true));
			this.manual = {
				enabled: false,
				amount: (this.moneyPipe.transform(this.moneyPipe.transform(0.015, -1, false), 8, false, true))
			};
		}
	}
}
