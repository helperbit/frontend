import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { QueryResult, UtilsService } from 'app/services/utils';


@Component({
	selector: '[search-bar]',
	templateUrl: 'search-bar.html',
	styleUrls: ['search-bar.scss']
})
export class SearchBarComponent implements OnInit {
	MIN_QUERY_SIZE = 2;
	searchQuery: string;
	searchResults: QueryResult[];

	constructor(
		private router: Router,
		private utilsService: UtilsService
	) {
		this.searchReset();
	}

	search(query) {
		this.searchQuery = query;

		if (query.length < this.MIN_QUERY_SIZE)
			return;

		this.utilsService.search(query).subscribe(data => {
			this.searchResults = data;
		});
	}

	searchReset(timeout?) {
		if (timeout)
			return setTimeout(() => this.searchReset(), 200);

		this.searchQuery = '';
		this.searchResults = [];
	}

	ngOnInit() {
		this.router.events.subscribe(e => {
			if (!(e instanceof NavigationStart))
				return;

			this.searchReset();
		});
	}
}

