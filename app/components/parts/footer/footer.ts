import { TranslateService } from '@ngx-translate/core';
import { openFeedbackModal } from "../widgets/feedback/feedback";
import { StatsService } from "../../../models/stats";
import { CurrencyService } from "../../../services/currency";
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* Footer common controller */
@Component({
	selector: 'footer-component',
	templateUrl: 'footer.html',
	styleUrls: ['footer.scss']
})
export class FooterComponent implements OnInit {
	twitter: number;
	facebook: number;
	currentRouteName: string;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private statsService: StatsService,
		private translate: TranslateService,
		public currencyService: CurrencyService,
		private modalService: NgbModal
	) {
		this.twitter = 0;
		this.facebook = 0;
	}

	ngOnInit() {
		this.currentRouteName = 'Helperbit';
		this.statsService.getSocial().subscribe((data) => {
			this.twitter = data.twitter;
			this.facebook = data.facebook;
		});

		this.router.events.subscribe(e => {
			if (! (e instanceof NavigationEnd)) 
				return;

			let child = this.route.firstChild;
			while (child) {
				if (child.firstChild) {
					child = child.firstChild;
				} else if (child.snapshot.data && 'meta' in child.snapshot.data && 'footerName' in child.snapshot.data.meta) {
					this.currentRouteName = this.translate.instant(child.snapshot.data.meta.footerName);
					return;
				} else {
					return;
				}
			}
		});
	}

	openFeedbackModal() {
		openFeedbackModal(this.modalService);
	}
}