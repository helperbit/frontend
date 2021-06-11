import * as $ from 'jquery';
import { ArticleService } from '../../../services/article';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService, BlogPost } from '../../../services/utils';
import { HTMLToPlaintext, timeDiff, getLocalStorage } from '../../../shared/helpers/utils';
import { DonationListConfig } from '../../../shared/components/donation-list/donation-list';
import { TranslateService } from '@ngx-translate/core';
import { StatsService } from '../../../models/stats';
import { EventService, Event } from '../../../models/event';
import { ProjectService, ProjectsHome } from '../../../models/project';
import AppSettings from '../../../app.settings';
import { ModalsConfig } from 'app/shared/components/modal/oldModal/modal';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { openProposeNPOModal } from 'app/shared/components/proposednpo-insert/proposednpo-insert';

/* Home controller */
@Component({
	selector: 'home-component',
	templateUrl: 'home.html',
	styleUrls: ['home.scss', 'news/news.scss']
})
export class HomeComponent implements OnInit {
	modals: ModalsConfig;
	feeds: BlogPost[];
	logged: boolean;
	firsttime: boolean;
	listConfig: DonationListConfig;
	events: Event[];
	projects: ProjectsHome;
	lastBadges: any[];

	constructor(
		private eventService: EventService,
		private statsService: StatsService,
		private modalService: NgbModal,
		private utilsService: UtilsService,
		private projectService: ProjectService,
		private articleService: ArticleService,
		private router: Router,
		private translate: TranslateService
	) {
		this.modals = {
			singleUserProject: {
				id: 'modalSingleuserProject',
				title: translate.instant('Info')
			}
		};

		this.feeds = [];
		this.logged = false;
		this.firsttime = false;
		this.listConfig = {
			columnsType: 'donorSmall',
			hideHeader: true,
			limit: 9,
			refresh: 30
		};
	}

	createProject() {
		const usertype = getLocalStorage().getItem('usertype');
		// check if user is logged as single user
		if (usertype !== 'singleuser') {
			this.router.navigateByUrl("/me/project");
		} else {
			$('#modalSingleuserProject').modal('show');
		}
	}

	proposeNPO() {
		openProposeNPOModal(this.modalService, {
			message: this.translate.instant('You can suggest an organization and we will contact them.')
		});
	}


	ngOnInit() {
		if (getLocalStorage().getItem('token'))
			this.logged = true;

		this.utilsService.getBlogPosts().subscribe(posts => {
			this.feeds = posts
				.splice(0, 2)
				.map(f => {
					f.summary = HTMLToPlaintext(f.summary);
					return f;
				});
		});


		this.eventService.getHomeList().subscribe(data => {
			data.closetome.map((i) => { i.t = 'close'; return i; });
			data.main.map((i) => { i.t = 'main'; return i; });
			this.events = data.main.splice(0, 4); //res.data.closetome.splice (0, 2).concat (res.data.main.splice(0, 4));
			const acodes = [];
			for (let i = 0; i < this.events.length; i++) {
				const item = this.events[i];

				const res = this.articleService.generateEventArticle(item);
				acodes.push(res.template);
				item.article = res;
			}
		});

		this.projectService.getHomeList().subscribe((data) => {
			this.projects = data;
		});

		this.statsService.getLastBadges(10).subscribe((lastbadges) => {
			const badges = [];

			lastbadges.forEach(badge => {
				const badgesData = this.utilsService.badges();
				const badgeConfig = badgesData[badge.code];

				badges.push({
					type: 'image',
					src: badgeConfig.images.small,
					link: ((badge.code.indexOf('ambassador') != -1) ? AppSettings.baseUrl + '/i/ambassador' : AppSettings.baseUrl + '/i/badges'),
					text: {
						// top: badgeConfig.name,
						bottom: '- ' + timeDiff(badge.time),
						link: badge.user
					},
					url: 'user/' + badge.user
				});
			});

			this.lastBadges = badges;
		});


		/* Presentation modal */
		/*var expireDate = new Date();
		expireDate.setFullYear(2020);
		if (!this.logged && !getLocalStorage().getItem('firsttimeb')) {
			getLocalStorage().setItem('firsttimeb', true, { expires: expireDate }, '/');
			this.firsttime = true;
		} else {
			getLocalStorage().setItem('firsttimeb', true, { expires: expireDate }, '/');
		}
		this.firsttime = true;*/
	}
}