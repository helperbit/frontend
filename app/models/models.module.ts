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