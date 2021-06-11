/* 
 *  Helperbit: a p2p donation platform (frontend)
 *  Copyright (C) 2016-2021  Davide Gessa (gessadavide@gmail.com)
 *  Copyright (C) 2016-2021  Helperbit team
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

import { DashboardService, UserPrivateModel } from '../../../../../models/dashboard';
import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { ModalConfig } from 'app/shared/components/modal/oldModal/modal';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from 'app/services/utils';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UsertypePipe } from '../../../../../shared/filters/usertype';
import { Ror, RorService } from 'app/models/ror';
import { Wallet, WalletService, WalletList } from 'app/models/wallet';
import { WizardComponent } from 'angular-archwizard';
import { NgWizardStep } from 'app/shared/helpers/ng-wizard-step';
import AppSettings from 'app/app.settings';
import { buildErrorResponseMessage } from 'app/shared/components/response-messages/response-messages';
import { CurrencyService } from 'app/services/currency';
import { getLocalStorage } from 'app/shared/helpers/utils';

export interface ModalRorDetailsComponentConfig extends ModalConfig {
	ror: Ror;
};

export function openModalRorDetails(modalService: NgbModal, config?: ModalRorDetailsComponentConfig): NgbModalRef {
	const modalRef: NgbModalRef = modalService.open(ModalRorDetailsComponent, {
		size: 'lg'
	});

	if(config)
		modalRef.componentInstance.config = config;

	return modalRef;
}

@Component({
	selector: 'me-ror-details-component',
	templateUrl: 'details.html',
	styleUrls: ['details.scss'],
	providers: [UsertypePipe]
})
export class ModalRorDetailsComponent implements OnInit {
	@Input() config: ModalRorDetailsComponentConfig;
	public wizardHandler: WizardComponent;

	@ViewChild(WizardComponent) set contentMulti(content: WizardComponent) {
		this.wizardHandler = content;

		this.wizardReject.step1.setHandler(this.wizardHandler);
		this.wizardReject.step2.setHandler(this.wizardHandler);

		this.wizardApprove.step1.setHandler(this.wizardHandler);
		this.wizardApprove.step2.setHandler(this.wizardHandler);
	};

	wizardApprove: {
		step1: NgWizardStep<{
			wallet: Wallet;
		}>;
		step2: NgWizardStep<any>;
	};

	wizardReject: {
		step1: NgWizardStep<{
			description: string;
		}>;
		step2: NgWizardStep<any>;
	};

	username: string;
	viewType: 'details' | 'reject' | 'approve' ;
	rorParsedValue: number;

	constructor(
		private dashboardService: DashboardService,
		private translate: TranslateService,
		private utilsService: UtilsService,
		public activeModal: NgbActiveModal,
		private userTypePipe: UsertypePipe,
		private rorService: RorService,
		private currencyService: CurrencyService,
		private walletService: WalletService
	) {
		this.username = getLocalStorage().getItem('username');
		this.viewType = 'details';

		/* FORMS */

		this.wizardReject = { step1: null, step2: null };
		this.wizardApprove = { step1: null, step2: null };

		/* REJECT */

		//STEP 1

		this.wizardReject.step1 = new NgWizardStep();

		this.wizardReject.step1.initializeModel({
			description: null
		});

		this.wizardReject.step1.setTitles({
			main: this.translate.instant('Reject'),
			// description: translate.instant('Description')
		});

		//description
		this.wizardReject.step1.addField({
			type: 'textarea',
			key: 'description', 
			templateOptions: {
				label: this.translate.instant('Insert a reason for the rejection'),
				placeholder: this.translate.instant('Your refund claim was reject because...'),
				required: true,
				minLength: AppSettings.form.length.min.rorSend.description
			}
		});

		//FINISH

		this.wizardReject.step2 = NgWizardStep.createFinishStep(this.translate);

		/* APPROVE */

		//STEP 1

		this.wizardApprove.step1 = new NgWizardStep();

		this.wizardApprove.step1.initializeModel({
			wallet: null
		});

		this.wizardApprove.step1.setTitles({
			main: this.translate.instant('Send'),
			description: this.translate.instant('Select the wallet from where you want to send the requested funds'),
		});


		//TODO a che serve?
		//description
		// this.wizardApprove.step1.addField({
		// 	type: 'chooseElements',
		// 	key: 'wallet', 
		// 	templateOptions: {
		// 		label: this.translate.instant('Choose a wallet from you send founds'),
		// 		required: true
		// 	}
		// });

		//FINISH

		this.wizardApprove.step2 = NgWizardStep.createFinishStep(this.translate);
	}

	ngOnInit() {
		if(this.config)
			this.rorParsedValue = Math.floor(this.config.ror.value / this.currencyService.btcprice[this.config.ror.currency.toLowerCase()] * 100000000) / 100000000;
	
		this.walletService.getList().subscribe((walletList: WalletList) => {
			this.wizardApprove.step1.getField('wallet').templateOptions.options = walletList.wallets;
		});
	}

	goToRorReject() {
		this.viewType = 'reject';
	}

	goToRorApprove() {
		this.viewType = 'approve';
	}

	rorReject() {
		this.wizardReject.step1.resetResponse();

		this.rorService.reject(this.config.ror._id, this.wizardReject.step1.model.description).subscribe(_ => {
			this.wizardHandler.goToNextStep();
		}, res => {
			this.wizardReject.step1.setResponse('error', buildErrorResponseMessage(res.error));
		});
	}

	cancelRorReject() {
		this.viewType = 'details';
	};

	cancelRorApprove() {
		this.viewType = 'details';
	};

	rorApprove() {
		// this.responseMessage = null;

		// const modalI = this.$uibModal.open({
		// 	component: 'meWalletWithdrawComponent',
		// 	resolve: {
		// 		modalData: () => {
		// 			return {
		// 				address: this.wizardApprove.step1.wallet.address,
		// 				destination: this.config.ror.receiveaddress,
		// 				value: this.rorParsedValue,
		// 				description: 'Sending refund: \"' + this.config.ror.description + '\"',
		// 				ror: this.config.ror._id
		// 			};
		// 		}
		// 	}
		// });

		// modalI.result.then(() => { this.update(); }, () => { this.update(); });

		this.activeModal.close();
	}
}