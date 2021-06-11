import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'about-component',
	templateUrl: 'about.html',
	styleUrls: ['about.scss']
})
export class AboutComponent implements OnInit {
	public isHiddenMenuOpen = false;

	constructor(private route: ActivatedRoute) { }

	scrollTo(el: HTMLElement) {
		el.scrollIntoView({ behavior: "smooth" });
	}

	ngOnInit() {
		if (this.route.snapshot.fragment)
			this.scrollTo(document.getElementById(this.route.snapshot.fragment));
	}
}