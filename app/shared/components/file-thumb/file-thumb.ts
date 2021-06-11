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

import { UtilsService } from '../../../services/utils';
import { Component, Input, OnChanges } from '@angular/core' 
import { getLocalStorage } from 'app/shared/helpers/utils';


@Component({
	selector: 'file-thumb',
	templateUrl: 'file-thumb.html',
	styleUrls: ['file-thumb.scss']
})
export class FileThumbComponent implements OnChanges {
	@Input() auth: boolean;
	@Input() mediaId: string;

	media: { url: string; type: string; alt?: string };
	lightbox: { show: boolean; images: { img: string }[] };

	constructor(private utilsService: UtilsService) {
		this.media = {
			url: null,
			type: null
		};
		this.lightbox = {
			show: false,
			images: []
		};
	}

	ngOnChanges(changes) {
		if (!changes.mediaId || !changes.mediaId.currentValue)
			return;

		if (!this.mediaId) return;

		if (this.auth)
			this.media.url = this.mediaId + '?token=' + getLocalStorage().getItem('token');
		else
			this.media.url = this.mediaId;

		this.utilsService.getMediaType(this.mediaId).subscribe((t) => {
			if (t.indexOf('pdf') != -1)
				this.media.type = 'pdf';
			else
				this.media.type = 'image';

			this.lightbox.images = [{ img: this.media.url }];
		});
	}
}