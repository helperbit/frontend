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

import { TranslateService } from '@ngx-translate/core';
import { WizardComponent } from 'angular-archwizard';
import { FormGroupEx } from "../ngx-formly/form-group-ex";

/* Un wizard step che ingloba un form */
export class NgWizardStep<T> extends FormGroupEx<T> {
	protected wizardHandler: WizardComponent;
	_nextIntercept: (() => void);
	titles: {
		main: string;
		heading: string;
		description: string;
		link?: string;
	};
	// forms: { [key: string]: FormlyForm<T> };

	constructor(wizardHandler: WizardComponent = null) {
		super()

		this.wizardHandler = wizardHandler;
		
		this.titles = {
			main: '',
			heading: '',
			description: '',
			link: ''
		};
	}

	public setHandler(wizardHandler: WizardComponent) {
		this.wizardHandler = wizardHandler;
	}

	public setTitles(titles: { main?: string; heading?: string; description?: string; link?: string }): void {
		if (titles.main)
			this.titles.main = titles.main;
		if (titles.heading)
			this.titles.heading = titles.heading;
		if (titles.description)
			this.titles.description = titles.description;
		if (titles.link)
			this.titles.link = titles.link;
	}

	public setNextInterceptor(interceptor: () => void): void {
		this._nextIntercept = interceptor;
	}

	public goToStep(stepId: number): void {
		this.wizardHandler.goToStep(stepId);
	}

	public next(): void {
		if (this._nextIntercept)
			this._nextIntercept();
		else
			this._next();
	}

	public _next(): void {
		this.wizardHandler.goToNextStep();
	}

	public reset(): void {
		this.wizardHandler.reset();
	}

	public previous(): void {
		this.wizardHandler.goToPreviousStep();
	}

	static createFinishStep(translate: TranslateService): NgWizardStep<void> {
		const ws = new NgWizardStep<void>();
		ws.setTitles({
			main: translate.instant('Finish')
		});
		return ws;
	}
}