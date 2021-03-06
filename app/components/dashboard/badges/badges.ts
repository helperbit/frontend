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
import { UtilsService } from '../../../services/utils';
import { TranslateService } from '@ngx-translate/core';
import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { InfoBoxConfig } from '../../../shared/components/info-box/info-box';
import { BadgesGridConfig } from '../../../shared/components/badges-grid/badges-grid';
import { ModalConfig } from '../../../shared/components/modal/oldModal/modal';
import { DashboardService } from '../../../models/dashboard';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
	selector: 'me-badges-component',
	templateUrl: 'badges.html',
	styleUrls: ['../../../sass/main/custom/page.scss']
})
export class MeBadgesComponent implements OnInit {
	pageHeader: PageHeaderConfig;
	infoBox: InfoBoxConfig;
	badgesConfig: BadgesGridConfig;
	badgeToShow?: string;
	modals: { [modalName: string]: ModalConfig & { selectedBadge?: any } };;

	constructor(
		private utilsService: UtilsService,
		private dashboardService: DashboardService,
		private route: ActivatedRoute,
		translate: TranslateService
	) {
		this.pageHeader = {
			description: {
				title: translate.instant('Badges'),
				subTitle: translate.instant('Check your badges')
			}
		};
		this.modals = {
			badgeInfo: {
				id: 'badgeInfoModal',
				modalClass: 'modal-md',
				hideCloseButton: true,
				title: translate.instant('How to unlock this badge?'),
				selectedBadge: { key: null, src: null }
			}
		};
		this.infoBox = {
			title: translate.instant('What are badges?'),
			transclude: true
		};
		this.badgesConfig = { badges: [], badgeClass: 'col-lg-4 col-md-4 col-sm-6 col-xs-12', badgeHeight: 140 };
		this.badgeToShow = null;
	}

	showBagdeInfo(key, badge) {
		const badgesData = this.utilsService.badges();
		this.modals.badgeInfo.selectedBadge.key = key;
		this.modals.badgeInfo.selectedBadge.src = badge.unlock ? badgesData[badge.maxBagde].images.medium : badge.src;
		this.modals.badgeInfo.selectedBadge.showDescription = !badge.earned[badge.maxBagde];

		$('#' + this.modals.badgeInfo.id).modal('show');
	}

	ngOnInit() {
		this.dashboardService.get().subscribe(user => {
			this.badgesConfig = { ...this.badgesConfig, ...{ badges: user.badges } };

			if (this.route.snapshot.paramMap.has('badge'))
				this.badgeToShow = this.route.snapshot.paramMap.get('badge');
		});
	}
}

