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