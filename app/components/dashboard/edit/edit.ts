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

import subYears from 'date-fns/subYears';
import { UtilsService } from '../../../services/utils';
import { buildErrorResponseMessage, ResponseMessageConfig, buildSuccessResponseMessage } from '../../../shared/components/response-messages/response-messages';
import { DashboardService, UserPrivate } from '../../../models/dashboard';
import { PageHeaderConfig } from 'app/shared/components/page-header/page-header';
import { ModalsConfig } from 'app/shared/components/modal/oldModal/modal';
import AppSettings from '../../../app.settings';
import { Component, OnInit } from '@angular/core';
import { FormGroupEx } from 'app/shared/ngx-formly/form-group-ex';
import { Language, Operators, Inhabitants, Tags, Gender, UserProfileFields } from 'app/models/common';
import { Router, NavigationStart, Event } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormFieldGroup } from 'app/shared/ngx-formly/form-field-group';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Observer } from 'rxjs';
import { DropzoneFile } from 'app/shared/components/dropzone/dropzone';
import { getDateSelectorModelFromDate, getDateFromDateSelectorModel, InputSelectDateNumber } from 'app/shared/components/date-selector/date-selector';
import { openModal } from 'app/shared/components/modal/modal';
import { openModalNotSaved } from './modals/not-saved/not-saved';
import { FileCustom } from 'app/shared/types/input-file';
import { getMediaUrl, getLocalStorage } from 'app/shared/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import { SelectOption } from 'app/shared/ngx-formly/fields/tags/tags';

export interface UserProfile {
	profileInformation: {
		username: string;
		email: string;
	};
	anagraphic: {
		firstName?: string;
		lastName?: string;
		birthDate?: InputSelectDateNumber;
		gender?: Gender;
		mobilePhone?: string;
		website?: string;
		emailLanguage?: Language;
		country?: string;
		fullName?: string;
		telePhone?: string;
		foundationDate?: InputSelectDateNumber;
		vat?: string;
		operators?: Operators;
		tags?: Tags[];
		biography?: string;
	};
	mayor: {
		inhabitants?: Inhabitants;
		mayor?: string;
		mandatePeriod?: string;
	};
	referent: {
		referentFirstName?: string;
		referentLastName?: string;
		referentIdNumber?: string;
		referentEmail?: string;
	};
	coverflow: {
		coverflowPhoto?: DropzoneFile[];
	};
}

@Component({
	selector: 'me-edit-component',
	templateUrl: 'edit.html',
	styleUrls: ['../../../sass/main/custom/page.scss', 'edit.scss']
})
export class MeEditComponent implements OnInit {
	public pageHeader: PageHeaderConfig;
	private modals: ModalsConfig;
	public user: UserPrivate;
	private oldUser: UserProfile;
	private isSaved: boolean;
	private loading: boolean;
	private requiredFields: UserProfileFields[];
	private coverflowInizialize: boolean;
	public responseMessage: ResponseMessageConfig;
	private discardChangesChoice: (any) => void;

	public form: FormGroupEx<UserProfile>;

	constructor(
		private dashboardService: DashboardService,
		private utilsService: UtilsService,
		private routerService: Router,
		private translate: TranslateService,
		private modalService: NgbModal
	) {
		this.pageHeader = {
			description: {
				title: translate.instant('User Information'),
				subTitle: translate.instant('Edit your account information')
			}
		};

		this.modals = {
			notSaved: {
				id: 'notSavedModal'
			},
			confirm: {
				id: 'modalConfirm',
				modalClass: 'modal-md',
				hideCloseButton: true,
				title: this.translate.instant('Confirm delete avatar'),
				description: this.translate.instant('Are you sure to delete your avatar image?')
			}
		};

		this.user = null;
		this.oldUser = null;
		this.isSaved = false;
		this.loading = false;
		this.requiredFields = [];
		this.coverflowInizialize = true;

		this.form = new FormGroupEx();
	}

	createForm() {
		/* FORMS */

		//FIELDS GROUP
		const fieldGroupProfileInformation = new FormFieldGroup('formly-group');
		const fieldGroupAnagraphic = new FormFieldGroup('formly-group');
		const fieldGroupMayor = new FormFieldGroup('formly-group');
		const fieldGroupReferent = new FormFieldGroup('formly-group');
		const fieldGroupCoverflow = new FormFieldGroup('formly-group');

		fieldGroupProfileInformation.setKey('profileInformation');
		fieldGroupAnagraphic.setKey('anagraphic');
		fieldGroupMayor.setKey('mayor');
		fieldGroupReferent.setKey('referent');
		fieldGroupCoverflow.setKey('coverflow');

		let anagraphicLabel = '';
		switch (this.user.usertype) {
			case 'company':
				anagraphicLabel = this.translate.instant('Company Anagraphic');
				break;
			case 'npo':
				if (this.user.subtype == 'municipality')
					anagraphicLabel = this.translate.instant('Municipality Anagraphic');
				else
					anagraphicLabel = this.translate.instant('Non-profit Anagraphic');
				break;
			default:
				anagraphicLabel = this.translate.instant('Anagraphic');
		}

		fieldGroupProfileInformation.addFieldGroupLabel(this.translate.instant('User Information'));
		fieldGroupAnagraphic.addFieldGroupLabel(anagraphicLabel);
		fieldGroupMayor.addFieldGroupLabel(this.translate.instant('Mayor'));
		fieldGroupReferent.addFieldGroupLabel(this.translate.instant('Referent'), 
			this.translate.instant('This is the person that is managing this account. Fill out the form with your name, surname and ID'));
		fieldGroupCoverflow.addFieldGroupLabel(this.translate.instant('Coverflow'));

		//PROFILE INFORMATION

		//username
		fieldGroupProfileInformation.addField({
			type: 'input',
			key: 'username',
			className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
			templateOptions: {
				type: 'text',
				label: this.translate.instant('Username'),
				disabled: true
			}
		});

		//email
		fieldGroupProfileInformation.addField({
			type: 'email',
			key: 'email',
			className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
			templateOptions: {
				label: this.translate.instant('Email'),
				disabled: true
			}
		});

		switch (this.user.usertype) {
			case 'singleuser': {
				//ANAGRAPHIC

				//firstName
				fieldGroupAnagraphic.addField({
					type: 'input',
					key: 'firstName',
					className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
					templateOptions: {
						type: 'text',
						label: this.translate.instant('First Name'),
						placeholder: this.translate.instant('John'),
						minLength: AppSettings.form.length.min.firstName,
						change: (field: FormlyFieldConfig, event?: any) => {
							this.isSaved = false;
						}
					}
				});

				//lastName
				fieldGroupAnagraphic.addField({
					type: 'input',
					key: 'lastName',
					className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
					templateOptions: {
						type: 'text',
						label: this.translate.instant('Last Name'),
						placeholder: this.translate.instant('Smith'),
						minLength: AppSettings.form.length.min.lastName,
						change: (field: FormlyFieldConfig, event?: any) => {
							this.isSaved = false;
						}
					}
				});

				//birthDate
				fieldGroupAnagraphic.addField({
					type: 'dateSelector',
					key: 'birthDate',
					className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
					templateOptions: {
						label: this.translate.instant('Birth Date'),
						maxDate: subYears(new Date(), 18),
						change: (field: FormlyFieldConfig, event?: any) => {
							this.isSaved = false;
						}
					}
				});

				//gender
				fieldGroupAnagraphic.addField({
					type: 'select',
					key: 'gender',
					className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
					templateOptions: {
						label: this.translate.instant('Gender'),
						options: [
							{
								label: this.translate.instant('Male'),
								value: 'm'
							},
							{
								label: this.translate.instant('Female'),
								value: 'f'
							},
							{
								label: this.translate.instant('Not Declared'),
								value: 'a'
							}
						],
						change: (field: FormlyFieldConfig, event?: any) => {
							this.isSaved = false;
						}
					}
				});

				//mobilePhone
				fieldGroupAnagraphic.addField({
					type: 'phoneNumber',
					key: 'mobilePhone',
					className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
					templateOptions: {
						label: this.translate.instant('Mobile Phone'),
						change: (field: FormlyFieldConfig, event?: any) => {
							this.isSaved = false;
						},
						config: {
							country: this.user.country
						}
					}
				});

				//website
				fieldGroupAnagraphic.addField({
					type: 'url',
					key: 'website',
					className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
					templateOptions: {
						label: this.translate.instant('Website'),
						placeholder: this.translate.instant('www.example.com'),
						change: (field: FormlyFieldConfig, event?: any) => {
							this.isSaved = false;
						}
					}
				});

				//emailLanguage
				fieldGroupAnagraphic.addField({
					type: 'select',
					key: 'emailLanguage',
					className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
					templateOptions: {
						label: this.translate.instant('Language'),
						change: (field: FormlyFieldConfig, event?: any) => {
							this.isSaved = false;
						},
						options: [
							{
								label: this.translate.instant('Italian'),
								value: 'it'
							},
							{
								label: this.translate.instant('English'),
								value: 'en'
							},
							{
								label: this.translate.instant('Spanish'),
								value: 'es'
							}
						]
					}
				});

				//country
				fieldGroupAnagraphic.addField({
					type: 'select',
					key: 'country',
					className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
					templateOptions: {
						label: this.translate.instant('Country'),
						options: [],
						change: (field: FormlyFieldConfig, event?: any) => {
							this.isSaved = false;

							if (this.user.usertype == 'company' || (this.user.usertype == 'npo' && this.user.subtype != 'municipality'))
								this.setVatByCountry(field.formControl.value);
						}
					}
				});

				break;
			};
			case 'npo':
			case 'company': {
				//ANAGRAPHIC

				//fullName
				const fullNameLabel = (this.user.usertype == 'company') ?
					this.translate.instant('Company Full Name') :
					(this.user.subtype != 'municipality') ?
						this.translate.instant('Non-profit Full Name') :
						this.translate.instant('Municipality Full Name');

				fieldGroupAnagraphic.addField({
					type: 'input',
					key: 'fullName',
					className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
					templateOptions: {
						type: 'text',
						label: fullNameLabel,
						placeholder: fullNameLabel,
						change: (field: FormlyFieldConfig, event?: any) => {
							this.isSaved = false;
						}
					}
				});

				//telePhone
				fieldGroupAnagraphic.addField({
					type: 'phoneNumber',
					key: 'telePhone',
					className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
					templateOptions: {
						label: this.translate.instant('Telephone'),
						change: (field: FormlyFieldConfig, event?: any) => {
							this.isSaved = false;
						},
						config: {
							country: this.user.country
						}
					}
				});

				//mobilePhone
				fieldGroupAnagraphic.addField({
					type: 'phoneNumber',
					key: 'mobilePhone',
					className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
					templateOptions: {
						label: this.translate.instant('Mobile Phone'),
						change: (field: FormlyFieldConfig, event?: any) => {
							this.isSaved = false;
						},
						config: {
							country: this.user.country
						}
					}
				});

				//website
				fieldGroupAnagraphic.addField({
					type: 'url',
					key: 'website',
					className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
					templateOptions: {
						label: this.translate.instant('Website'),
						placeholder: this.translate.instant('www.example.com'),
						change: (field: FormlyFieldConfig, event?: any) => {
							this.isSaved = false;
						}
					}
				});

				//foundationDate
				fieldGroupAnagraphic.addField({
					type: 'dateSelector',
					key: 'foundationDate',
					className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
					templateOptions: {
						label: this.translate.instant('Foundation date'),
						maxDate: new Date(),
						change: (field: FormlyFieldConfig, event?: any) => {
							this.isSaved = false;
						}
					}
				});

				//country
				fieldGroupAnagraphic.addField({
					type: 'select',
					key: 'country',
					className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
					templateOptions: {
						label: this.translate.instant('Country'),
						options: [],
						change: (field: FormlyFieldConfig, event?: any) => {
							this.isSaved = false;

							if (this.user.usertype == 'company' || (this.user.usertype == 'npo' && this.user.subtype != 'municipality'))
								this.setVatByCountry(field.formControl.value);
						}
					}
				});

				//emailLanguage
				fieldGroupAnagraphic.addField({
					type: 'select',
					key: 'emailLanguage',
					className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
					templateOptions: {
						label: this.translate.instant('Language'),
						change: (field: FormlyFieldConfig, event?: any) => {
							this.isSaved = false;
						},
						options: [
							{
								label: this.translate.instant('Italian'),
								value: 'it'
							},
							{
								label: this.translate.instant('English'),
								value: 'en'
							},
							{
								label: this.translate.instant('Spanish'),
								value: 'es'
							}
						]
					}
				});

				if (this.user.subtype == 'municipality') {
					//ANAGRAPHIC

					//inhabitants
					fieldGroupAnagraphic.addField({
						type: 'select',
						key: 'inhabitants',
						className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
						templateOptions: {
							label: this.translate.instant('Inhabitants'),
							options: AppSettings.form.options.inhabitants.default,
							change: (field: FormlyFieldConfig, event?: any) => {
								this.isSaved = false;
							}
						}
					});

					//MAYOR

					//mayor
					fieldGroupMayor.addField({
						type: 'input',
						key: 'mayor',
						className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
						templateOptions: {
							type: 'text',
							label: this.translate.instant('Mayor Full Name'),
							placeholder: this.translate.instant('John Smith'),
							change: (field: FormlyFieldConfig, event?: any) => {
								this.isSaved = false;
							}
						}
					});

					//mandatePeriod
					fieldGroupMayor.addField({
						type: 'dateSelector',
						key: 'mandatePeriod',
						className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
						templateOptions: {
							label: this.translate.instant('Mandate period end'),
							change: (field: FormlyFieldConfig, event?: any) => {
								this.isSaved = false;
							}
						}
					});
				}
				else {
					//ANAGRAPHIC

					//vat
					fieldGroupAnagraphic.addField({
						type: 'input',
						key: 'vat',
						className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
						templateOptions: {
							type: 'text',
							label: this.translate.instant((this.user.usertype == 'company') ? 'Tax code' : 'Registration Number'),
							placeholder: 'AA123479',
							change: (field: FormlyFieldConfig, event?: any) => {
								this.isSaved = false;
							}
						}
					});

					if (this.user.usertype == 'npo') {
						//ANAGRAPHIC

						//operators
						fieldGroupAnagraphic.addField({
							type: 'select',
							key: 'operators',
							className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
							templateOptions: {
								label: this.translate.instant('Operators Number'),
								helperTooltip: {
									content: this.translate.instant('Number of employees and volunteers')
								},
								options: AppSettings.form.options.operators.default,
								change: (field: FormlyFieldConfig, event?: any) => {
									this.isSaved = false;
								}
							}
						});

						//tags
						fieldGroupAnagraphic.addField({
							type: 'tagsButtons',
							key: 'tags',
							className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
							templateOptions: {
								label: this.translate.instant('Tags'),
								config: {
									click: () => {
										this.isSaved = false;
									},
									tagsAvailable: this.utilsService.tags()
								},
								helperTooltip: {
									content: this.translate.instant('Select each activity involved in your association')
								}
							}
						});

						//REFERENT

						//referentFirstName
						fieldGroupReferent.addField({
							type: 'input',
							key: 'referentFirstName',
							className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
							templateOptions: {
								type: 'text',
								label: this.translate.instant('First Name'),
								placeholder: this.translate.instant('John'),
								minLength: AppSettings.form.length.min.firstName,
								change: (field: FormlyFieldConfig, event?: any) => {
									this.isSaved = false;
								}
							}
						});

						//referentLastName
						fieldGroupReferent.addField({
							type: 'input',
							key: 'referentLastName',
							className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
							templateOptions: {
								type: 'text',
								label: this.translate.instant('Last Name'),
								placeholder: this.translate.instant('Smith'),
								minLength: AppSettings.form.length.min.lastName,
								change: (field: FormlyFieldConfig, event?: any) => {
									this.isSaved = false;
								}
							}
						});

						//referentIdNumber
						fieldGroupReferent.addField({
							type: 'input',
							key: 'referentIdNumber',
							className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
							templateOptions: {
								type: 'text',
								label: this.translate.instant('ID Number'),
								placeholder: 'US01245D',
								minLength: AppSettings.form.length.min.idNumber,
								change: (field: FormlyFieldConfig, event?: any) => {
									this.isSaved = false;
								}
							}
						});

						//referentEmail
						fieldGroupReferent.addField({
							type: 'email',
							key: 'referentEmail',
							className: 'col-lg-6 col-md-6 col-sm-6 col-xs-12',
							templateOptions: {
								label: this.translate.instant('Personal Email'),
								placeholder: this.translate.instant('johnsmith@email.com'),
								change: (field: FormlyFieldConfig, event?: any) => {
									this.isSaved = false;
								}
							}
						});
					}
				}

				//COVERFLOW

				//coverflowPhoto
				fieldGroupCoverflow.addField({
					type: 'dropzone',
					key: 'coverflowPhoto',
					className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
					templateOptions: {
						// label: this.translate.instant('Coverflow Photo'),
						placeholder: '',
						config: {
							exts: AppSettings.form.extsImages,
							maxSize: AppSettings.form.fileSize.media.max,
							maxFiles: 1,
							description: this.translate.instant('Insert your coverflow photo (max height 150 px)'),
							onAdd: (file: DropzoneFile) => {
								if (this.coverflowInizialize) {
									if (file)
										this.uploadCoverflow(file.file);
								}
								else
									this.coverflowInizialize = true;
							},
							onDelete: (file: File) => {
								this.deleteCoverflow()
							}
						}
					}
				});

				break;
			};
		}

		//ANAGRAPHIC

		//biography
		fieldGroupAnagraphic.addField({
			type: 'textarea',
			key: 'biography',
			className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
			templateOptions: {
				label: this.translate.instant('Biography'),
				placeholder: (() => {
					let placeholder = null;

					switch (this.user.usertype) {
						case 'singleuser': {
							placeholder = this.translate.instant('I\'am a carpenter...');
							break;
						}
						case 'company': {
							placeholder = this.translate.instant('We are a Company that operate in these fields...');
							break;
						}
						case 'npo': {
							if (this.user.subtype == 'municipality')
								placeholder = this.translate.instant('We are a Municipality that operate in these fields...');
							else
								placeholder = this.translate.instant('We are a Non Profit Organization that operate in these fields...');
							break;
						}
					}

					return placeholder;
				})(),
			}
		});

		this.form.addFieldGroup(fieldGroupProfileInformation);
		this.form.addFieldGroup(fieldGroupAnagraphic);

		if (this.user.usertype == 'npo')
			if (this.user.subtype == 'municipality')
				this.form.addFieldGroup(fieldGroupMayor);
			else
				this.form.addFieldGroup(fieldGroupReferent);
		if (this.user.usertype != 'singleuser')
			this.form.addFieldGroup(fieldGroupCoverflow);

		//Inizialize Form

		this.form.initializeModel({
			profileInformation: {
				username: null,
				email: null
			},
			anagraphic: {
				firstName: null,
				lastName: null,
				birthDate: null,
				gender: null,
				mobilePhone: null,
				website: null,
				emailLanguage: null,
				country: null,
				fullName: null,
				telePhone: null,
				foundationDate: null,
				vat: null,
				operators: null,
				tags: null,
				biography: null
			},
			mayor: {
				inhabitants: null,
				mayor: null,
				mandatePeriod: null
			},
			referent: {
				referentFirstName: null,
				referentLastName: null,
				referentIdNumber: null,
				referentEmail: null
			},
			coverflow: {
				coverflowPhoto: null
			}
		});
	}

	public updateUserInformation() {
		this.responseMessage = null;
		this.loading = true;
		//oltre a settare il json, nel caso della npo setto anche i tags
		const json: any = {};

		json.bio = {
			en: this.form.model.anagraphic.biography,
			language: this.form.model.anagraphic.emailLanguage
		};

		switch (this.user.usertype) {
			case 'singleuser': {
				if (!this.user.locked) {
					json.country = this.form.model.anagraphic.country;
					json.firstname = this.form.model.anagraphic.firstName;
					json.lastname = this.form.model.anagraphic.lastName;
					json.birthdate = getDateFromDateSelectorModel(this.form.model.anagraphic.birthDate);
					json.gender = this.form.model.anagraphic.gender;
				}

				json.website = this.form.model.anagraphic.website;
				json.mobile = this.form.model.anagraphic.mobilePhone;

				break;
			}
			case 'npo':
			case 'company': {
				if (!this.user.locked) {
					json.country = this.form.model.anagraphic.country;
					json.fullname = this.form.model.anagraphic.fullName;
					json.telephone = this.form.model.anagraphic.telePhone;
					json.mobile = this.form.model.anagraphic.mobilePhone;
					json.birthdate = getDateFromDateSelectorModel(this.form.model.anagraphic.foundationDate);
					json.website = this.form.model.anagraphic.website;

					if (this.user.subtype == 'municipality') {
						json.inhabitants = this.form.model.mayor.inhabitants;
						json.mandateperiod = this.form.model.mayor.mandatePeriod;
						json.mayor = this.form.model.mayor.mayor;
					}
					else {
						json.vat = this.form.model.anagraphic.vat;
						if (this.user.usertype == 'npo') {
							json.referent = {};
							json.referent.firstname = this.form.model.referent.referentFirstName;
							json.referent.lastname = this.form.model.referent.referentLastName;
							json.referent.idnumber = this.form.model.referent.referentIdNumber;
							json.referent.email = this.form.model.referent.referentEmail;
							json.operators = this.form.model.anagraphic.operators;
							json.tags = this.form.model.anagraphic.tags;
						}
					}
				}

				break;
			}
		};

		const observer = new Observable((observer: Observer<void>) => {
			this.dashboardService.edit(json)
				.subscribe(_ => {
					this.isSaved = true;
					this.loading = false;
					this.responseMessage = buildSuccessResponseMessage({ text: this.translate.instant('Profile updated successfully') }, true);
					this.dashboardService.emitNotificationUpdate('edit');
					observer.complete();
				}, (res) => {
					this.loading = false;
					this.responseMessage = buildErrorResponseMessage(res.error, true);
					observer.error(res);
				});
		});

		observer.subscribe();

		return observer;
	}

	uploadAvatar(event) {
		const file = event.target.files[0];
		this.responseMessage = null;

		this.dashboardService.updateAvatar(file).subscribe(_ => {
			this.responseMessage = buildSuccessResponseMessage({ text: this.translate.instant('Profile avatar updated successfully') }, true);
			this.initializeUser()
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.error, true);
		});
	};

	deleteAvatar() {
		this.responseMessage = null;

		this.dashboardService.deleteAvatar().subscribe(_ => {
			this.responseMessage = buildSuccessResponseMessage({ text: this.translate.instant('Profile avatar deleted successfully') }, true);
			this.initializeUser();
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.error, true);
		});
	};

	uploadCoverflow(file) {
		this.responseMessage = null;

		this.dashboardService.updateCoverflow(file).subscribe(_ => {
			this.responseMessage = buildSuccessResponseMessage({ text: this.translate.instant('Coverflow photo updated successfully') }, true);
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.error, true);
		});
	};

	deleteCoverflow() {
		this.responseMessage = null;

		this.dashboardService.deleteCoverflow().subscribe(_ => {
			this.responseMessage = buildSuccessResponseMessage({ text: this.translate.instant('Coverflow photo deleted successfully') }, true);
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.error, true);
		});
	};

	openModalConfirmDeleteAvatar() {
		openModal(this.modalService, this.modals.confirm).result.then(
			(v) => { this.deleteAvatar(); },
			() => { });
	};

	setVatByCountry(country) {
		const inputTax = this.form.getField('vat', 'anagraphic');

		//TODO il placeholder non cambia
		switch (country) {
			case 'ITA': {
				inputTax.templateOptions.label = 'P. IVA';
				inputTax.templateOptions.placeholder = '13628362823';
				break;
			}
			default: {
				inputTax.templateOptions.label = this.translate.instant('Tax code');
				inputTax.templateOptions.placeholder = 'AA123479';
			}
		}
	};

	initializeUser() {
		return this.dashboardService.get().subscribe((user: UserPrivate) => {
			this.user = user;
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.error);
		});
	};

	ngOnInit() {
		const setMandatoryFields = () => {
			let field: FormlyFieldConfig = null;

			//language
			field = this.form.getField('emailLanguage', 'anagraphic');
			field.templateOptions.required = this.requiredFields.indexOf('language') != -1;
			field.templateOptions.disabled = this.requiredFields.indexOf('language') != -1 && this.user.locked;

			//biography
			field = this.form.getField('biography', 'anagraphic');
			field.templateOptions.required = this.requiredFields.indexOf('biography') != -1;
			field.templateOptions.disabled = this.requiredFields.indexOf('biography') != -1 && this.user.locked;

			switch (this.user.usertype) {
				case 'singleuser': {
					//firstname
					field = this.form.getField('firstName', 'anagraphic');
					field.templateOptions.required = this.requiredFields.indexOf('firstname') != -1;
					field.templateOptions.disabled = this.requiredFields.indexOf('firstname') != -1 && this.user.locked;

					//lastname
					field = this.form.getField('lastName', 'anagraphic');
					field.templateOptions.required = this.requiredFields.indexOf('lastname') != -1;
					field.templateOptions.disabled = this.requiredFields.indexOf('lastname') != -1 && this.user.locked;

					//birthdate
					field = this.form.getField('birthDate', 'anagraphic');
					field.templateOptions.required = this.requiredFields.indexOf('birthdate') != -1;
					field.templateOptions.disabled = this.requiredFields.indexOf('birthdate') != -1 && this.user.locked;

					//gender
					field = this.form.getField('gender', 'anagraphic');
					field.templateOptions.required = this.requiredFields.indexOf('gender') != -1;
					field.templateOptions.disabled = this.requiredFields.indexOf('gender') != -1 && this.user.locked;

					//mobile
					field = this.form.getField('mobilePhone', 'anagraphic');
					field.templateOptions.required = this.requiredFields.indexOf('mobile') != -1;
					field.templateOptions.disabled = this.requiredFields.indexOf('mobile') != -1 && this.user.locked;

					//website
					field = this.form.getField('website', 'anagraphic');
					field.templateOptions.required = this.requiredFields.indexOf('website') != -1;
					field.templateOptions.disabled = this.requiredFields.indexOf('website') != -1 && this.user.locked;

					//country
					field = this.form.getField('country', 'anagraphic');
					field.templateOptions.required = this.requiredFields.indexOf('country') != -1;
					field.templateOptions.disabled = this.requiredFields.indexOf('country') != -1 && this.user.locked;

					break;
				}
				case 'npo':
				case 'company': {
					//fullname
					field = this.form.getField('fullName', 'anagraphic');
					field.templateOptions.required = this.requiredFields.indexOf('fullname') != -1;
					field.templateOptions.disabled = this.requiredFields.indexOf('fullname') != -1 && this.user.locked;

					//telephone
					field = this.form.getField('telePhone', 'anagraphic');
					field.templateOptions.required = this.requiredFields.indexOf('telephone') != -1;
					field.templateOptions.disabled = this.requiredFields.indexOf('telephone') != -1 && this.user.locked;

					//mobile
					field = this.form.getField('mobilePhone', 'anagraphic');
					field.templateOptions.required = this.requiredFields.indexOf('mobile') != -1;
					field.templateOptions.disabled = this.requiredFields.indexOf('mobile') != -1 && this.user.locked;

					//website
					field = this.form.getField('website', 'anagraphic');
					field.templateOptions.required = this.requiredFields.indexOf('website') != -1;
					field.templateOptions.disabled = this.requiredFields.indexOf('website') != -1 && this.user.locked;

					//birthdate
					field = this.form.getField('foundationDate', 'anagraphic');
					field.templateOptions.required = this.requiredFields.indexOf('birthdate') != -1;
					field.templateOptions.disabled = this.requiredFields.indexOf('birthdate') != -1 && this.user.locked;

					//country
					field = this.form.getField('country', 'anagraphic');
					field.templateOptions.required = this.requiredFields.indexOf('country') != -1;
					field.templateOptions.disabled = this.requiredFields.indexOf('country') != -1 && this.user.locked;

					if (this.user.subtype == 'municipality') {
						//inhabitants
						field = this.form.getField('inhabitants', 'anagraphic');
						field.templateOptions.required = this.requiredFields.indexOf('inhabitants') != -1;
						field.templateOptions.disabled = this.requiredFields.indexOf('inhabitants') != -1 && this.user.locked;

						//mayor
						field = this.form.getField('mayor', 'mayor');
						field.templateOptions.required = this.requiredFields.indexOf('mayor') != -1;
						field.templateOptions.disabled = this.requiredFields.indexOf('mayor') != -1 && this.user.locked;

						//mandateperiod
						field = this.form.getField('mandatePeriod', 'mayor');
						field.templateOptions.required = this.requiredFields.indexOf('mandateperiod') != -1;
						field.templateOptions.disabled = this.requiredFields.indexOf('mandateperiod') != -1 && this.user.locked;
					}
					else {
						//vat
						field = this.form.getField('vat', 'anagraphic');
						field.templateOptions.required = this.requiredFields.indexOf('vat') != -1;
						field.templateOptions.disabled = this.requiredFields.indexOf('vat') != -1 && this.user.locked;

						if (this.user.usertype == 'npo') {
							//operators
							field = this.form.getField('operators', 'anagraphic');
							field.templateOptions.required = this.requiredFields.indexOf('operators') != -1;
							field.templateOptions.disabled = this.requiredFields.indexOf('operators') != -1 && this.user.locked;

							//tags
							field = this.form.getField('tags', 'anagraphic');
							field.templateOptions.required = this.requiredFields.indexOf('tags') != -1;
							field.templateOptions.disabled = this.requiredFields.indexOf('tags') != -1 && this.user.locked;

							//referent.firstname
							field = this.form.getField('referentFirstName', 'referent');
							field.templateOptions.required = this.requiredFields.indexOf('referent.firstname') != -1;
							field.templateOptions.disabled = this.requiredFields.indexOf('referent.firstname') != -1 && this.user.locked;

							//referent.lastname
							field = this.form.getField('referentLastName', 'referent');
							field.templateOptions.required = this.requiredFields.indexOf('referent.lastname') != -1;
							field.templateOptions.disabled = this.requiredFields.indexOf('referent.lastname') != -1 && this.user.locked;

							//referent.idnumber
							field = this.form.getField('referentIdNumber', 'referent');
							field.templateOptions.required = this.requiredFields.indexOf('referent.idnumber') != -1;
							field.templateOptions.disabled = this.requiredFields.indexOf('referent.idnumber') != -1 && this.user.locked;

							//referent.email
							field = this.form.getField('referentEmail', 'referent');
							field.templateOptions.required = this.requiredFields.indexOf('referent.email') != -1;
							field.templateOptions.disabled = this.requiredFields.indexOf('referent.email') != -1 && this.user.locked;
						}

						//photo
						field = this.form.getField('coverflowPhoto', 'coverflow');
						field.templateOptions.required = this.requiredFields.indexOf('photo') != -1;
						field.templateOptions.disabled = this.requiredFields.indexOf('photo') != -1 && this.user.locked;
					}

					break;
				}
			}
		}

		//Ask for save on exit
		// var notsaved = false;
		//TODO ANGULAR 8 - userare una qualche classe router e fare il subscribe
		// this.routerService.events.subscribe((event, next, current) => {
		this.routerService.events.subscribe((event: Event) => {
			if (!(event instanceof NavigationStart) || this.isSaved || !this.oldUser) return;
			const eventNavigationStart: NavigationStart = <NavigationStart>event;
			let changes = false;

			//create a copy
			const newUser = JSON.parse(JSON.stringify(this.form.model));

			//coverflow is managed alone for upload and delete, no need to control it
			if (newUser.coverflowPhoto)
				delete newUser.coverflowPhoto;

			//TODO meglio creare un metodo che ricorsivamente controlli un oggetto in tutti i casi possibili
			for (const key in newUser)
				if (Array.isArray(newUser[key])) {
					for (let i = 0; i < newUser[key].length; i++) {
						if (newUser[key][i] != this.oldUser[key][i]) {
							changes = true;
							break;
						}
					}
				}
				else if (newUser[key] != this.oldUser[key]) {
					changes = true;
					break;
				}

			if (changes) {
				// DECOMMENTA QUESTA PARTE e attentato che va in loop
				// openModalNotSaved(this.modalService, this.modals.notSaved)
				// 	.result.then((v) => {
				// 		this.updateUserInformation().subscribe(() => {
				// 			this.routerService.navigate([eventNavigationStart.url])
				// 		});
				// 	}, () => {
				// 		this.routerService.navigate([eventNavigationStart.url])
				// 	});




				// eventNavigationStart.preventDefault();


				// this.discardChangesChoice = save => {
				// 	this.isSaved = false;
				// 	// $('#' + this.modals.notSaved.id).modal('hide');

				// 	if (save) {
				// 		this.updateUserInformation().subscribe(() => {
				// 			this.routerService.navigate([event.url])
				// 		});
				// 	}
				// 	else
				// 		this.routerService.navigate([event.url])
				// };

				// setTimeout(() => { $('#' + this.modals.notSaved.id).modal('show'); }, 100);
				// event.preventDefault();
			}
		});

		const setupForm = () => {
			//Initialize Form
			this.form.setModelField('username', this.user.username, 'profileInformation');
			this.form.setModelField('email', this.user.email, 'profileInformation');

			this.form.setModelField('website', this.user.website, 'anagraphic');
			this.form.setModelField('biography', this.user.bio.en, 'anagraphic');
			this.form.setModelField('emailLanguage', this.user.language, 'anagraphic');
			this.form.setModelField('country', this.user.country, 'anagraphic');

			switch (this.user.usertype) {
				case 'singleuser': {
					this.form.setModelField('firstName', this.user.firstname, 'anagraphic');
					this.form.setModelField('lastName', this.user.lastname, 'anagraphic');

					if (this.user.birthdate)
						this.form.setModelField('birthDate', getDateSelectorModelFromDate(new Date(this.user.birthdate)), 'anagraphic');

					this.form.setModelField('gender', this.user.gender, 'anagraphic');
					this.form.setModelField('mobilePhone', this.user.mobile, 'anagraphic');

					break;
				}
				case 'npo':
				case 'company': {
					this.form.setModelField('fullName', this.user.fullname, 'anagraphic');
					this.form.setModelField('telePhone', this.user.telephone, 'anagraphic');
					this.form.setModelField('mobilePhone', this.user.mobile, 'anagraphic');

					if (this.user.birthdate)
						this.form.setModelField('foundationDate', getDateSelectorModelFromDate(new Date(this.user.birthdate)), 'anagraphic');

					if (this.user.subtype == 'municipality') {
						this.form.setModelField('inhabitants', this.user.inhabitants, 'anagraphic');
						this.form.setModelField('mayor', this.user.mayor, 'mayor');

						if (this.user.mandateperiod)
							this.form.setModelField('mandatePeriod', getDateSelectorModelFromDate(new Date(this.user.mandateperiod)), 'mayor');
					}
					else {
						this.form.setModelField('vat', this.user.vat, 'anagraphic');

						if (this.user.usertype == 'npo') {
							this.form.setModelField('referentFirstName', this.user.referent.firstname, 'referent');
							this.form.setModelField('referentLastName', this.user.referent.lastname, 'referent');
							this.form.setModelField('referentIdNumber', this.user.referent.idnumber, 'referent');
							this.form.setModelField('referentEmail', this.user.referent.email, 'referent');
							this.form.setModelField('operators', this.user.operators, 'anagraphic');
							this.form.setModelField('tags', this.user.tags, 'anagraphic');
						}
					}

					break;
				}
			};

			this.oldUser = JSON.parse(JSON.stringify(this.form.model));

			//other initializations
			if (this.user.photo) {
				this.coverflowInizialize = false;
				const coverflowUrl = getMediaUrl(this.user.photo + '?token=' + getLocalStorage().getItem('token'));

				this.utilsService.getFileFromUrl({ url: coverflowUrl, fileName: 'coverflow', id: this.user.photo }).subscribe((res: FileCustom) => {
					this.form.setModelField('coverflowPhoto', [res], 'coverflow');
				}, res => { this.responseMessage = buildErrorResponseMessage(res.error); });
			}

			this.utilsService.getCountrySelectOptions().subscribe((countryOptions: SelectOption[]) => {
				this.form.getField('country', 'anagraphic').templateOptions.options = countryOptions;
			});

			if (this.user.usertype == 'company' || (this.user.usertype == 'npo' && this.user.subtype != 'municipality'))
				this.setVatByCountry(this.form.model.anagraphic.country);
		};

		this.dashboardService.get().subscribe((user: UserPrivate) => {
			this.user = user;
			// this.oldUser = JSON.parse(JSON.stringify(res.data));

			if(this.user.usertype == 'npo'){
				this.pageHeader.description.title = this.translate.instant('Non-profit Information');
			}

			if (!this.user.tags)
				this.user.tags = [];

			this.createForm();

			setTimeout(() => {
				setupForm();

				//wait promise because if there are some required fields
				this.dashboardService.getVerify().subscribe(data => {
					this.requiredFields = data.mandatoryfields;
					setMandatoryFields();
				}, res => {
					this.requiredFields = res.error.data.mandatoryfields;
					setMandatoryFields();
				});
			}, 0)
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.data, true);
			this.routerService.navigate(['/login']);
		});
	}
}