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