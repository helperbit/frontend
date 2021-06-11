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

import { Component, Input, EventEmitter, OnChanges, Output } from '@angular/core';

export interface LedgerWaitStatus {
	phase: number;
	status: string;
}

@Component({
	selector: 'ledger-wait',
	templateUrl: 'ledger-wait.html',
	styleUrls: ['ledger-wait.scss']
})
export class LedgerWaitComponent implements OnChanges {
	@Output() exec: EventEmitter<void> = new EventEmitter();
	@Input() button: boolean;
	@Input() config: LedgerWaitStatus; // input

	started: boolean;
	phases: string[];
	retryShow: boolean;

	constructor() {
		this.started = false;
		this.phases = ['wait', 'none', 'none'];
		this.retryShow = false;
	}

	retry() {
		this.started = true;
		this.retryShow = false;
		this.phases = ['wait', 'none', 'none'];
		this.exec.emit();
	}

	ngOnChanges(changes) {
		if (!changes.config || !changes.config.currentValue)
			return;

		for (let i = 0; i < this.config.phase; i++)
			this.phases[i] = 'success';

		this.phases[this.config.phase] = this.config.status;
		if (this.config.status == 'error')
			this.retryShow = true;
		else
			this.retryShow = false;

		for (let i = this.config.phase + 1; i < this.phases.length; i++)
			this.phases[i] = 'none';
	}
}
