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