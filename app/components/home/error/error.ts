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
