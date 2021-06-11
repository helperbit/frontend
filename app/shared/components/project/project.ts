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

import { Input, Component, OnChanges } from '@angular/core';
import { ProgressBarConfig } from "../progress-bar/progress-bar";
import { ProjectService, Project } from "../../../models/project";
import { UtilsService } from "../../../services/utils";
import { Router } from '@angular/router';


@Component({
	selector: 'project',
	templateUrl: 'project.html',
	styleUrls: ['project.scss']
})
export class ProjectComponent implements OnChanges {
	@Input() project: Project;
	@Input() donate: boolean = true;
	progressBarConfig: ProgressBarConfig;

	constructor(
		private projectService: ProjectService, 
		private router: Router,
		private utilsService: UtilsService
	) {
		this.progressBarConfig = null;
	}

	go() {
		this.router.navigateByUrl('/project/' + this.project._id);
	}

	ngOnChanges(changes) {
		if (!changes.project || !changes.project.currentValue)
			return;

		this.utilsService.getPlatformInfoBase().subscribe(info => {
			this.progressBarConfig = this.projectService.createProgressBarConfig(this.project);
		});
	}
}
