import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { getLocalStorage } from 'app/shared/helpers/utils';

@Component({
	selector: 'me-component',
	template: ''
})
export class MeComponent implements OnInit {
	constructor(private router: Router) { }

	ngOnInit() {
		this.router.navigateByUrl('/user/' + getLocalStorage().getItem('username'));
	}
}
