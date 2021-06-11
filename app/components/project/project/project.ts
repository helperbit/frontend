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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { SocialShareConfig, SocialShareStyle } from '../../../shared/components/social-share/social-share';
import { DonationListConfig } from '../../../shared/components/donation-list/donation-list';
import { SlidershowConfig } from '../../../shared/components/slidershow/slidershow';
import { TranslateService } from '@ngx-translate/core';
import { ProgressBarConfig } from '../../../shared/components/progress-bar/progress-bar';
import { UtilsService } from '../../../services/utils';
import { ProjectService, Project } from '../../../models/project';
import { Donation } from '../../../models/donation';
import { CurrencyService } from '../../../services/currency';
import { EventService, Event } from '../../../models/event';
import AppSettings from '../../../app.settings';
import { MoneyPipe } from '../../../shared/filters/money';
import { DatePipe } from '@angular/common';
import { MoneyToBTCPipe } from '../../../shared/filters/money-to-btc';
import { EmbedVideoService } from 'ngx-embed-video';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ArticleService } from 'app/services/article';
import { OnTranslateLoad } from 'app/shared/helpers/on-translate-load';

@Component({
	selector: 'project-component',
	styleUrls: [
		'../../../sass/main/custom/page.scss',
		'project.scss'
	],
	templateUrl: 'project.html',
})
export class ProjectComponent extends OnTranslateLoad implements OnInit, OnDestroy {
	pageHeader: PageHeaderConfig;
	socialShare: { config: SocialShareConfig; style: SocialShareStyle };
	listConfig: DonationListConfig;
	projectImagesConfig: SlidershowConfig;
	id: string;
	project: Project;
	otherProjects: Project[];
	projectImages: { mediaId: string }[];
	progressBarConfig: ProgressBarConfig;
	event: Event;
	donations: Donation[];
	iframeVideo: string;
	currentImageIndex: number;
	imageUpdaterInterval: any;

	constructor(
		private currencyService: CurrencyService,
		private route: ActivatedRoute,
		private utilsService: UtilsService,
		private projectService: ProjectService,
		private eventService: EventService,
		private moneyPipe: MoneyPipe,
		private datePipe: DatePipe,
		private moneyToBTCPipe: MoneyToBTCPipe,
		private embedVideoService: EmbedVideoService,
		private articleService: ArticleService,
		private router: Router,
		translate: TranslateService
	) {
		super(translate);
		this.otherProjects = [];
	}

	tabSelected($event) {
		if ($event.nextId == 'graph-tab') {
			$event.preventDefault();
			this.router.navigateByUrl('/donation/graph/project/' + this.project._id);
		}
	}

	updateImageIndex() {
		if (this.project.media.length < 0)
			return;

		this.currentImageIndex = Math.floor(this.project.media.length * Math.random());
	}

	donate() {
		(window as any).HBDonateButton.init('project', this.id, '', 'flypme,mistralpay', null, true);
		(window as any).HBDonateButton.activate();
	}

	ngOnDestroy() {
		if (this.imageUpdaterInterval)
			clearInterval(this.imageUpdaterInterval);
	}

	updateTranslations() {
		this.socialShare = {
			config: {
				title: this.translate.instant('I supported the project') + ' \"__TITLE__\" ' + this.translate.instant('on Helperbit.com'),
				hashtags: [this.translate.instant('helperbit'), this.translate.instant('project'), this.translate.instant('donate')],
				url: AppSettings.urls.public.project + this.project._id
			},
			style: {
				type: 'block',
				colored: true
			}
		};

		this.pageHeader = {
			info: {
				boxes: []
			}
		};

		this.socialShare.config = {
			...this.socialShare.config, ...{
				title: this.socialShare.config.title.replace('__TITLE__', this.utilsService.getSString(this.project.title))
			}
		};
		
		/* Set page header */
		this.pageHeader.info.boxes.push({
			// PROJECTRECEIVED: Il primo mostra il quantitativo in bitcoin ricevuto, il secondo il totale usato + non usato
			title: this.moneyPipe.transform(this.project.received, 'short', true),
			// title: this.moneyPipe.transform(this.progressBarConfig.current, 'short', true),
			subTitle: this.translate.instant('received')
		});

		this.pageHeader.info.boxes.push({
			title: String(this.project.receiveddonations),
			subTitle: this.translate.instant('supporters')
		});

		this.pageHeader.info.boxes.push({
			title: this.moneyPipe.transform(this.moneyToBTCPipe.transform(this.project.target, this.project.currency), 'short', true),
			subTitle: this.translate.instant('target')
		});

		this.pageHeader.info.boxes.push({
			title: this.datePipe.transform(this.project.start, 'mediumDate'),
			subTitle: this.translate.instant('start date')
		});

		this.utilsService.setMeta(
			this.translate.instant('Project') + ': ' + this.utilsService.getSString(this.project.title),
			this.utilsService.getSString(this.project.description),
			!this.project.media || this.project.media.length == 0 ?
				'https://api.helperbit.com/api/v1/user/' + this.project.owner + '/avatar'
				:
				'https://api.helperbit.com/api/v1/media/' + this.project.media[0]
		);
	}

	loadProject(params: Params) {
		this.id = params.id;

		this.listConfig = {
			type: {
				value: 'project',
				object: null
			},
			columnsType: 'donor',
			pagination: true
		};

		this.projectImagesConfig = {
			type: 'project',
			value: null
		};

		this.currentImageIndex = 0;

		this.projectService.get(this.id).subscribe((project) => {
			if (project.supporters)
				project.supporters = project.supporters.sort((a, b) => b.level - a.level);

			project.activities.forEach(activity => {
				activity.project = JSON.parse(JSON.stringify(project));
			}); // this will be not necessary

			this.projectImagesConfig = {
				...this.projectImagesConfig, ...{ value: JSON.parse(JSON.stringify(project)) }
			};

			this.project = project;
			this.listConfig = { ...this.listConfig, ...{ type: { object: this.project, value: 'project' } } };

			if (this.project.media)
				this.projectImages = this.project.media.map(img => { return { mediaId: img }; });

			this.progressBarConfig = this.projectService.createProgressBarConfig(this.project);

			this.currencyService.onCurrencyChange.subscribe(currency => {
				this.progressBarConfig = this.projectService.createProgressBarConfig(this.project);

				// PROJECTRECEIVED: Il primo mostra il quantitativo in bitcoin ricevuto, il secondo il totale usato + non usato
				this.pageHeader.info.boxes[0].title = this.moneyPipe.transform(this.project.received, 'short', true);
				// this.pageHeader.info.boxes[0].title = this.moneyPipe.transform(this.progressBarConfig.current, 'short', true);
				this.pageHeader.info.boxes[2].title = this.moneyPipe.transform(this.moneyToBTCPipe.transform(this.project.target, this.project.currency), 'short', true);
			});

			this.updateTranslations();

			if (this.project.event) {
				this.eventService.get(this.project.event).subscribe(event => {
					this.event = event;
					this.event.article = this.articleService.generateEventArticle(this.event);
				});
			}

			if (this.project.video) {
				this.iframeVideo = this.embedVideoService.embed(this.project.video);
			}

			this.projectService.getDonations(this.project._id).subscribe(donations => {
				this.donations = donations.list;
			});

			if (params.donate && this.project.end == null)
				this.donate();

			if (this.project.media.length > 1)
				this.imageUpdaterInterval = setInterval(() => this.updateImageIndex(), 10000);


			this.otherProjects = [];
			this.projectService.getUserProjects(this.project.owner).subscribe(ps => {
				ps.projects.forEach(p => {
					if (p._id == this.project._id)
						return;

					(p as any).donate = true;
					p.ownerdetails = this.project.ownerdetails;
					this.otherProjects.push(p);
				});

				ps.closedprojects.forEach(p => {
					if (p._id == this.project._id)
						return;

					const pg = this.projectService.createProgressBarConfig(p);

					if ((100.0 * pg.current / pg.target) >= 90) {
						(p as any).donate = false;
						p.ownerdetails = this.project.ownerdetails;
						this.otherProjects.push(p);
					}
				});
			});
		});
	}

	ngOnInit() {
		this.utilsService.getPlatformInfoBase().subscribe((info) => {
			const btprice = info.prices; // Serve a qualcosa sicuramente

			this.route.params.subscribe(params => {
				this.loadProject(params);
			});
		});
	}

	public ngOnTranslateLoad(translate: any): void {
		if (this.project)
			this.updateTranslations();
	}
}
