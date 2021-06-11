import { buildErrorResponseMessage, ResponseMessageConfig } from '../../../shared/components/response-messages/response-messages';
import { RorService, Ror } from '../../../models/ror';
import { DashboardService, UserPrivate } from '../../../models/dashboard';
import { BrowserHelperService } from 'app/services/browser-helper';
import { PageHeaderConfig } from 'app/shared/components/page-header/page-header';
import { InfoBoxConfig } from 'app/shared/components/info-box/info-box';
import { ModalConfig } from 'app/shared/components/modal/oldModal/modal';
import { Wallet } from 'app/models/wallet';
import { openModalRorDetails } from './modals/details/details';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { openModal } from 'app/shared/components/modal/modal';
import { Component } from '@angular/core';
import { getLocalStorage } from 'app/shared/helpers/utils';

@Component({
	selector: 'me-rors-component',
	templateUrl: 'rors.html',
	styleUrls: ['../../../sass/main/custom/page.scss']
})
export class MeRorsComponent {
	responseMessage: ResponseMessageConfig;
	pageHeader: PageHeaderConfig;
	infoBox: InfoBoxConfig;
	username: string;
	rors: any[];
	selectedRor: any;
	reject: { reason: string };
	isSaved: boolean;
	uservat: any;
	createDisable: boolean;

	modals: {
		confirm: ModalConfig;
		rorDetails: ModalConfig & { wallet: Wallet; status: 'detail' | 'sendFunds' | 'reject'; value: any };
	};

	constructor(
		private rorService: RorService,
		private dashboardService: DashboardService,
		private translate: TranslateService,
		public browserHelperService: BrowserHelperService,
		private modalService: NgbModal,
		private router: Router
	) {
		this.pageHeader = {
			description: {
				title: translate.instant('Refund claims'),
				subTitle: translate.instant('Request of refund')
			}
		};

		this.infoBox = {
			title: translate.instant('What are RORS?'),
			description: translate.instant('RORS means Request Of Refunds. With this page you can request funds to an NPO. A refund claim can be requested by a company or NPO to an NPO.'),
			// link: '/i/ambassador'
		};

		this.modals = {
			confirm: {
				id: 'modalConfirm',
				modalClass: 'modal-md',
				hideCloseButton: true,
				title: null,
				confirm: {
					method: null,
					parameters: null,
					description: null
				}
			},
			rorDetails: {
				id: 'modalRorDetails',
				modalClass: 'modal-lg',
				hideCloseButton: true,
				title: null,
				status: null,
				wallet: null,
				value: null
			}
		};

		this.responseMessage = null;
		this.username = null;
		this.rors = [];
		this.reject = { reason: null };
		this.isSaved = false;
		this.uservat = null;
		this.createDisable = false;
	}

	ngOnInit() {
		this.username = getLocalStorage().getItem('username');
		this.update();
	}

	createRor() {
		this.router.navigateByUrl("/me/rors/create");
	}

	update() {
		this.rorService.getList().subscribe((rors: Ror[]) => {
			this.rors = rors;
			this.createDisable = rors.filter(r => r.status == 'pending' && r.from == this.username).length > 0;
		});

		this.dashboardService.get().subscribe((user: UserPrivate) => {
			this.uservat = user.vat;
		});
	};

	openConfirmDeleteRor(id) {
		openModal(this.modalService, {
			...this.modals.confirm,
			title: this.translate.instant('Confirm delete ror'),
			description: this.translate.instant('Are you sure to delete') + ' ' + id + ' ' + this.translate.instant('ror?')
		}).result.then(
			(v) => { this.removeRor(id); },
			() => { });
	};

	removeRor(id) {
		this.rorService.delete(id).subscribe(_ => {
			this.update();
		}, (res) => {
			this.responseMessage = buildErrorResponseMessage(res.error);
		});
	};


	detailsRor(ror) {
		openModalRorDetails(this.modalService, { ...this.modals.rorDetails, ror: ror}).result.then(
			(res) => { this.update(); },
			() => { this.update(); }
		)
	};
}