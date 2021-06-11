import { TranslateService } from '@ngx-translate/core';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export abstract class OnTranslateLoad implements OnDestroy {
	sub: Subscription;

	constructor(protected translate: TranslateService, force: boolean = false) {
		this.sub = translate.onLangChange.subscribe(() => {
			this.ngOnTranslateLoad(translate);
		});

		// translate.onTranslationChange.subscribe(() => {
		// 	this.ngOnTranslateLoad(translate);
		// });

		if (force) {
			setTimeout(() => {
				this.ngOnTranslateLoad(translate);
			}, 0);
		}
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	public abstract ngOnTranslateLoad(translate): void;
}