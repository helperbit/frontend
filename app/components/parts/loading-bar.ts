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