import { UtilsService } from '../../../services/utils';
import { LightboxImage } from '../lightbox/lightbox';
import { Async } from '../../../shared/helpers/async';
import { Component, Input, OnChanges } from '@angular/core';
import { getMediaUrl } from 'app/shared/helpers/utils';

export interface SlidershowConfig {
	type: string;
	value: any;
}

export interface SlidershowImage {
	mediaId: string;
	alt?: string;
	type?: 'image' | 'pdf';
}


@Component({
	selector: 'slidershow',
	templateUrl: 'slidershow.html',
	styleUrls: ['slidershow.scss']
})
export class SlidershowComponent implements OnChanges {
	@Input() images: SlidershowImage[];
	@Input() config: SlidershowConfig;

	activeIndex: number;
	lightbox: {
		style: {};
		show: boolean;
		images: LightboxImage[];
	};
	imgAttrs: {
		active: boolean;
		value: any;
		type: any;
	};
	slidershowImagesConfig: SlidershowConfig;
	thumbWidth: number;

	constructor(private utilsService: UtilsService) {
		this.activeIndex = 0;
		this.lightbox = {
			style: {},
			show: false,
			images: []
		};
		this.imgAttrs = {
			active: false,
			value: null,
			type: null
		};
		this.slidershowImagesConfig = {
			type: null,
			value: null
		};
	}

	public fullSizeImage(image: any) {
		if (image.type.indexOf('pdf') != -1)
			window.open(getMediaUrl(image.mediaId), '_blank');
		else
			this.lightbox.show = true;
	}

	public plusSlides(n) {
		this.activeIndex += n;
		if (this.activeIndex > this.images.length - 1)
			this.activeIndex = 0;
		else if (this.activeIndex < 0)
			this.activeIndex = this.images.length - 1;
	}

	public currentSlide(n) {
		this.activeIndex = n;
	}

	ngOnChanges(changes) {
		if (changes.images && changes.images.currentValue) {
			Async.set(this.images, 'type', img => {
				if (! ('type' in img))
					return this.utilsService.getMediaType(img.mediaId).toPromise();
				else
					return new Promise((resolve, _) => { resolve( img.type); });
			}).then(images => {
				this.images = images;
				this.lightbox.images = this.images.map(i => ({ img: i.mediaId, type: i.type, alt: i.alt }));

				this.thumbWidth = 100 / this.images.length;

				if (this.thumbWidth > 50)
					this.thumbWidth = 50;
			}).catch(res => { });
		}
		if (changes.config && changes.config.currentValue) {
			if (this.config.type != 'project' && this.config.type != 'activity')
				return;

			this.imgAttrs.active = true;
			this.imgAttrs.type = 'project';
			this.imgAttrs.value = this.config.value;

			this.slidershowImagesConfig = {
				...this.slidershowImagesConfig, ...{
					type: this.imgAttrs.type,
					value: this.config.value
				}
			};
		}
	}
}