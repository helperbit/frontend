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

// import UtilsService, { getValueFormArrayByKeyName } from '../../../../../services/utils';
// import { buildErrorResponseMessage, ResponseMessageConfig } from '../../../../../shared/components/response-messages/response-messages';
// import { DashboardService,  UserPrivate } from '../../../../../models/dashboard';
// import TranslateService from 'app/services/translate';
// import { WizardStep } from '../../../../../../app/shared/helpers/wizard-step';
// import { FieldGroup } from '../../../../../../app/shared/helpers/field-group';
// import { Field } from '../../../../../../app/shared/helpers/field';
// import { User } from 'app/models/user';
// import AppSettings from '../../../../../app.settings';

// export class NpoController {
// 	resolve: any;
// 	close: (value: any) => void;
// 	dismiss: (value: any) => void;

// 	dashboardService: DashboardService;
// 	translateService: TranslateService;
// 	WizardHandler: any;
// 	utilsService: UtilsService;
// 	$q: angular.IQService;

// 	responseMessage: ResponseMessageConfig;
// 	user: User;
// 	editMode: boolean;

// 	formNpo: {
// 		step1: WizardStep<{
// 			referentFullName: string;
// 			referentEmail: string;
// 			referentPhoneNumber: string;
// 		}>;
// 		step2: WizardStep<{
// 			statuteMedia: any[];
// 			memorandumMedia: any[];
// 			actOfBoardMedia: any[];
// 		}>;
// 		step3: WizardStep<{
// 			referentFullName: string;
// 			referentPhoneNumber: string;
// 			referentEmail: string;
// 			statuteMedia: any;
// 			memorandumMedia: any;
// 			actOfBoardMedia: any;
// 		}>;
// 		finish: WizardStep<any>;
// 	};

// 	constructor (dashboardService, translateService, WizardHandler, utilsService, $q) {
// 		this.dashboardService = dashboardService;
// 		this.translateService = translateService;
// 		this.WizardHandler = WizardHandler;
// 		this.utilsService = utilsService;
// 		this.$q = $q;

// 		this.formNpo = {
// 			step1: new WizardStep('wizardNpo', this.WizardHandler),
// 			step2: new WizardStep('wizardNpo', this.WizardHandler),
// 			step3: new WizardStep('wizardNpo', this.WizardHandler),
// 			finish: WizardStep.createFinishStep('wizardNpo', this.WizardHandler, translateService)
// 		};
// 	}

// 	updateBindingResolve() {
// 		if(!this.user || !this.resolve || !this.resolve.modalData) return;

// 		this.editMode = true;

// 		this.formNpo.step1.initializeModel({
// 			referentFullName: this.resolve.modalData.edit.info.refname,
// 			referentPhoneNumber: this.resolve.modalData.edit.info.reftel,
// 			referentEmail: this.resolve.modalData.edit.info.refmail
// 		});

// 		if (this.resolve.modalData.edit.medias.length > 0) {
// 			const inputStatute = this.formNpo.step2.getField('statuteMedia');
// 			const inputMemorandum = this.formNpo.step2.getField('memorandumMedia');
// 			const inputActofboard = this.formNpo.step2.getField('actOfBoardMedia');

// 			const statute = getValueFormArrayByKeyName(this.resolve.modalData.edit.medias, 'name', 'statute');
// 			const memorandum = getValueFormArrayByKeyName(this.resolve.modalData.edit.medias, 'name', 'memorandum');
// 			const actofboard = getValueFormArrayByKeyName(this.resolve.modalData.edit.medias, 'name', 'actofboard');

// 			const statuteUrl = getMediaUrl(statute.mid + '?token=' + getLocalStorage().getItem('token'));
// 			const memorandumUrl = getMediaUrl(memorandum.mid + '?token=' + getLocalStorage().getItem('token'));
// 			const actofboardUrl = getMediaUrl(actofboard.mid + '?token=' + getLocalStorage().getItem('token'));

// 			const promises = new Array(3);

// 			promises[0] = this.utilsService.getFileFromUrl({ url: statuteUrl, fileName: 'statute' });
// 			promises[1] = this.utilsService.getFileFromUrl({ url: memorandumUrl, fileName: 'memorandum' });
// 			promises[2] = this.utilsService.getFileFromUrl({ url: actofboardUrl, fileName: 'actofboard' });

// 			this.$q.all(promises)
// 				.then(medias => {
// 					inputStatute.templateOptions.filesEdit = [medias[0]];
// 					inputMemorandum.templateOptions.filesEdit = [medias[1]];
// 					inputActofboard.templateOptions.filesEdit = [medias[2]];

// 					//if medias are setted, they must are 3 (statute, memorandum, actofboard) 
// 					this.formNpo.step2.form.registerListener(form => form.$setDirty());
// 				})
// 				.catch(res => {
// 					this.responseMessage = buildErrorResponseMessage(res.data);
// 				});
// 		}

// 		this.formNpo.step1.form.registerListener(form => form.$setDirty());
// 	}

// 	$onChanges(changes) {
// 		if(changes.resolve && changes.resolve.currentValue)
// 			this.updateBindingResolve();
// 	}

// 	$onInit () {
// 		this.dashboardService.get()
// 			.then((user: UserPrivate) => {
// 				this.user = user;

// 				/* FORMS */

// 				let fieldGroup = null;
// 				let field = null;

// 				//STEP 1

// 				this.formNpo.step1.setTitles({
// 					main: this.translate.instant('Referent'),
// 					heading: this.translate.instant('Insert Referent Information (' + this.user.fullname + ')')
// 				});

// 				fieldGroup = new FieldGroup();

// 				//referentFullName
// 				field = new Field('input', 'referentFullName', {
// 					type: 'text',
// 					label: this.user.fullname + ' ' + this.translate.instant('referent\'s full name'),
// 					required: true
// 				});
// 				field.setValidators({
// 					fullName: {
// 						expression: (v, m, s) => AppSettings.form.regex.fullName.test(m)
// 					}
// 				});
// 				fieldGroup.addFieldObject(field);

// 				//referentEmail
// 				field = new Field('email', 'referentEmail', {
// 					label: this.user.fullname + ' ' + this.translate.instant(' referent\'s email'),
// 					required: true
// 				});
// 				field.setClassName('col-lg-6 col-md-6 col-xs-6 col-xs-6');
// 				fieldGroup.addFieldObject(field);

// 				//referentPhoneNumber
// 				field = new Field('phoneNumber', 'referentPhoneNumber', {
// 					label: this.user.fullname + ' ' + this.translate.instant(' referent\'s phone number'),
// 					required: true,
// 					config: {
// 						country: this.user.country
// 					}
// 				});
// 				field.setClassName('col-lg-6 col-md-6 col-xs-6 col-xs-6');
// 				fieldGroup.addFieldObject(field);

// 				this.formNpo.step1.addFieldGroup(fieldGroup);

// 				this.formNpo.step1.setSubmitHandler(model => {
// 					this.responseMessage = null;

// 					const json = {
// 						'refname': model.referentFullName,
// 						'reftel': model.referentPhoneNumber,
// 						'refmail': model.referentEmail
// 					};

// 					this.dashboardService.doVerificationStep('npo', 0, json)
// 						.subscribe(_ => {
// 							this.dashboardService.emitNotificationUpdate('verify');

// 							this.WizardHandler.wizard('wizardNpo').next();
// }, res => {
// 	this.responseMessage = buildErrorResponseMessage(res.error);
// 						});
// 				});

// 				//STEP 2

// 				this.formNpo.step2.setTitles({
// 					main: this.translate.instant('Upload'),
// 					heading: this.translate.instant('Upload Documents')
// 				});

// 				fieldGroup = new FieldGroup();

// 				//statuteMedia
// 				field = new Field('dropzone', 'statuteMedia', {
// 					label: this.translate.instant('Statute'),
// 					required: true,
// 					tooltip: {
// 						content:
// 							this.translate.instant('Your Statute.') + '<br>' +
// 							this.translate.instant('We will verify that your NPO is a non profit and the principles are compatible with our TOS')
// 					},
// 					config: {
// 						exts: AppSettings.form.exts,
// 						maxSize: AppSettings.form.fileSize.document.max,
// 						maxFiles: 1,
// 						minFiles: 1,
// 						description: this.translate.instant('Insert your Statute Document')
// 					}
// 				});
// 				field.setClassName('col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center');
// 				fieldGroup.addFieldObject(field);

// 				//memorandumMedia
// 				field = new Field('dropzone', 'memorandumMedia', {
// 					label: this.translate.instant('Memorandum'),
// 					required: true,
// 					tooltip: {
// 						content: this.translate.instant('Memorandum of the last assembly that voted for the governing bodies.') + '<br>' +
// 							this.translate.instant('It must have the date and signatures of the person in charge, to confirm the authenticity')
// 					},
// 					config: {
// 						exts: AppSettings.form.exts,
// 						maxSize: AppSettings.form.fileSize.document.max,
// 						maxFiles: 1,
// 						minFiles: 1,
// 						description: this.translate.instant('Insert your Memorandum Document')
// 					}
// 				});
// 				field.setClassName('col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center');
// 				fieldGroup.addFieldObject(field);

// 				//actOfBoardMedia
// 				field = new Field('dropzone', 'actOfBoardMedia', {
// 					label: this.translate.instant('Act of Board'),
// 					required: true,
// 					tooltip: {
// 						content:
// 							this.translate.instant('Act of the Board/person in charge stating the list of people that manage the bitcoin wallets.') + '<br>' +
// 							this.translate.instant('They must be at least 3 different people; we suggest the treasurer, the president and an IT expert. The form is provided in the description above.')
// 					},
// 					config: {
// 						exts: AppSettings.form.exts,
// 						maxSize: AppSettings.form.fileSize.document.max,
// 						maxFiles: 1,
// 						minFiles: 1,
// 						description: this.translate.instant('Insert your Act of Board Document')
// 					}
// 				});
// 				field.setClassName('col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center');
// 				fieldGroup.addFieldObject(field);

// 				this.formNpo.step2.addFieldGroup(fieldGroup);

// 				this.formNpo.step2.setSubmitHandler(model => {
// 					this.responseMessage = null;

// 					const statute = model.statuteMedia[0].file;
// 					const memorandum = model.memorandumMedia[0].file;
// 					const actOfBoard = model.actOfBoardMedia[0].file;

// 					//send statute
// 					this.dashboardService.doVerificationMediaStep('npo', 1, statute, 'statute')
// 						.progress(() => {})
// 						.success(data => {
// 							this.dashboardService.emitNotificationUpdate('verify');

// 							//send memorandum
// 							this.dashboardService.doVerificationMediaStep('npo', 1, memorandum, 'memorandum')
// 								.progress(() => {})
// 								.success(data => {
// 									this.dashboardService.emitNotificationUpdate('verify');

// 									//send actofboard
// 									this.dashboardService.doVerificationMediaStep('npo', 1, actOfBoard, 'actofboard')
// 										.progress(() => {})
// 										.success(data => {
// 											this.dashboardService.emitNotificationUpdate('verify');

// 											//set summary, then go next step
// 											this.dashboardService.getVerify()
// 												.then(res => {
// 													const verification = getValueFormArrayByKeyName(res.verification, 'provider', 'npo');

// 													this.formNpo.step3.initializeModel({
// 														referentFullName: verification.info.refname,
// 														referentPhoneNumber: verification.info.reftel,
// 														referentEmail: verification.info.refmail,
// 														statuteMedia:getValueFormArrayByKeyName(verification.medias, 'name', 'statute'),
// 														memorandumMedia:getValueFormArrayByKeyName(verification.medias, 'name', 'memorandum'),
// 														actOfBoardMedia:getValueFormArrayByKeyName(verification.medias, 'name', 'actofboard'),
// 													});

// 													this.WizardHandler.wizard('wizardNpo').next();
// 												})
// 												.catch(res => {
// 													this.responseMessage = buildErrorResponseMessage(res.data);
// 												});
// 										})
// 										.error(res => {
// 											this.responseMessage = buildErrorResponseMessage(res);
// 										});
// 								})
// 								.error(res => {
// 									this.responseMessage = buildErrorResponseMessage(res);
// 								});
// 						})
// 						.error(res => {
// 							this.responseMessage = buildErrorResponseMessage(res);
// 						});
// 				});

// 				this.formNpo.step2.initializeModel({
// 					actOfBoardMedia: [],
// 					memorandumMedia: [],
// 					statuteMedia: []
// 				});

// 				//STEP 3

// 				this.formNpo.step3.setTitles({
// 					main: this.translate.instant('Summary'),
// 					heading: this.translate.instant('Do you confirm your submission?')
// 				});

// 				this.formNpo.step3.setSubmitHandler(model => {
// 					this.responseMessage = null;

// 					this.dashboardService.doVerificationStep('npo', 2, {})
// 						.subscribe(_ => {
// 							this.dashboardService.emitNotificationUpdate('verify');
// // 							this.WizardHandler.wizard('wizardNpo').next();
// 			}, res => {
// 				this.responseMessage = buildErrorResponseMessage(res.error);
// 						});
// 				});

// 				this.updateBindingResolve();
// 			});
// 	}

// 	static get $inject () { return ['dashboardService', 'translateService', 'WizardHandler', 'utilsService', '$q']; }
// }

// const MeVerifyProviderNpoComponent = {
// 	templateUrl: 'components/dashboard/verify/providers/npo/npo.html',
// 	controller: NpoController,
// 	bindings: {
// 		resolve: '<',
// 		close: '&',
// 		dismiss: '&'
// 	}
// };

// export MeVerifyProviderNpoComponent;