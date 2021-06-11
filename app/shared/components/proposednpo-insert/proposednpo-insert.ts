import { isEmpty, getLocalStorage } from '../../../shared/helpers/utils';
import { ModalConfig } from '../modal/oldModal/modal';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProposedNpoService } from '../../../models/proposednpo';
import { WizardComponent } from 'angular-archwizard';
import AppSettings from '../../../app.settings';
import { Component, ViewChild, Input, OnInit, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgWizardStep } from 'app/shared/helpers/ng-wizard-step';
import { SelectOption } from 'app/shared/ngx-formly/fields/tags/tags';
import { UtilsService } from 'app/services/utils';

const countryDict = require('../../../assets/data/country.json');

export interface ProposedNpoInsertConfig {
	country?: string;
	message?: string;
}

export function openProposeNPOModal(modalService: NgbModal, config: ProposedNpoInsertConfig) {
	const modalRef = modalService.open(ProposedNpoInsertComponent, {
		size: 'lg',
		keyboard: false,
		backdrop: 'static'
	});
	modalRef.componentInstance.config = config;
	modalRef.result.then((v) => { }, () => { });
}

@Component({
	selector: 'proposednpo-insert',
	templateUrl: 'proposednpo-insert.html',
	styleUrls: ['proposednpo-insert.scss']
})
export class ProposedNpoInsertComponent implements OnInit, OnChanges {
	@Input() config: ProposedNpoInsertConfig;

	public wizardHandler: WizardComponent;

	@ViewChild(WizardComponent) set contentMulti(content: WizardComponent) {
		this.wizardHandler = content;

		this.wizard.step0.setHandler(this.wizardHandler);
		this.wizard.step1.setHandler(this.wizardHandler);
	};

	modals: { [modalName: string]: ModalConfig & { tooltip: any } };
	isLogged: boolean;

	wizard: {
		step0: NgWizardStep<{
			country: string; //{ label: string; value: string };
			name: string;
			link: string;
		}>;
		step1: NgWizardStep<void>;
	};

	constructor(
		public activeModal: NgbActiveModal,
		private proposedNpoService: ProposedNpoService,
		private utilsService: UtilsService,
		private translate: TranslateService
	) {
		this.isLogged = false;

		this.modals = {
			proposedNpo: {
				id: 'modalProposedNpo',
				// modalClass: 'modal-sm',
				title: translate.instant('Propose an Organization'),
				tooltip: {
					content: translate.instant('Would you like to make a transparent donation to a specific organization but it is not in Helperbit? Please tell us about this organization and we will try to contact its team.')
				}
			}
		};

		this.wizard = { step0: null, step1: null };

		this.wizard.step0 = new NgWizardStep();
		this.wizard.step0.initializeModel({
			country: '',
			link: '',
			name: ''
		});
		this.wizard.step0.setTitles({
			main: this.translate.instant('Propose'),
			heading: this.translate.instant('Propose an Organization'),
		});


		this.wizard.step0.addField({
			type: 'input',
			key: 'name',
			templateOptions: {
				type: 'text',
				placeholder: translate.instant('Organization Name'),
				required: true,
				minLength: AppSettings.form.length.min.npo.name,
				hideAsterisk: true,
				labelPlaceholder: true
			}
		});

		this.wizard.step0.addField({
			type: 'input',
			key: 'link',
			templateOptions: {
				type: 'text',
				placeholder: translate.instant('Organization Link'),
				required: false,
				hideAsterisk: true,
				labelPlaceholder: true
			}
		});

		this.wizard.step0.addField({
			type: 'select',
			key: 'country',
			templateOptions: {
				type: 'text',
				placeholder: translate.instant('Country'),
				required: false,
				hideAsterisk: true,
				labelPlaceholder: true,
				options: [],
				valueProp: 'value',
				labelProp: 'label'
			}
		});
		this.wizard.step0.addField({ type: 'recaptcha', key: 'captcha' });

		this.wizard.step1 = new NgWizardStep();
		this.wizard.step1.setTitles({ main: translate.instant('Finish') });
	}

	send(model) {
		this.wizard.step0.resetResponse();

		const json = {
			name: model.name,
			link: model.link,
			country: model.country //.value
		};

		this.proposedNpoService.propose(json).subscribe((res) => {
			this.wizard.step0.next();
		}, res => {
			this.wizard.step0.captchaExpire();
			this.wizard.step0.setResponse('error', res.error);
		});
	}

	ngOnChanges(changes) {
		if (changes.currentValue.config) {
			if (this.config.country) {
				const countryLabel = countryDict[this.config.country];
				if (!isEmpty(countryLabel))
					this.wizard.step0.model.country = countryLabel // = { label: countryLabel, value: this.config.country };
			}

			if (this.config.message)
				this.wizard.step0.titles.description = this.config.message;
		}
	}

	ngOnInit() {
		this.isLogged = !isEmpty(getLocalStorage().getItem('token'));

		this.utilsService.getCountrySelectOptions().subscribe((countryOptions: SelectOption[]) => {
			this.wizard.step0.getField('country').templateOptions.options = countryOptions;
		});
	}
}