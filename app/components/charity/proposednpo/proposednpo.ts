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
import { buildErrorResponseMessage, ResponseMessageConfig } from '../../../shared/components/response-messages/response-messages';
import { TranslateService } from '@ngx-translate/core';
import { TableStatic } from '../../../shared/helpers/table-static';
import { SocialShareConfig, SocialShareStyle } from '../../../shared/components/social-share/social-share';
import { ModalsConfig } from '../../../shared/components/modal/oldModal/modal';
import { openProposeNPOModal } from '../../../shared/components/proposednpo-insert/proposednpo-insert';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProposedNpoService, ProposedNpo } from '../../../models/proposednpo';
import { UtilsService } from '../../../services/utils';
import { BrowserHelperService } from '../../../services/browser-helper';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


const ga = (window as any).ga;


@Component({
	selector: 'proposednpo-component',
	templateUrl: 'proposednpo.html',
	styleUrls: ['../../../sass/main/custom/tools-page-template.scss', 'proposednpo.scss']
})
export class ProposednpoComponent implements OnInit {
	responseMessage: ResponseMessageConfig;
	isBannerOpen: boolean;
	table: TableStatic<ProposedNpo>;
	modals: ModalsConfig;
	socialShare: {
		config: SocialShareConfig;
		style: SocialShareStyle;
	};

	constructor(
		private proposedNpoService: ProposedNpoService,
		private modalService: NgbModal,
		private translate: TranslateService,
		private route: ActivatedRoute,
		private utilsService: UtilsService,
		browserHelperService: BrowserHelperService
	) {
		this.modals = {
			endorsmentDone: {
				id: 'modalEndorsmentDone'
			},
			endorsmentFail: {
				id: 'modalEndorsmentFail'
			},
			merchandaising: {
				id: 'merchandaisingModal',
				modalClass: 'modal-lg',
				hideCloseButton: true,
				title: translate.instant('Amazing prizes!')
			}
		};

		this.socialShare = {
			config: {
				title: translate.instant('I recommend') + ' \"__NAME__\" __USERNAME__ ' + translate.instant('to join the Helperbit transparency revolution!'),
				hashtags: [translate.instant('npo'), translate.instant('donation'), translate.instant('helperbit')],
				socialsUsernames: {}
			},
			style: {
				type: 'circle',
				colored: true
			}
		};

		this.table = new TableStatic(translate, utilsService, browserHelperService);
		this.table.results = [];

		this.table.addSortOptions(translate.instant('Country'), 'country');
		this.table.addSortOptions(translate.instant('Name'), 'name');
		this.table.addSortOptions(translate.instant('Endorsments'), 'endorsment', true);

		this.table.addColumn('country', translate.instant('Country'), 25, {
			asc: {
				value: { sortBy: 'country', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'country' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'country', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'country' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'country', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'country'
			}
		});

		this.table.addColumn('name', translate.instant('Name'), 15, {
			asc: {
				value: { sortBy: 'name', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'name' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'name', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'name' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'name', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'name'
			}
		});

		this.table.addColumn('link', translate.instant('Link'), 15, {
			asc: {
				show: () => false
			},
			desc: {
				show: () => false
			},
			ascDesc: {
				show: () => false
			}
		});

		this.table.addColumn('endorsment', translate.instant('Endorsments'), 15, {
			asc: {
				value: { sortBy: 'endorsment', sort: 'asc' },
				show: () => this.table.activeSort.sortBy == 'endorsment' && this.table.activeSort.sort == 'asc'
			},
			desc: {
				value: { sortBy: 'endorsment', sort: 'desc' },
				show: () => this.table.activeSort.sortBy == 'endorsment' && this.table.activeSort.sort == 'desc'
			},
			ascDesc: {
				value: { sortBy: 'endorsment', sort: 'desc' },
				show: () => this.table.activeSort.sortBy != 'endorsment'
			}
		});

		this.table.addColumn('share', translate.instant('Share'), 15, {
			asc: {
				show: () => false
			},
			desc: {
				show: () => false
			},
			ascDesc: {
				show: () => false
			}
		});

		this.table.addColumn('actions', translate.instant('Actions'), 15, {
			asc: {
				show: () => false
			},
			desc: {
				show: () => false
			},
			ascDesc: {
				show: () => false
			}
		});

		this.table.addVisualizationButton('grid', 'th-large', translate.instant('Grid visualization'));
		this.table.addVisualizationButton('table', 'th-list', translate.instant('Table visualization'), true);

		this.table.setScrollableAreas([
			{ visualizationButton: 'grid', id: 'visualizationGrid' },
			{ visualizationButton: 'table', id: 'visualizationTable' },
		]);

		this.table.setUpdateDataHandler(filter => {
			return new Promise((resolve, reject) => {
				this.proposedNpoService.getList().subscribe(proposednpos => {
					proposednpos.forEach(proposedNpo => {
						this.socialShare.config = {
							title: this.socialShare.config.title.replace('__NAME__', proposedNpo.name),
							socialsUsernames: proposedNpo.social
						};
					});

					return resolve(proposednpos);
				}, reject);
			});
		});

		this.table.setFilterByTextHandler((proposedNpos, text) => {
			if (text && text.length > 0)
				return proposedNpos.filter(proposedNpo => proposedNpo.name && proposedNpo.name.toLowerCase().search(text.toLowerCase()) != -1);
			else
				return proposedNpos;
		});

		this.table.setSortHandler((proposedNpos, sort) => {
			switch (sort.sortBy) {
				case 'country': {
					if (sort.sort == 'asc')
						proposedNpos.sort((a1, a2) => a1.country ? a1.country.localeCompare(a2.country) : -1);
					else
						proposedNpos.sort((a1, a2) => a1.country ? -a1.country.localeCompare(a2.country) : -1);

					break;
				}
				case 'name': {
					if (sort.sort == 'asc')
						proposedNpos.sort((a1, a2) => a1.name ? a1.name.localeCompare(a2.name) : -1);
					else
						proposedNpos.sort((a1, a2) => a1.name ? -a1.name.localeCompare(a2.name) : -1);

					break;
				}
				case 'endorsment': {
					if (sort.sort == 'asc')
						proposedNpos.sort((a1, a2) => a1.endorsment - a2.endorsment);
					else
						proposedNpos.sort((a1, a2) => -(a1.endorsment - a2.endorsment));

					break;
				}
			}

			return proposedNpos;
		});
	}

	propose() {
		openProposeNPOModal(this.modalService, {});
	}

	endorseProposedNpo(proposedNpo) {
		this.proposedNpoService.endorse(proposedNpo._id).subscribe(data => {
			proposedNpo.endorsment = data.endorsment;
			$('#modalEndorsmentDone').modal('show');

			ga('send', {
				hitType: 'event',
				eventCategory: 'ProposedNPO',
				eventAction: 'endorse',
				eventLabel: proposedNpo._id
			});
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.error);
			$('#modalEndorsmentFail').modal('show');
		});
	}

	ngOnInit() {
		this.utilsService.setMeta(
			this.translate.instant('List of Proposed NPO submitted by users'),
			this.translate.instant('List of non profit organizations suggested by users that would like to see in Helperbit. You can vote your favorite organization!')
		);

		if (this.route.snapshot.queryParamMap.has('propose'))
			this.propose();

		this.table.updateData({ newHttpRequest: true });
	}
}
