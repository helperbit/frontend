import { UtilsService } from '../../../services/utils';
import { TranslateService } from '@ngx-translate/core';
import { ModalConfig } from '../modal/oldModal/modal';
import { ResponseMessageConfig } from '../response-messages/response-messages';
import { Badge } from '../../../models/common';
import { Component, Input, OnChanges } from '@angular/core';

export interface BadgesGridConfig {
	badgeClass?: string;
	badgeHeight?: number;
	alwaysDescription?: boolean;
	badges: Badge[];
}

@Component({
	selector: 'badges-grid',
	templateUrl: 'badges-grid.html',
	styleUrls: ['../../../sass/main/custom/check-list.scss', 'badges-grid.scss']
})
export class BadgesGridComponent implements OnChanges {
	@Input() config: BadgesGridConfig;
	@Input() openBadge: string;

	responseMessage: ResponseMessageConfig;
	modals: { [modalName: string]: ModalConfig & { alwaysDescription?: boolean; selectedBadge?: any } };
	badges: any;
	defaultBadges: any;
	badgeClass: string;
	badgeHeight: number;
	badgesData: any;

	constructor(private utilsService: UtilsService, private translate: TranslateService) {
		this.modals = {
			badgeInfo: {
				id: 'modalBadgeInfo',
				modalClass: 'modal-md',
				hideCloseButton: true,
				title: this.translate.instant('How to unlock this badge?'),
				selectedBadge: { key: null, src: null },
				alwaysDescription: false //used to show every time description and to hide check when user selected got badge (gold, siler, bronze)
			}
		};

		this.badges = null;
		this.badgesData = this.utilsService.badges();

		this.defaultBadges = {
			trust: {
				earned: {
					'trust': false
				},
				desctiption: {
					'trust': translate.instant('Lorem ipsum dolor sit amet')
				},
				src: this.badgesData['trust-locked'].images.medium,
				unlock: false,
				maxBagde: 'trust'
			},
			supporter: {
				earned: {
					'supporter': false,
				},
				src: this.badgesData['supporter-locked'].images.medium,
				unlock: false,
				maxBagde: 'supporter'
			},
			friend: {
				earned: {
					'friend': false,
				},
				src: this.badgesData['friend-locked'].images.medium,
				unlock: false,
				maxBagde: 'friend'
			},
			donor: {
				earned: {
					'donor-bronze': false,
					'donor-silver': false,
					'donor-gold': false
				},
				src: this.badgesData['donor-locked'].images.medium,
				unlock: false,
				maxBagde: 'donor-gold'
			},
			fundraiser: {
				earned: {
					'fundraiser-bronze': false,
					'fundraiser-silver': false,
					'fundraiser-gold': false
				},
				src: this.badgesData['fundraiser-locked'].images.medium,
				unlock: false,
				maxBagde: 'fundraiser-gold'
			},
			ambassador: {
				earned: {
					'ambassador-bronze': false,
					'ambassador-silver': false,
					'ambassador-gold': false
				},
				src: this.badgesData['ambassador-locked'].images.medium,
				unlock: false,
				maxBagde: 'ambassador-gold'
			}
		};

		this.badgeClass = 'col-lg-12 col-md-12 col-sm-12 col-xs-12';
		this.badgeHeight = 250;
	}

	public showBagdeInfo(key, badge) {
		this.modals.badgeInfo.selectedBadge.key = key;
		this.modals.badgeInfo.selectedBadge.src = badge.unlock ? this.badgesData[badge.maxBagde].images.medium : badge.src;
		this.modals.badgeInfo.selectedBadge.showDescription = !badge.earned[badge.maxBagde] || this.modals.badgeInfo.alwaysDescription;

		$('#' + this.modals.badgeInfo.id).modal('show');
	}

	private setBadges(config) {
		if (config.badgeClass)
			this.badgeClass = config.badgeClass;

		if (config.badgeHeight)
			this.badgeHeight = config.badgeHeight;

		if (config.alwaysDescription)
			this.modals.badgeInfo.alwaysDescription = config.alwaysDescription;

		// if (isEmpty(config.badges) || config.badges.length == 0)
		// 	return;

		this.badges = null;

		for (const badgeKey in this.defaultBadges) {
			for (const key in this.defaultBadges[badgeKey].earned) {
				const check = config.badges.filter(b => key == b.code);

				if (check.length > 0)
					this.defaultBadges[badgeKey].earned[key] = true;
			}

			for (const key in this.defaultBadges[badgeKey].earned)
				if (this.defaultBadges[badgeKey].earned[key]) {
					this.defaultBadges[badgeKey].src = this.badgesData[key].images.medium
					this.defaultBadges[badgeKey].unlock = true;
				}
		}

		this.badges = this.defaultBadges;
	}

	ngOnChanges(changes) {
		if (changes.config && changes.config.currentValue)
			this.setBadges(changes.config.currentValue);

		if (this.badges && changes.openBadge && changes.openBadge.currentValue)
			this.showBagdeInfo(changes.openBadge.currentValue, this.badges[changes.openBadge.currentValue]);
	}
}