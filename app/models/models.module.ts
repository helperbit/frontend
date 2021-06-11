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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationService } from './notifications';
// import { LightningService } from './lightning';
// import CharityPotService from './charity-pot';
import { ProjectService } from './project';
import { ProposedNpoService } from './proposednpo';
// import { AlertService } from './alert';
import { StatsService } from './stats';
import { AuthService } from './auth';
import { UserService } from './user';
import { DashboardService } from './dashboard';
import { DonationService } from './donation';
import { EventService } from './event';
import { RorService } from './ror';
import { WalletService } from './wallet';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		NotificationService,
		// LightningService,
		// CharityPotService,
		ProjectService,
		ProposedNpoService,
		// AlertService,
		StatsService,
		AuthService,
		UserService,
		DashboardService,
		DonationService,
		EventService,
		RorService,
		WalletService
	],
	exports: [
	],
	declarations: [
	]
})
export class ModelsModule {
	constructor() { }
} 