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

import AppSettings from 'app/app.settings';
import { UserPrivate } from 'app/models/dashboard';
import { EventEmitter } from '@angular/core';


export interface Task {
	title: string;
	href?: string;
	help: string;
	status: 'not-available' | 'inprogress' | 'completed';
}

export interface Step {
	id: string;
	title: string;
	description: string;
	iconId: string;
	src: string;
	status: 'not-available' | 'inprogress' | 'completed';
	tasks: Task[];
}

export abstract class WizardProcedure {
	protected icons: { [key: string]: { iconId: string; src: string } } = {
		'profile': {
			iconId: 'profile',
			src: AppSettings.baseUrl + '/media/wizard-verification-procedure/svg/profile.svg'
		},
		'verify': {
			iconId: 'verify',
			src: AppSettings.baseUrl + '/media/wizard-verification-procedure/svg/verify.svg'
		},
		'admins': {
			iconId: 'admins',
			src: AppSettings.baseUrl + '/media/wizard-verification-procedure/svg/admins.svg'
		},
		'wallet': {
			iconId: 'wallet',
			src: AppSettings.baseUrl + '/media/wizard-verification-procedure/svg/wallet.svg'
		},
		'project': {
			iconId: 'project',
			src: AppSettings.baseUrl + '/media/wizard-verification-procedure/svg/project.svg'
		}
	};

	abstract getSteps(): Step[];
	abstract update(user: UserPrivate);

	public onUpdate: EventEmitter<boolean> = new EventEmitter();
}