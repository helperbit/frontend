import { ModalMeVerifyProviderCompanyComponent, ModalMeVerifyProviderCompanyConfig } from './providers/company/company';
import { ModalMeVerifyProviderDocumentComponent, ModalMeVerifyProviderDocumentConfig } from './providers/document/document';
import { verifyProvider } from './verify';
import {ModalMeVerifyProviderGpsComponent} from './providers/gps/gps';
import {ModalMeVerifyProviderNpoMemorandumComponent} from './providers/npo/memorandum/memorandum';
import {ModalMeVerifyProviderNpoStatuteComponent} from './providers/npo/statute/statute';
import {ModalMeVerifyProviderResidencyComponent} from './providers/residency/residency';
import {ModalMeVerifyProviderOtcComponent, ModalMeVerifyProviderOtcConfig } from './providers/otc/otc';
import {ModalMeVerifyProviderNpoAdminsComponent, ModalMeVerifyProviderNpoAdminsConfig } from './providers/npo/admins/admins';

export type ModalVerifyProviderConfig =
	ModalMeVerifyProviderCompanyConfig |
	ModalMeVerifyProviderDocumentConfig |
	ModalMeVerifyProviderOtcConfig |
	ModalMeVerifyProviderNpoAdminsConfig;

export function openProviderModal<ModalVerifyProviderConfig>(modalService: any, provider: verifyProvider, config?: ModalVerifyProviderConfig) {
	let component = null;

	switch(provider) {
		case 'document': {
			component = ModalMeVerifyProviderDocumentComponent;
			break;
		}
		case 'company': {
			component = ModalMeVerifyProviderCompanyComponent;
			break;
		}
		case 'gps': {
			component = ModalMeVerifyProviderGpsComponent;
			break;
		}
		case 'residency': {
			component = ModalMeVerifyProviderResidencyComponent;
			break;
		}
		case 'otc': {
			component = ModalMeVerifyProviderOtcComponent;
			break;
		}
		case 'npomemorandum': {
			component = ModalMeVerifyProviderNpoMemorandumComponent;
			break;
		}
		case 'npostatute': {
			component = ModalMeVerifyProviderNpoStatuteComponent;
			break;
		}
		case 'npoadmins': {
			component = ModalMeVerifyProviderNpoAdminsComponent;
			break;
		}
	}

	if(!component)
		throw new Error('You must pass a valid verify provider to open a modal component!')
	
	const modalRef = modalService.open(component, {
		size: 'lg'
	});

	if (config)
		modalRef.componentInstance.config = config;

	return modalRef;
}