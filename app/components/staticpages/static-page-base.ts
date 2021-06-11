import { PageHeaderConfig } from "../../shared/components/page-header/page-header";
import { UtilsService } from 'app/services/utils';
import { OnInit } from '@angular/core';
import { OnTranslateLoad } from 'app/shared/helpers/on-translate-load';
import { TranslateService } from '@ngx-translate/core';

export interface StaticPageConfig {
	header: {
		title: string;
	};
	meta: {
		title: string;
		image: string;
		description: string;
	};
	image: {
		url: string;
		alt: string;
	};
};

export type StaticPageConfigFn = (translate: TranslateService) => StaticPageConfig;

export class StaticPageBase extends OnTranslateLoad {
	pageHeader: PageHeaderConfig;
	image: { url: string; alt: string };
	staticConfig: StaticPageConfig;

	constructor(
		translate: TranslateService,
		private utilsService: UtilsService,
		private staticConfigFn: StaticPageConfigFn
	) {
		super(translate, true);
		
		this.staticConfig = this.staticConfigFn(translate);
		this.image = this.staticConfig.image;
	}

	ngOnTranslateLoad(translate) {
		this.staticConfig = this.staticConfigFn(translate);

		this.pageHeader = { description: this.staticConfig.header };
		this.image = this.staticConfig.image;

		this.utilsService.setMeta(
			this.staticConfig.meta.title,
			this.staticConfig.meta.description,
			this.staticConfig.meta.image
		);
	}
}