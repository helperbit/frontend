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

import { incrementEffect } from '../../../../shared/helpers/utils';
import { Component, Input, OnChanges } from '@angular/core';

export interface Goal {
	iconId: string;
	value: number;
	position: 'top' | 'bottom';
	available: boolean;
	availableTotal: number;
	unlock: boolean;
	name: string;
	percentage: number;
	tooltip: {
		text: string;
	};
	description: {
		text: string;
		tooltip: {
			text: string;
		};
	};
	href: string;
}


export interface GoalsBarConfig {
	value: number;
	percentage: number;
	cursorText: string;
	goals: Goal[];
}

@Component({
	selector: 'goals-bar',
	templateUrl: 'goals-bar.html',
	styleUrls: ['goals-bar.scss']
})
export class GoalsBarComponent implements OnChanges {
	@Input() config: GoalsBarConfig;

	isTop: boolean;
	isBottom: boolean;
	percentageIncrement: number;

	constructor() {
		this.isTop = false;
		this.isBottom = false;
	}

	styleGoal(i: number) {
		return { left: this.config.goals[i].percentage + '%' }
	}

	goalClick(goal: Goal) {
		if (goal.unlock && goal.href)
			window.open(goal.href, '_blank');
	}

	ngOnChanges(changes) {
		if (!changes.config || !changes.config.currentValue)
			return;

		this.percentageIncrement = 0;
		this.isTop = this.config.goals.filter(g => g.position == 'top').length > 0;
		this.isBottom = this.config.goals.filter(g => g.position == 'bottom').length > 0;
		incrementEffect(this.config.percentage, 2100, true, (val: number) => { this.percentageIncrement = val; });
	}
}