
import { PageHeaderConfig } from "../../../shared/components/page-header/page-header";
import { TranslateService } from '@ngx-translate/core';
import { DonationService } from "../../../models/donation";
import { RorService, Ror } from "../../../models/ror";
import { WalletService, Transaction } from "../../../models/wallet";
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'app/services/utils';
import { interpolateString, getLocalStorage } from 'app/shared/helpers/utils';


/* Multisig Transaction controller */
@Component({
	selector: 'transaction-component',
	templateUrl: 'transaction.html',
	styleUrls: ['../../../sass/main/custom/page.scss', 'transaction.scss']
})
export class TransactionComponent implements OnInit {
	isMine: boolean;
	transaction: Transaction & { touser?: string };
	ror: Ror;
	pageHeader: PageHeaderConfig;

	constructor(
		private rorService: RorService,
		private donationService: DonationService,
		private walletService: WalletService,
		private translate: TranslateService,
		private utilsService: UtilsService,
		private route: ActivatedRoute
	) { }

	update() {
		const txid = this.route.snapshot.paramMap.get('txid');

		this.walletService.getTransaction(txid).subscribe(transaction => {
			this.transaction = transaction;

			this.pageHeader = {
				description: {
					title: this.translate.instant('transaction'),
					subTitle: this.transaction.txid
				}
			};

			this.isMine = (this.transaction.from == getLocalStorage().getItem('username'));

			this.utilsService.setMeta(
				this.translate.instant('Transaction') + ': ' + this.transaction.txid,
				interpolateString(this.translate.instant('Transaction of {{value}} BTC; click to view more details.'), { value: String(this.transaction.value) })
			);

			if (this.transaction.ror) {
				this.rorService.get(this.transaction.ror).subscribe(ror => {
					this.ror = ror;
				});
			}

			this.donationService.get(txid).subscribe(donation => {
				this.transaction.touser = donation.to[0].user;
			});
		});
	}

	ngOnInit() {
		this.update();
	}
}