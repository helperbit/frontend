import { buildErrorResponseMessage, ResponseMessageConfig } from '../../../shared/components/response-messages/response-messages';
import { TranslateService } from '@ngx-translate/core';
import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { ModalsConfig } from '../../../shared/components/modal/oldModal/modal';
import { RoundImageProgressConfig } from '../../../shared/components/round-image-progress/round-image-progress';
import { DashboardService, UserVerify, UserPrivate } from '../../../models/dashboard';
import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'app/services/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { openProviderModal } from './verify.utils';
import { openModal } from 'app/shared/components/modal/modal';

// type ProviderElement = {
// 	panel: {
// 		href: string;
// 		title: string;
// 	};
// 	collapse: {
// 		id: string;
// 		description: string;
// 		modalId: string;
// 	};
// 	available: boolean;
// 	verification: any;
// 	statusConfig: any;
// };

export type verifyProvider = 'document' | 'residency' | 'gps' | 'npo' | 'npostatute' | 'npomemorandum' | 'npoadmins' | 'company' | 'otc' | 'manual';

export interface ErrorInformation {
	href: string;
	text: string;
}

/* User profile /me/verify */
@Component({
	selector: 'me-verify-component',
	templateUrl: 'verify.html',
	styleUrls: ['../../../sass/main/custom/page.scss', 'verify.scss']
})
export class MeVerifyComponent implements OnInit {
	responseMessage: ResponseMessageConfig;
	pageHeader: PageHeaderConfig;
	modals: ModalsConfig;
	userImageConfig: RoundImageProgressConfig;
	user: UserPrivate;
	verify: UserVerify;
	availableProviders: string[];

	providers: {
		[key in verifyProvider]?: {
			panel: {
				href: string;
				title: string;
			};
			collapse: {
				id: string;
				description: string;
			};
			available: boolean;
			verification: any;
			statusConfig: any;
		}
	};

	profileErrors: ErrorInformation[];
	geolocalizationErrors: ErrorInformation[];
	errorsProfile: { [key: string]: (usertype?: string) => ErrorInformation }; // Queste due variabili mi sembrano una specie di ripetizione delle precedenti
	errorsGelocalization: { [key: string]: () => ErrorInformation };


	constructor(
		private dashboardService: DashboardService, 
		private translate: TranslateService, 
		private utilsService: UtilsService,
		private modalService: NgbModal
	) {
		this.profileErrors = [];
		this.geolocalizationErrors = [];
		this.providers = {};
		this.user = null;
		this.verify = null;
		this.availableProviders = [];
		this.errorsProfile = {};
		this.errorsGelocalization = {};

		this.responseMessage = null;
		this.pageHeader = {
			description: {
				title: translate.instant('verify'),
				subTitle: translate.instant('Verify your account')
			}
		};

		this.modals = {
			confirm: {
				id: 'modalConfirm',
				modalClass: 'modal-md',
				hideCloseButton: true,
				title: null,
				description: null,
				confirm: {
					method: null,
					parameters: null,
					description: null
				}
			},
		};

		this.errorsProfile = {
			birthdate: usertype => {
				if (usertype == 'singleuser')
					return { href: '/me/edit?field=birthdate', text: this.translate.instant('Birth Date') };
				else
					return { href: '/me/edit?field=birthdate', text: this.translate.instant('Foundation Date') };
			},
			firstname: () => { return { href: '/me/edit?field=firstname', text: this.translate.instant('First Name') }; },
			lastname: () => { return { href: '/me/edit?field=lastname', text: this.translate.instant('Last Name') }; },
			gender: () => { return { href: '/me/edit?field=gender', text: this.translate.instant('Gender') }; },
			fullname: () => { return { href: '/me/edit?field=fullname', text: this.translate.instant('Full Name') }; },
			vat: () => { return { href: '/me/edit?field=vat', text: this.translate.instant('VAT') }; },
			operators: () => { return { href: '/me/edit?field=operators', text: this.translate.instant('Operators') }; },
			website: () => { return { href: '/me/edit?field=website', text: this.translate.instant('Website') }; },
			inhabita: () => { return { href: '/me/edit?field=inhabitants', text: this.translate.instant('Inhabitants') }; },
			mayor: () => { return { href: '/me/edit?field=mayor', text: this.translate.instant('Mayor full name') }; },
			mandatep: () => { return { href: '/me/edit?field=mandateperiod', text: this.translate.instant('Mandate period') }; },
			tags: () => { return { href: '/me/edit?field=tags', text: this.translate.instant('Tags') }; },
			'referent.firstname': () => { return { href: '/me/edit?field=referent.firstname', text: this.translate.instant(' Referent - First Name') }; },
			'referent.lastname': () => { return { href: '/me/edit?field=referent.lastname', text: this.translate.instant('Referent - Last Name') }; },
			'referent.idnumber': () => { return { href: '/me/edit?field=referent.idnumber', text: this.translate.instant('Referent - ID Number') }; },
			'referent.email': () => { return { href: '/me/edit?field=referent.email', text: this.translate.instant('Referent - Email') }; }
		};

		this.errorsGelocalization = {
			countries: () => { return { href: '/me/geoloc', text: this.translate.instant('Countries') }; },
			country: () => { return { href: '/me/geoloc', text: this.translate.instant('Country') }; },
			city: () => { return { href: '/me/geoloc', text: this.translate.instant('City') }; },
			zipcode: () => { return { href: '/me/geoloc', text: this.translate.instant('ZIP Code') }; },
			location: () => { return { href: '/me/geoloc', text: this.translate.instant('Geolocation') }; },
			street: () => { return { href: '/me/geoloc', text: this.translate.instant('Street') }; },
			streetnr: () => { return { href: '/me/geoloc', text: this.translate.instant('Street Number') }; },
			region: () => { return { href: '/me/geoloc', text: this.translate.instant('Region') }; }
		};
	}

	private getLabelClass(status: string): { class: { label: string; icon: string }; text: { label: string; description: string } } {
		// pending (in attesa)
		// accepted (accettato)
		// inprogress (in lavorazione)
		// rejected (rifiutata)
		// submission (draft) (bozza)
		switch (status) {
			case 'accepted':
				return {
					class: { label: 'state-success', icon: 'fa-check' },
					text: {
						label: this.translate.instant('accepted'),
						description: this.translate.instant('Your verification is completed!')
					}
				};
			case 'pending':
				return {
					class: { label: 'state-working', icon: 'fa-pause' },
					text: {
						label: this.translate.instant('pending'),
						description: this.translate.instant('Your verification is waiting to be processed')
					}
				};
			case 'rejected':
				return {
					class: { label: 'state-danger', icon: 'fa-times' },
					text: {
						label: this.translate.instant('rejected'),
						description: this.translate.instant('Your verification was rejected with this appointment: "__REPLACE__". Do you want to create new one?')
					}
				};
			case 'inprogress':
				return {
					class: { label: 'state-working', icon: 'fa-clock-o' },
					text: {
						label: this.translate.instant('in progress'),
						description: this.translate.instant('Your verification is processing')
					}
				};
			case 'submission':
				return {
					class: { label: 'state-working', icon: 'fa-pencil-square-o' },
					text: {
						label: this.translate.instant('draft'),
						description: this.translate.instant('Your verification is still a draft. You have to finish and send it to be verified!')
					}
				};
			default:
				return {
					class: { label: '', icon: '' },
					text: {
						label: this.translate.instant('n/a'),
						description: this.translate.instant('Not Applicable')
					}
				}
		}
	}

	//return a promise when complete the update of verifications and user information
	private updateVerify() {
		this.responseMessage = null;

		//get and update all verification
		this.dashboardService.getVerify().subscribe(data => {
			this.verify = data;
			//set availables

			this.availableProviders = [];

			//TODO perché in res.data.available ci sono anche quei provider che stanno in res.data.verification?
			// res.data.verification.forEach( o => {
			// 	let index = res.data.available.indexOf(o.provider);

			// 	if(index != -1)
			// 		delete res.data.available[index];
			// });
			
			data.available.forEach(p => {
				if (this.providers[p]) {
					this.providers[p].available = true;
					this.providers[p].verification = null;
					this.providers[p].statusConfig = this.getLabelClass(null);

					this.availableProviders.push(p);
				}
			});

			//save verification sent
			data.verification.forEach(o => {
				if (this.providers[o.provider]) {
					this.providers[o.provider].available = true;
					this.providers[o.provider].verification = o;
					this.providers[o.provider].statusConfig = this.getLabelClass(this.providers[o.provider].verification.state);
					if (o.state == 'rejected')
						this.providers[o.provider].statusConfig.text.description = this.providers[o.provider].statusConfig.text.description.replace('__REPLACE__', o.rejectreason);

					if(this.availableProviders.indexOf(o.provider) == -1)
						this.availableProviders.push(o.provider);
				}
			});
		}, d => {
			const res = d.error;

			if (res.error == 'EV1') {
				const arrProfile: ErrorInformation[] = [];
				const arrGeolocalization: ErrorInformation[] = [];
				res.data.fields.forEach(e => {
					if (this.errorsProfile[e])
						arrProfile.push(this.errorsProfile[e](this.user.usertype));
					if (this.errorsGelocalization[e])
						arrGeolocalization.push(this.errorsGelocalization[e]());
				});

				this.profileErrors = arrProfile;
				this.geolocalizationErrors = arrGeolocalization;
			}
			else {
				this.responseMessage = buildErrorResponseMessage(res.data);
			}
		});

		//get and update user settings
		this.dashboardService.get().subscribe(user => {
			this.user = user;

			let borderClass = '';
			if (this.user.trustlevel <= 20) borderClass = 'trust-level-red';
			else if (this.user.trustlevel > 20 && this.user.trustlevel <= 50) borderClass = 'trust-level-orange';
			else borderClass = 'trust-level-green';

			this.userImageConfig = {
				percentage: this.user.trustlevel,
				borderClass: borderClass,
				user: this.user
			};
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.error);
		});
	}

	removeVerification(provider) {
		this.responseMessage = null;

		return this.dashboardService.removeVerification(provider).subscribe(_ => {
			return this.updateVerify();
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.error);
		});
	}

	isProviderAvailable(key) {
		return this.availableProviders.indexOf(key) != -1;
	}

	//verification status
	//manage what todo  when click on providers button actions

	startVerification(provider: verifyProvider) {
		openProviderModal(this.modalService, provider).result.then(
			(v) => { this.updateVerify(); },
			() => { this.updateVerify(); });
	}

	editVerification(provider: verifyProvider) {
		openProviderModal(this.modalService, provider, this.providers[provider].verification).result.then(
			(v) => { this.updateVerify(); },
			() => { this.updateVerify(); });
	}

	openConfirmDeleteVerification(provider: verifyProvider) {
		openModal(this.modalService, {
			...this.modals.confirm,
			title: this.translate.instant('Confirm delete verification'),
			description: this.translate.instant('Are you sure to delete') + ' ' + this.utilsService.getSString(this.providers[provider].panel.title) + ' ' + this.translate.instant('verification?')
		}).result.then(
			(v) => { this.removeVerification(provider); this.updateVerify(); },
			() => { this.updateVerify(); });
	}

	createNewVerification(provider: verifyProvider) {
		this.responseMessage = null;

		return this.dashboardService.removeVerification(provider).subscribe(_ => {
			return this.startVerification(provider);
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.error);
		});
	}

	insertOtcVerification() {
		openProviderModal(this.modalService, 'otc', { ...this.modals.otc, insertOtc: true }).result.then(
			(v) => { this.updateVerify(); },
			() => { this.updateVerify(); });
	}

	ngOnInit() {
		// this.removeVerification('npoadmins');	
		this.dashboardService.get().subscribe(user => {
			this.user = user;

			//USER IMAGE CONFIG

			let borderClass = '';
			if (this.user.trustlevel <= 20) borderClass = 'trust-level-red';
			else if (this.user.trustlevel > 20 && this.user.trustlevel <= 50) borderClass = 'trust-level-orange';
			else borderClass = 'trust-level-green';

			this.userImageConfig = {
				percentage: this.user.trustlevel,
				borderClass: borderClass,
				user: this.user
			};

			//PROVIDERS CONFIG

			this.providers = {
				document: {
					panel: {
						href: '#document',
						title: this.user.usertype == 'singleuser' ? this.translate.instant('ID Document') : this.translate.instant('CEO ID Document')
					},
					collapse: {
						id: 'document',
						description: this.user.usertype == 'singleuser' ?
							this.translate.instant('You will have the possibility to upload your ID card, the Document should be valid and not expired [25 trust points].') :
							this.translate.instant('You will have the possibility to upload the CEO ID card, the Document should be valid and not expired [25 trust points].'),
					},
					available: false,
					verification: null,
					statusConfig: null
				},
				residency: {
					panel: {
						href: '#residency',
						title: this.translate.instant('Proof of Residency')
					},
					collapse: {
						id: 'residency',
						description: this.translate.instant('You will have to upload a proof of residency, an utility bill that have your name and your address on it, the document shouldn\'t be older than 6 months [15 trust point]'),
					},
					available: false,
					verification: null,
					statusConfig: null
				},
				gps: {
					panel: {
						href: '#gps',
						title: this.translate.instant('Device Geoverification')
					},
					collapse: {
						id: 'gps',
						description: this.translate.instant('This is the fastest method, you give to the platform the access to your GPS/Browser locator and Helperbit will verify the correspondence with your address. [5 trust point].'),
					},
					available: false,
					verification: null,
					statusConfig: null
				},
				npo: {
					panel: {
						href: '#npo',
						title: this.translate.instant('NPO')
					},
					collapse: {
						id: 'npo',
						description: this.translate.instant('The referent have to upload documents that proof the social aim of the organization, the date of fundation, the name of the people inside the organization that will be authorized at manage the bitcoin wallet and all documents needed at Helperbit to verify the level of trust of the organization.'),
					},
					available: false,
					verification: null,
					statusConfig: null
				},
				npostatute: {
					panel: {
						href: '#npoStatute',
						title: this.translate.instant('Non-profit Statute')
					},
					collapse: {
						id: 'npoStatute',
						description: this.translate.instant('You have to upload the founding document that shows the purposes and governing model of your organization. It allows Helperbit to verify that your nonprofit is apolitical, recognized by your home Country and that you are focused on social causes'),
					},
					available: false,
					verification: null,
					statusConfig: null
				},
				npomemorandum: {
					panel: {
						href: '#npoMemorandum',
						title: this.translate.instant('Non-profit Memorandum')
					},
					collapse: {
						id: 'npoMemorandum',
						description: this.translate.instant('You have to upload the minutes of the last election assembly of the governing body, in order to give to Helperbit the names of the last people in charge of key positions. The document should not be older than 12 months'),
					},
					available: false,
					verification: null,
					statusConfig: null
				},
				npoadmins: {
					panel: {
						href: '#npoAdmins',
						title: this.translate.instant('Non-profit Admins')
					},
					collapse: {
						id: 'npoAdmins',
						description: this.translate.instant('You will have to upload the Certification of a Manager who appoints the Administrators of the funds. Helperbit provides you the document with the information; you have to print it, ask the Manager to sign it and then upload the signed document'),
					},
					available: false,
					verification: null,
					statusConfig: null
				},
				company: {
					panel: {
						href: '#company',
						title: this.translate.instant('Company Documents')
					},
					collapse: {
						id: 'company',
						description: this.translate.instant('The referent have to upload documents that prove the existence of the company.'),
					},
					available: false,
					verification: null,
					statusConfig: null
				},
				otc: {
					panel: {
						href: '#otc',
						title: this.translate.instant('Geoverification')
					},
					collapse: {
						id: 'otc',
						description: (this.user.usertype == 'npo' ?
							this.translate.instant('It will request to you to confirm your headquarter organization address, Helperbit will send to that address a mail with a code, when you will receive your code you can redeem it online.')
							:
							this.translate.instant('This is the slowest verification method but also the one that offer the highest percentage of trust. It will request to you to confirm your address, Helperbit will send to that address a mail with a code, once you will receive your code you can redeem it online and get 15 points of trust.')),
					},
					available: false,
					verification: null,
					statusConfig: null
				},
				manual: {
					panel: {
						href: '#manual',
						title: this.translate.instant('Manual Verification by Helperbit')
					},
					collapse: {
						id: 'manual',
						description: null
					},
					available: false,
					verification: null,
					statusConfig: null
				}
			};

			this.updateVerify();
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.error);
		});
	}
}
