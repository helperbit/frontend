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

import { RorService, RorTo } from "../../../../models/ror";
import { CurrencyService } from "../../../../services/currency";
import { PageHeaderConfig } from "../../../../shared/components/page-header/page-header";
import { DropzoneFile } from "../../../../shared/components/dropzone/dropzone";
import { UtilsService } from "app/services/utils";
import AppSettings from "../../../../app.settings";
import { Component, ViewChild, OnInit } from '@angular/core';
import { getDateFromDateSelectorModel, InputSelectDateNumber } from 'app/shared/components/date-selector/date-selector';
import { WizardComponent } from 'angular-archwizard';
import { NgWizardStep } from 'app/shared/helpers/ng-wizard-step';
import { TranslateService } from '@ngx-translate/core';
import { AvatarPipe } from 'app/shared/filters/avatar';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ChooseElementElement } from 'app/shared/components/choose-elements/choose-elements';
import { ONESATOSHI } from 'app/components/dashboard.wallet/bitcoin.service/bitcoin-helper';

@Component({
	selector: 'me-create-ror-component',
	templateUrl: 'create.html',
	styleUrls: ['../../../../sass/main/custom/page.scss'],
	providers: [AvatarPipe]
})
export class MeRorCreateComponent implements OnInit {
	public wizardHandler: WizardComponent;

	@ViewChild(WizardComponent) set contentMulti(content: WizardComponent) {
		this.wizardHandler = content;

		this.wizard.step1.setHandler(this.wizardHandler);
		this.wizard.step2.setHandler(this.wizardHandler);
	};

	wizard: {
		step1: NgWizardStep<{
			npo: ChooseElementElement & { username: string };
			amountUSD: number;
			amountEUR: number;
			amountBTC: number;
			amountCurrency: string;
			description: string;
			invoiceCompanyVat: string;
			invoiceDate: InputSelectDateNumber;
			invoiceFile: DropzoneFile[];
			invoicePublicVisibility: boolean;
		}>;
		step2: NgWizardStep<any>;
	};

	pageHeader: PageHeaderConfig;
	media: {
		toAdd: DropzoneFile[];
		toDelete: DropzoneFile[];
	};
	currencyConfig: {
		btc: {
			min: number;
			max: number;
		};
		eur: {
			min: number;
			max: number;
		};
		usd: {
			min: number;
			max: number;
		};
	};

	constructor(
		private rorService: RorService,
		private translate: TranslateService,
		private currencyService: CurrencyService,
		private utilsService: UtilsService,
		private avatarPipe: AvatarPipe
	) {
		this.rorService = rorService;
		this.translate = translate;
		this.currencyService = currencyService;
		this.utilsService = utilsService;

		this.pageHeader = {
			description: {
				title: translate.instant('Create a refund claim'),
				subTitle: translate.instant('Create a request of refund')
			}
		};

		this.media = { toAdd: [], toDelete: [] };

		/* FORMS */

		//update the currencies inputs and set the value parsed object
		const checkAndSetCurrencyInputs = (btc, currency) => {
			if (currency.btc)
				this.wizard.step1.setModelField('amountBTC', btc);
			if (currency.eur)
				this.wizard.step1.setModelField('amountEUR', this.currencyService.convertCurrency(this.wizard.step1.model.amountBTC, 'btc', 'eur'));
			if (currency.usd)
				this.wizard.step1.setModelField('amountUSD', this.currencyService.convertCurrency(this.wizard.step1.model.amountBTC, 'btc', 'usd'));
		};

		this.wizard = { step1: null, step2: null };

		//STEP 1

		this.wizard.step1 = new NgWizardStep();

		this.wizard.step1.initializeModel({
			npo: null,
			amountUSD: null,
			amountEUR: null,
			amountBTC: null,
			amountCurrency: null,
			description: null,
			invoiceCompanyVat: null,
			invoiceDate: null,
			invoiceFile: null,
			invoicePublicVisibility: null
		});

		this.wizard.step1.setTitles({
			main: this.translate.instant('Setup'),
			// description: translate.instant('Description'),
		});

		//npo
		this.wizard.step1.addField({
			type: 'chooseElements',
			key: 'npo',
			templateOptions: {
				label: this.translate.instant('To'),
				required: true,
				hideAsterisk: true,
				// tooltip: {
				// 	content: this.translate.instant('Select the project that you want to sustain with your campaign')
				// },
				config: {
					buttonText: this.translate.instant('Choose an NPO'),
					selectedText: this.translate.instant('NPO selected:'),
					fullScreen: true,
					title: this.translate.instant('Choose an NPO'),
					description: this.translate.instant('Click an image to select an NPO. Check NPO info by clicking on NPO name.'),
					type: 'avatar',
					elements: []
				}
			}
		});

		//amountUSD
		this.wizard.step1.addField({
			type: 'input',
			key: 'amountUSD',
			className: 'col-lg-8 col-md-8 col-sm-12 col-xs-12',
			templateOptions: {
				type: 'number',
				label: this.translate.instant('Amount requested') + ' (USD)',
				required: false,
				hideAsterisk: true,
				step: 0.01,
				change: (field: FormlyFieldConfig, event?: any) => {
					const btc = this.currencyService.convertCurrency(field.model[field.key], 'usd', 'btc');
					checkAndSetCurrencyInputs(btc, { btc: true, eur: true, usd: false });
				}
			},
			hideExpression: (model: any, formState: any, field?: FormlyFieldConfig) => {
				// debugger
				return model.amountCurrency != 'USD';
			},
			expressionProperties: {
				'templateOptions.required': 'model.amountCurrency == \'USD\'',
			}
		});

		//amountEUR
		this.wizard.step1.addField({
			type: 'input',
			key: 'amountEUR',
			className: 'col-lg-8 col-md-8 col-sm-12 col-xs-12',
			templateOptions: {
				type: 'number',
				label: this.translate.instant('Amount requested') + ' (EUR)',
				required: false,
				hideAsterisk: true,
				step: 0.01,
				change: (field: FormlyFieldConfig, event?: any) => {
					const btc = this.currencyService.convertCurrency(field.model[field.key], 'eur', 'btc');
					checkAndSetCurrencyInputs(btc, { btc: true, eur: false, usd: true });
				}
			},
			hideExpression: (model: any, formState: any, field?: FormlyFieldConfig) => {
				// debugger
				return model.amountCurrency != 'EUR';
			},
			expressionProperties: {
				'templateOptions.required': 'model.amountCurrency == \'EUR\'',
			}
		});

		//amountBTC
		this.wizard.step1.addField({
			type: 'numberDecimal',
			key: 'amountBTC',
			className: 'col-lg-8 col-md-8 col-sm-12 col-xs-12',
			templateOptions: {
				label: this.translate.instant('Amount requested') + ' (BTC)',
				required: false,
				hideAsterisk: true,
				step: ONESATOSHI,
				maxDigits: 8,
				change: (field: FormlyFieldConfig, event?: any) => {
					checkAndSetCurrencyInputs(field.model[field.key], { btc: false, eur: true, usd: true });
				}
			},
			hideExpression: (model: any, formState: any, field?: FormlyFieldConfig) => {
				// debugger
				return model.amountCurrency != 'BTC';
			},
			expressionProperties: {
				'templateOptions.required': 'model.amountCurrency == \'BTC\'',
			},
			validators: {
				validation: ['bitcoin']
			}
		});

		//amountCurrency
		const buttonsGroupOptions = this.utilsService.buttonsGroupOptions();

		this.wizard.step1.addField({
			type: 'buttonsGroup',
			key: 'amountCurrency',
			className: 'col-lg-4 col-md-4 col-sm-12 col-xs-12',
			hooks: {
				onInit: (field: FormlyFieldConfig) => {
					field.formControl.valueChanges.subscribe((value: any) => {
						// debugger
						this.wizard.step1.model;
					});
				}
			},
			templateOptions: {
				label: this.translate.instant('Currency'),
				required: true,
				hideAsterisk: true,
				config: {
					options: buttonsGroupOptions.fiatCurrency.concat([buttonsGroupOptions.btcCurrency[0]]),
					fullSize: true
				},
				// onChange: value => { }
			}
		});

		//description
		this.wizard.step1.addField({
			type: 'textarea',
			key: 'description',
			templateOptions: {
				label: this.translate.instant('Description'),
				placeholder: this.translate.instant('I need a refund for...'),
				required: true,
				hideAsterisk: true,
				minLength: AppSettings.form.length.min.ror.description
			}
		});

		//invoiceCompanyVat
		this.wizard.step1.addField({
			type: 'input',
			key: 'invoiceCompanyVat',
			templateOptions: {
				type: 'text',
				label: this.translate.instant('Document Registration Number'),
				placeholder: this.translate.instant('Document registration number'),
				required: true,
				hideAsterisk: true
			},
			validators: {
				validation: ['alphanumeric']
			}
		});

		//invoiceDate
		this.wizard.step1.addField({
			type: 'dateSelector',
			key: 'invoiceDate',
			templateOptions: {
				label: this.translate.instant('Invoice date'),
				required: true,
				hideAsterisk: true,
				maxDate: new Date()
			}
		});

		//invoiceFile
		this.wizard.step1.addField({
			type: 'dropzone',
			key: 'invoiceFile',
			className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center margin-top-bottom-30',
			templateOptions: {
				label: this.translate.instant('Scanned invoice'),
				required: true,
				hideAsterisk: true,
				config: {
					exts: AppSettings.form.extsFiles,
					maxSize: AppSettings.form.fileSize.media.max,
					maxFiles: 1,
					description: this.translate.instant('Upload the scanned invoice'),
					onAdd: (file: DropzoneFile) => {
						//only files without an id can be added
						if (!file.id)
							this.media.toAdd.push(file);
					},
					onDelete: (file: DropzoneFile) => {
						//only files with an id can be removed
						if (file.id)
							this.media.toDelete.push(file);
						else {
							const i = this.media.toAdd.indexOf(file);
							if (i != -1)
								this.media.toAdd.splice(i, 1);
						}
					}
				}
			}
		});

		//invoicePublicVisibility (always visible)
		// this.wizard.step1.addField({
		// 	type: 'checkbox',
		// 	key: 'invoicePublicVisibility',
		// 	className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center margin-bottom-15',
		// 	templateOptions: {
		// 		text: this.translate.instant('I accept to make this invoice public (optional)')
		// 	}
		// });

		//FINISH

		this.wizard.step2 = NgWizardStep.createFinishStep(translate);
	}

	ngOnInit() {
		const setCurrencyConfigAndInitializeForm = () => {
			// debugger
			const btcMin = AppSettings.minDonation;
			const btcMax = 21000000;

			const eurMin = this.currencyService.convertCurrency(btcMin, 'btc', 'eur');
			let eurMax = this.currencyService.convertCurrency(btcMax, 'btc', 'eur');

			// if(eurMin < 0.01) eurMin = 0.01
			if (eurMax < 0.01) eurMax = (eurMax + 0.01)

			const usdMin = this.currencyService.convertCurrency(btcMin, 'btc', 'usd');
			const usdMax = this.currencyService.convertCurrency(btcMax, 'btc', 'usd');

			this.currencyConfig = {
				btc: {
					min: btcMin,
					max: btcMax
				},
				eur: {
					min: eurMin,
					max: eurMax
				},
				usd: {
					min: usdMin,
					max: usdMax
				}
			};

			//initialize form
			const amountBTCInput = this.wizard.step1.getField('amountBTC');
			const amountEURInput = this.wizard.step1.getField('amountEUR');
			const amountUSDInput = this.wizard.step1.getField('amountUSD');

			amountBTCInput.templateOptions.min = this.currencyConfig.btc.min;
			amountBTCInput.templateOptions.max = this.currencyConfig.btc.max;
			amountEURInput.templateOptions.min = this.currencyConfig.eur.min;
			amountEURInput.templateOptions.max = this.currencyConfig.eur.max;
			amountUSDInput.templateOptions.min = this.currencyConfig.usd.min;
			amountUSDInput.templateOptions.max = this.currencyConfig.usd.max;

			this.wizard.step1.setModelField('amountCurrency', this.currencyService.currency.code);
			// this.wizard.step1.setModelField('amountBTC', amountBTCInput.templateOptions.min);
			// this.wizard.step1.setModelField('amountEUR', amountEURInput.templateOptions.min);
			// this.wizard.step1.setModelField('amountUSD', amountUSDInput.templateOptions.min);
			// this.wizard.step1.setModelField('invoicePublicVisibility', true);
			this.wizard.step1.setModelField('invoiceFile', null);
		};

		this.rorService.getToList().subscribe((users: RorTo[]) => {
			const elements = [];

			users.forEach((user: RorTo) => {
				elements.push({
					id: user._id,
					title: user.fullname + ' (' + user.username + ')',
					imgUrl: this.avatarPipe.transform(user),
					username: user.username,
					// imgUrl: user.media ? getMediaUrl(user.media) : '/media/avatar_empty_org.png',
					href: '/user/' + user.username
				});
			});

			this.wizard.step1.getField('npo').templateOptions.config.elements = elements;
		});

		if (!this.currencyService.isInit)
			this.currencyService.onPriceChange.subscribe(_ => setCurrencyConfigAndInitializeForm());
		else
			setCurrencyConfigAndInitializeForm();
	}

	sendRorInformation () {
		this.wizard.step1.resetResponse();

		const value = this.wizard.step1.model['amount' + this.wizard.step1.model.amountCurrency];

		const json = {
			to: this.wizard.step1.model.npo.username,
			currency: this.wizard.step1.model.amountCurrency,
			description: this.wizard.step1.model.description,
			invvat: this.wizard.step1.model.invoiceCompanyVat,
			invdate: getDateFromDateSelectorModel(this.wizard.step1.model.invoiceDate).toISOString(),
			accept: true, // this.wizard.step1.model.invoicePublicVisibility,
			value: parseFloat(('' + value).replace(',', '.'))
		};

		if (this.wizard.step1.model.invoiceFile.length == 0)
			return this.wizard.step1.setResponse('error', { error: 'EM6' });

		this.rorService.create(json.to, json, this.wizard.step1.model.invoiceFile[0].file).subscribe(_ => {
			this.wizard.step1.next();
		}, res => {
			this.wizard.step1.setResponse('error', res.error);
		});
	}

	static get $inject() { return ['rorService', 'translateService', 'WizardHandler', 'currencyService', '$filter', 'utilsService']; }
}
