import { TranslateService } from '@ngx-translate/core';
import AppSettings from '../../app.settings';

export function timeEntriesData(translate: TranslateService) {
	return {
		'day': {
			name: translate.instant('Today'),
			iconId: 'hourglass1',
			src: AppSettings.baseUrl + '/media/icons-svg/svg/hourglass_1.svg'
		},
		'week': {
			name: translate.instant('Last Week'),
			iconId: 'hourglass2',
			src: AppSettings.baseUrl + '/media/icons-svg/svg/hourglass_2.svg'
		},
		'month': {
			name: translate.instant('Last Month'),
			iconId: 'hourglass3',
			src: AppSettings.baseUrl + '/media/icons-svg/svg/hourglass_3.svg'
		},
		'3month': {
			name: translate.instant('Last 3 Months'),
			iconId: 'hourglass4',
			src: AppSettings.baseUrl + '/media/icons-svg/svg/hourglass_4.svg'
		},
		'year': {
			name: translate.instant('Last Year'),
			iconId: 'hourglass5',
			src: AppSettings.baseUrl + '/media/icons-svg/svg/hourglass_5.svg'
		},
		'ever': {
			name: translate.instant('All Time'),
			iconId: 'hourglass6',
			src: AppSettings.baseUrl + '/media/icons-svg/svg/hourglass_6.svg'
		}
	};
}