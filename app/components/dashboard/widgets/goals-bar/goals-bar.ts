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