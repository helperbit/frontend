import { Component } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
	selector: 'loading-bar',
	template: `<ngx-loading-bar *ngIf="show"></ngx-loading-bar>`,
	// styleUrls: [ 'loading-bar.scss' ]
})
export class LoadingBarComponent {
	show: boolean;
	
	constructor(private loadingBar: LoadingBarService) {
		this.loadingBar.progress$.subscribe(v => {
			this.show = v > 0 ? true : false;
		})
	}
}