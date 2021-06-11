import { Component, Input, OnChanges } from '@angular/core';
import { Project, ProjectActivity } from 'app/models/project';
import { TranslateService } from '@ngx-translate/core';
import { StranslatePipe } from 'app/shared/filters/stranslate';
import { OnTranslateLoad } from 'app/shared/helpers/on-translate-load';

interface TimelineEntry {
	date: Date;
	icon?: string;
	title?: string;
	type: 'activity' | 'project_created' | 'project_concluded';
	activity?: ProjectActivity;
}

@Component({
	selector: 'project-timeline',
	templateUrl: 'timeline.html',
	styleUrls: ['timeline.scss']
})
export class ProjectTimelineComponent extends OnTranslateLoad implements OnChanges {
	@Input() project: Project;
	@Input() maxEntries?: number;
	@Input() onlyPreview?: boolean;

	entries: TimelineEntry[];
	loaded: number;

	constructor(
		translate: TranslateService,
		private stranslatePipe: StranslatePipe
	) {
		super(translate);

		this.entries = [];
		this.loaded = 0;
	}

	dataOfEntry(e: TimelineEntry) {
		let icon = 'fa ';
		let title = '';

		switch (e.type) {
			case 'project_concluded':
				icon += 'fa-hourglass-end lightblue';
				title = this.translate.instant('The project has reached the fundraising goal');
				break;

			case 'project_created':
				icon += 'fa-hourglass-start lightblue';
				title = this.translate.instant('The project has been created');
				break;

			case 'activity':
				switch (e.activity.category) {
					case 'invoice':
						icon += 'fa-credit-card-alt cyan';
						title = this.translate.instant('New invoices have been published');
						break;
					case 'media':
						icon += 'fa-camera purple';
						title = this.translate.instant('New media have been published');
						break;
					case 'quote':
						icon += 'fa-sticky-note indigo';
						title = this.translate.instant('New quotes have been published');
						break;
					case 'update':
						icon += 'fa-newspaper-o maroon';
						title = this.translate.instant('New updates have been published');
						break;
				}
				break;
		}

		return {
			icon: icon,
			title: title
		};
	}

	isCropped(t) {
		return this.stranslatePipe.transform(t).length > 250;
	}

	loadMore() {
		if (this.loaded < this.entries.length)
			this.loaded += this.maxEntries;
		if (this.loaded > this.entries.length)
			this.loaded = this.entries.length;
	}

	ngOnChanges() {
		if (!this.project)
			return;

		this.entries = [];

		this.entries.push({
			date: new Date(this.project.start),
			type: 'project_created'
		});

		this.project.activities.forEach(a => {
			this.entries.push({
				date: new Date(a.createdAt),
				type: 'activity',
				activity: a
			});
		});

		if (this.project.end)
			this.entries.push({
				date: new Date(this.project.end),
				type: 'project_concluded'
			});

		this.entries = this.entries.map(e => {
			const data = this.dataOfEntry(e);
			e.title = data.title;
			e.icon = data.icon;
			return e;
		}).sort((a, b) => b.date.getTime() - a.date.getTime());

		if (this.maxEntries) {
			this.loaded = this.maxEntries;
		} else {
			this.loaded = this.entries.length;
		}
	}

	ngOnTranslateLoad(translate: any): void {
		this.entries = this.entries.map(e => {
			e.title = this.dataOfEntry(e).title;
			return e;
		});
	}
}
