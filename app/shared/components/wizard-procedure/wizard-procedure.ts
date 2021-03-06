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

import { OnInit, Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DashboardService, UserPrivate } from 'app/models/dashboard';
import { WalletService } from 'app/models/wallet';
import { WizardProcedure, Step } from './procedures/procedure';
import { NPOProcedure } from './procedures/npo';


const procedures = {
	'npo': NPOProcedure
};

@Component({
	selector: 'wizard-procedure',
	templateUrl: 'wizard-procedure.html',
	styleUrls: ['../../../sass/main/custom/check-list.scss', 'wizard-procedure.scss']
})
export class WizardProcedureComponent implements OnInit, OnDestroy {
	user: UserPrivate;
	procedure: WizardProcedure;
	steps: Step[];

	show: boolean;
	initialization: boolean;
	isDescriptionsShow: boolean;
	updateInterval: any;

	constructor(
		private walletService: WalletService,
		private dashboardService: DashboardService,
		private translate: TranslateService
	) {
		this.initialization = true;
		this.steps = [];
		this.isDescriptionsShow = true;
		this.show = false;
	}

	public getTooltipOfTask(task) {
		// TODO: Non si aggiorna con lo status perche' non viene richiamata
		if (task.status == 'inprogress') 
			return task.help;
		else if (task.status == 'completed')
			return this.translate.instant('Completed!');
		else
			return '';
	}


	public showDescription() {
		this.isDescriptionsShow = !this.isDescriptionsShow;
	}
	
	update() {
		this.dashboardService.get(true).subscribe(user => {
			this.user = user;

			if (this.initialization) {
				this.initialization = false;

				if (this.user.usertype in procedures) {
					this.procedure = new procedures[this.user.usertype](this.walletService, this.dashboardService, this.translate);
					this.show = true;
					this.procedure.onUpdate.subscribe((completed: boolean) => {
						this.steps = this.procedure.getSteps();
						if (completed) {
							this.show = false;
							this.procedure = null;
						}
					});
				}
			}
			if (!this.procedure) {
				this.show = false;
				return;
			}

			this.procedure.update(this.user);
		});
	}

	ngOnDestroy() {
		clearInterval(this.updateInterval);
	}

	ngOnInit() {
		this.updateInterval = setInterval(() => {
			this.update();
		}, 60000);

		this.dashboardService.onProfileUpdate.subscribe(() => {
			if(!this.procedure) 
				return;
			this.update();
		});
		this.update();
	}
}