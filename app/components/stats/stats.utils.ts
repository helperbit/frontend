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