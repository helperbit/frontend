import { Input, Component, OnChanges } from '@angular/core';
import { ProgressBarConfig } from "../progress-bar/progress-bar";
import { ProjectService, Project } from "../../../models/project";
import { UtilsService } from "../../../services/utils";
import { Router } from '@angular/router';


@Component({
	selector: 'project-landscape',
	templateUrl: 'project-landscape.html',
	styleUrls: ['project-landscape.scss']
})
export class ProjectLandscapeComponent implements OnChanges {
	@Input() project: Project;
	@Input() donate: boolean = false;
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