import { buildErrorResponseMessage } from '../../../../../shared/components/response-messages/response-messages';
import { DashboardService, UserPrivateModel } from '../../../../../models/dashboard';
import { LeafletConfig } from 'app/shared/types/leaflet';
import { Component, Input, ViewChild } from '@angular/core';
import { ModalConfig } from 'app/shared/components/modal/oldModal/modal';
import { WizardComponent } from 'angular-archwizard';
import { NgWizardStep } from 'app/shared/helpers/ng-wizard-step';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from 'app/services/utils';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MapOptions, Marker, Map, DragEndEvent, LatLng } from 'leaflet';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { UsertypePipe } from '../../../../../shared/filters/usertype';
import { TagsChipsOption, SelectOption } from 'app/shared/ngx-formly/fields/tags/tags';

const countryDict = require('../../../../../assets/data/country.json');
const ga = (window as any).ga;

export interface ModalAddressComponentConfig extends ModalConfig {
	country?: string;
	region?: string;
	city?: string;
	street?: string;
	streetNumber?: string;
	zipCode?: string;
};

export function openModalAddress(modalService: NgbModal, config?: ModalAddressComponentConfig): NgbModalRef {
	const modalRef: NgbModalRef = modalService.open(ModalAddressComponent, {
		size: 'lg'
	});

	if(config)
		modalRef.componentInstance.config = config;

	return modalRef;
}

@Component({
	selector: 'me-address-component',
	templateUrl: 'address.html',
	styleUrls: ['address.scss'],
	providers: [UsertypePipe]
})
export class ModalAddressComponent {
	@Input() config: ModalAddressComponentConfig;
	public wizardHandler: WizardComponent;

	@ViewChild(WizardComponent) set contentMulti(content: WizardComponent) {
		this.wizardHandler = content;

		this.wizard.step1.setHandler(this.wizardHandler);
		this.wizard.step2.setHandler(this.wizardHandler);
		this.wizard.step3.setHandler(this.wizardHandler);
		this.wizard.step4.setHandler(this.wizardHandler);
	};

	user: UserPrivateModel;
	leaflet: LeafletConfig;
	editMode: boolean;
	leafletOptions: { options: MapOptions; markers: Marker[] };
	map: Map;

	wizard: {
		step1: NgWizardStep<{
			country: string;
			region: string;
			city: string;
			street: string;
			streetNumber: string;
			zipCode: string;
		}>;
		step2: NgWizardStep<{}>;
		step3: NgWizardStep<{
			countries: TagsChipsOption[];
		}>;
		step4: NgWizardStep<any>;
	};

	constructor(
		private dashboardService: DashboardService,
		private translate: TranslateService,
		private utilsService: UtilsService,
		public activeModal: NgbActiveModal,
		private userTypePipe: UsertypePipe
	) {
		this.user = null;
		this.leaflet = null;

		/* FORMS */

		this.wizard = { step1: null, step2: null, step3: null, step4: null };

		//STEP 1

		this.wizard.step1 = new NgWizardStep();

		this.wizard.step1.initializeModel({
			country: null,
			region: null,
			city: null,
			street: null,
			streetNumber: null,
			zipCode: null
		});

		this.wizard.step1.setTitles({
			main: translate.instant('Address'),
			heading: translate.instant('Insert your address information')
		});

		//country
		this.wizard.step1.addField({
			type: 'select',
			key: 'country', 
			templateOptions: {
				label: translate.instant('Country'),
				required: true,
				change: (field: FormlyFieldConfig, event?: any) => {
					this.utilsService.getRegionSelectOptions(field.model[field.key]).subscribe((regionOptions: SelectOption[]) => {
						this.wizard.step1.getField('region').templateOptions.options = regionOptions;
					});
				},
				valueProp: 'value',
				labelProp: 'label'
			}
		});

		//region
		this.wizard.step1.addField({
			type: 'select',
			key: 'region',
			templateOptions: {
				label: translate.instant('Region'),
				required: true
			},
		// 	expressionProperties: {
		// 		'templateOptions.disabled': 'model.country == null'
		// 	}
		});

		//city
		this.wizard.step1.addField({
			type: 'input',
			key: 'city',
			templateOptions: {
				type: 'text',
				label: translate.instant('City'),
				placeholder: translate.instant('Rome'),
				required: true
			}
		});

		//street
		this.wizard.step1.addField({
			type: 'input',
			key: 'street',
			templateOptions: {
				type: 'text',
				label: translate.instant('Street'),
				placeholder: translate.instant('Saint Peter Station Street'),
				required: true
			}
		});

		//streetNumber
		this.wizard.step1.addField({
			type: 'input',
			key: 'streetNumber',
			className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
			templateOptions: {
				type: 'text',
				label: translate.instant('Street number'),
				placeholder: '65',
				required: true
			}
		});

		//zipCode
		this.wizard.step1.addField({
			type: 'input',
			key: 'zipCode',
			className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
			templateOptions: {
				type: 'text',
				label: translate.instant('ZIP Code'),
				placeholder: '00144',
				required: true
			}
		});

		//STEP 2

		this.wizard.step2 = new NgWizardStep();

		this.wizard.step2.initializeModel({
			country: null,
			region: null,
			city: null,
			street: null,
			streetNumber: null,
			zipCode: null
		});

		this.wizard.step2.setTitles({
			main: translate.instant('Position')
		});

		//STEP 3

		this.wizard.step3 = new NgWizardStep();

		this.wizard.step3.initializeModel({
			countries: []
		});

		this.wizard.step3.setTitles({
			main: translate.instant('Countries'),
			heading: translate.instant('Write the countries where your organization operates')
		
		});

		//countries
		const autocompleteCountries = [];
		for (const countryKey in countryDict) {
			autocompleteCountries.push({ display: countryDict[countryKey], value: countryKey });
		}

		this.wizard.step3.addField({
			type: 'tags',
			key: 'countries',
			templateOptions: {
				required: true,
				hideAsterisk: true,
				label: translate.instant('Insert Country'),
				placeholder: translate.instant('Insert Country'),
				options: autocompleteCountries
			}
		});

		//FINISH

		this.wizard.step4 = NgWizardStep.createFinishStep(this.translate);
	}

	ngOnInit() {
		this.dashboardService.getModel().subscribe((user: UserPrivateModel) => {
			this.user = user;

			let step2title = '';

			switch (this.user.usertype) {
				case 'singleuser':
					step2title = this.translate.instant('Is this your living abitual position?');
					break;
				case 'npo':
					step2title = this.translate.instant('Is this the official position address of the') + ' ' + this.userTypePipe.transform(this.user) + '?';
					break;
				case 'singleuser':
					step2title = this.translate.instant('Is this the official position address of the Company?');
					break;
			}

			this.wizard.step1.setTitles({
				main: this.translate.instant('Address'),
				heading: (this.user.usertype != 'company' ? this.translate.instant('Insert your address information') : this.translate.instant('Insert your company address information'))
			});
			this.wizard.step2.setTitles({
				main: this.translate.instant('Position'),
				heading: step2title
			});

			if(this.user.usertype == 'singleuser') {
				this.wizard.step3.disable();
			} else {
				this.wizard.step2.disable();
			}

			//set country options
			this.utilsService.getCountrySelectOptions().subscribe((countryOptions: SelectOption[]) => {
				this.wizard.step1.getField('country').templateOptions.options = countryOptions;
			});
			
			if(this.config) {
				this.editMode = true;

				this.wizard.step1.initializeModel({
					country: this.config.country,
					region: this.config.region ? this.config.region : null,
					city: this.config.city,
					street: this.config.street,
					streetNumber: this.config.streetNumber,
					zipCode: this.config.zipCode,
				});

				//if user already have a country set, then set region options
				if (this.config.country != '')
					this.utilsService.getRegionSelectOptions(this.config.country).subscribe((regionOptions: SelectOption[]) => {
						this.wizard.step1.getField('region').templateOptions.options = regionOptions;
					});
	
				//in this case we have the step 3, then set countries TagsChips options
				if (this.user.usertype != 'singleuser') {
					const countryKeysArr = this.user.countries.length > 0 ? this.user.countries : [this.user.country];

					this.utilsService.getCountryTagsChipsOptions().subscribe((countryOptions: TagsChipsOption[]) => {
						this.wizard.step3.getField('countries').templateOptions.options = countryOptions;
					});

					this.utilsService.getCountryTagsChipsOptionsByCountryKeys(countryKeysArr).subscribe((countryOptions: TagsChipsOption[]) => {
						this.wizard.step3.setModelField('countries', countryOptions);
					});
				}
			}
		}, res => {
			this.wizard.step1.setResponse('error', buildErrorResponseMessage(res.error));
		});
	}

	initLeaflet() {
		this.leaflet = this.user.createLeafletConfig2(true);
		this.leafletOptions = this.user.createLeafletOptions(true);
	}

	onMapReady(map: Map) {
		this.map = map;

		window.dispatchEvent(new Event('resize'));
		this.map.invalidateSize(true);
		
		this.map.on('dragend', (event: DragEndEvent) => {
			const newPos: LatLng = event.target.getCenter();

			this.leaflet.position.lat = newPos.lat;
			this.leaflet.position.lng = newPos.lng;
		});
	}

	sendUserAddress() {
		this.wizard.step1.resetResponse();
		
		const json = {
			country: this.wizard.step1.model.country,
			region: this.wizard.step1.model.region,
			city: this.wizard.step1.model.city,
			street: this.wizard.step1.model.street,
			streetnr: this.wizard.step1.model.streetNumber,
			zipcode: this.wizard.step1.model.zipCode
		};

		this.dashboardService.edit(json).subscribe(_ => {
			this.dashboardService.getModel().subscribe((user: UserPrivateModel) => {
				this.user = user;

				this.initLeaflet();

				//invio notifiche Google Analitycs
				ga('send', {
					hitType: 'event',
					eventCategory: 'User',
					eventAction: 'geolocalize',
					eventLabel: "" + json['country']
				});

				this.wizardHandler.goToNextStep();
			});
		}, res => {
			this.wizard.step1.setResponse('error', buildErrorResponseMessage(res.error));
		});
	}

	sendUserPosition() {
		this.wizard.step2.resetResponse();
		
		const json = {
			location: {
				type: 'Point',
				coordinates: [this.leaflet.position.lng, this.leaflet.position.lat]
			}
		};

		this.dashboardService.edit(json).subscribe(res => {
			if (this.user.usertype != 'singleuser' && this.user.countries.length == 0)
				this.utilsService.getCountryTagsChipsOptionsByCountryKeys([this.user.country]).subscribe((countryOptions: TagsChipsOption[]) => {
					this.wizard.step3.setModelField('countries', countryOptions);
				});

			this.wizardHandler.goToNextStep();
		}, res => {
			this.wizard.step2.setResponse('error', buildErrorResponseMessage(res.error));
		});
	}

	sendUserCountries() {
		this.wizard.step3.resetResponse();

		const json: { countries?: string[] } = {};

		if (this.wizard.step3.model.countries)
			json.countries = this.wizard.step3.model.countries.map((option: TagsChipsOption) => option.value);

		this.dashboardService.edit(json).subscribe((res) => {
			this.wizardHandler.goToNextStep();
		}, res => {
			this.wizard.step3.setResponse('error', buildErrorResponseMessage(res.error));
		});
	}
}