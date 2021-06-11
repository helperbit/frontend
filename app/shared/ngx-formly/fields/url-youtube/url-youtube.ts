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

import { Component, OnInit } from "@angular/core";
import { FieldType, FormlyConfig } from "@ngx-formly/core";


@Component({
	selector: 'formly-field-url-youtube',
	templateUrl: 'url-youtube.html',
	styleUrls: ['../../../../sass/main/custom/embed-video.scss']
})
export class FormlyFieldUrlYoutube extends FieldType implements OnInit {
	constructor(private formlyConfig: FormlyConfig) { super(); }

	ngOnInit() {
		this.formControl.valueChanges.subscribe(() => this.updateVideoUrl());
	}

	updateVideoUrl () {
		//TODO non funziona al primo assegnamento del model su formly
		// debugger
		//possible youtube link
		//https://youtu.be/uO4bn4e7A2A
		//https://www.youtube.com/watch?v=uO4bn4e7A2A
		//https://www.youtube.com/embed/uO4bn4e7A2A?controls=0

		if (!this.formControl.value) return;

		let newval = null;

		if (newval = this.formControl.value.match(/(\?|&)v=([^&#]+)/))
			this.field.templateOptions.idVideo = newval.pop();
		else if (newval = this.formControl.value.match(/(\.be\/)+([^\/]+)/))
			this.field.templateOptions.idVideo = newval.pop();
		else if (newval = this.formControl.value.match(/(\embed\/)+([^\/]+)/))
			this.field.templateOptions.idVideo = newval.pop().replace('?rel=0', '');

		if (!this.field.templateOptions.idVideo) return;

		const embedVideo = $("#embedVideoYoutube iframe")
		if (embedVideo)
			embedVideo.remove();

		$('<iframe class="embed-video" height="250" width="100%" frameborder="0" allowfullscreen></iframe>')
			.attr('src', 'http://www.youtube.com/embed/' + this.field.templateOptions.idVideo)
			.appendTo('#embedVideoYoutube');
	}
}