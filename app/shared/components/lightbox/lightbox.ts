import * as $ from 'jquery';
import { Component, Input, EventEmitter, ElementRef, Output, OnInit, OnChanges } from '@angular/core';

export interface LightboxImage {
	img: string;
	type: 'pdf' | 'image';
	alt: string;
}

export interface LightboxConfig {
	type: 'project' | 'activity';
	value: any;
}

@Component({
	selector: 'lightbox',
	templateUrl: 'lightbox.html',
	styleUrls: ['lightbox.scss']
})
export class LightboxComponent implements OnChanges, OnInit {
	@Input() images: LightboxImage[];
	@Input() activeIndex: number;
	@Input() show: boolean;
	@Input() config?: LightboxConfig;
	@Output() closed = new EventEmitter<number>();

	activeImage: any;
	currentIndex: number;

	imgAttrs: {
		active: boolean;
		value: any;
		type: any;
	};

	constructor(private element: ElementRef) {
		this.imgAttrs = {
			active: false,
			value: null,
			type: null
		};
		this.currentIndex = 0;
	}

	private setActiveImage() {
		if (this.images && this.images.length > this.currentIndex)
			this.activeImage = this.images[this.currentIndex];
	}

	public plusSlides(n) {
		this.currentIndex += n;
		if (this.currentIndex > this.images.length - 1)
			this.currentIndex = 0;
		else if (this.currentIndex < 0)
			this.currentIndex = this.images.length - 1;

		this.setActiveImage();
	}

	private currentSlide(n) {
		this.currentIndex = n;
		this.setActiveImage();
	}

	public hide() {
		this.closed.emit(this.currentIndex);
	}

	ngOnChanges(changes) {
		if (changes.activeIndex)
			this.currentIndex = this.activeIndex;

		this.setActiveImage();

		if (!changes.config || !changes.config.currentValue)
			return;

		if (this.config.type == 'project' || this.config.type == 'activity') {
			this.imgAttrs.active = true;
			this.imgAttrs.type = 'project';
			this.imgAttrs.value = this.config.value;
		}
	}

	ngOnInit() {
		this.setActiveImage();
		$('body').append(this.element.nativeElement);
	}
}
