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

import * as $ from 'jquery';
import {Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getLocalStorage } from 'app/shared/helpers/utils';

/* Error controller */
@Component({
	selector: 'error-component',
	templateUrl: 'error.html',
})
export class ErrorComponent implements OnInit {
	error: string;
	id: string;

	constructor(private route: ActivatedRoute) {
		this.error = 'E';
		this.id = '0';
	}

	goBack() {
		$('#errorModal').modal('hide');
		window.location.assign(getLocalStorage().getItem('lasturl') || '/');
	}

	ngOnInit() {
		if (this.route.snapshot.queryParamMap.has('error'))
			this.error = this.route.snapshot.queryParamMap.get('error');
		if (this.route.snapshot.queryParamMap.has('id'))
			this.id = this.route.snapshot.queryParamMap.get('id');

		$('#errorModal').modal({ keyboard: false });
	}
}
