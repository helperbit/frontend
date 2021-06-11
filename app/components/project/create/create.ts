import * as $ from 'jquery';
import { BrowserHelperService } from '../../../services/browser-helper';
import { PageHeaderConfig } from '../../../shared/components/page-header/page-header';
import { ModalsConfig } from '../../../shared/components/modal/oldModal/modal';
import { ResponseMessageConfig, buildErrorResponseMessage } from '../../../shared/components/response-messages/response-messages';
import { TranslateService } from '@ngx-translate/core';
import { ProjectService, Project } from '../../../models/project';
import { WalletService } from '../../../models/wallet';
import { DashboardService, UserPrivate } from '../../../models/dashboard';
import { ProgressBarConfig } from '../../../shared/components/progress-bar/progress-bar';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'app/services/utils';
import { RowStyleObject, RowStyle } from 'app/models/common';
import AppSettings from 'app/app.settings';

/* User profile /project/create */
@Component({
	selector: 'project-create-component',
	templateUrl: 'create.html',
	styleUrls: ['../../../sass/main/custom/page.scss', 'create.scss']
})
export class ProjectCreateComponent implements OnInit {
	responseMessage: ResponseMessageConfig;
	pageHeader: PageHeaderConfig;
	modals: ModalsConfig;
	user: UserPrivate;
	createEdit: any;
	selectedProject: any;
	projects: {
		all: (Project & { progressBarConfig: ProgressBarConfig })[];
		closed: (Project & { progressBarConfig: ProgressBarConfig })[];
		opened: (Project & { progressBarConfig: ProgressBarConfig })[];
	};
	wallets: {
		all: any[];
		used: any[];
		available: any[];
	};
	tableHeadColumns: any;
	tableHeadColumnsList: string[];
	projectsRowStyle: RowStyleObject;
	baseUrl: string;

	constructor(
		private utilsService: UtilsService,
		private router: Router,
		public browserHelperService: BrowserHelperService,
		private translate: TranslateService,
		private projectService: ProjectService,
		private walletService: WalletService,
		private dashboardService: DashboardService
	) {
		this.pageHeader = {
			description: {
				title: translate.instant('project'),
				subTitle: translate.instant('Create or edit a project')
			}
		};

		this.baseUrl = AppSettings.baseUrl;

		this.modals = {
			noWallet: {
				id: 'modalNoWallet',
				title: translate.instant('No wallet')
			},
			confirm: {
				id: 'modalConfirm',
				modalClass: 'modal-md',
				hideCloseButton: true,
				title: null,
				confirm: {
					method: null,
					parameters: null,
					description: null
				}
			},
			createDonationButton: {
				id: 'modalCreateDonationButton'
			}
		};

		this.user = null;
		this.createEdit = null;
		this.projects = {
			all: [],
			closed: [],
			opened: []
		};
		this.wallets = {
			all: [],
			used: [],
			available: []
		};
		this.tableHeadColumns = null;

		this.projectsRowStyle = {};
	}

	initProjects() {
		this.dashboardService.getProjects().subscribe(data => {
			const addProgressBar = project => {
				project.progressBarConfig = this.projectService.createProgressBarConfig(project);
				return project;
			};

			data.projects.forEach(project => this.setRowStyle(project));
			data.closedprojects.forEach(project => this.setRowStyle(project));

			this.projects.opened = data.projects.map(addProgressBar);
			this.projects.closed = data.closedprojects.map(addProgressBar);
			this.projects.all = this.projects.opened.concat(this.projects.closed);

			/* Check already selected wallets and available */
			this.wallets.used = this.projects.all.map(p => p.receiveaddress).filter(p => p != null);

			this.walletService.getList().subscribe(list => {
				this.wallets.all = list.wallets;
				const wallets = this.wallets.all.filter(w => this.wallets.used.indexOf(w.address) == -1);
				this.wallets.available = wallets;
			});

			if (this.user.receiveaddress === '' || this.user.receiveaddress === null)
				this.showModal(this.modals.noWallet.id);

			/* Adding table head columns */
			this.tableHeadColumnsList = ['title', 'status', 'donations', 'supporters', 'actions'];
			this.tableHeadColumns = {
				'title': {
					label: this.translate.instant('Title'),
					show: true,
					class: 'text-center text-ellipsis',
					style: { 'width': this.browserHelperService.currentResolution != 'xs' ? '23%' : 'auto' }
				},
				'status': {
					label: this.translate.instant('Status'),
					show: true,
					class: 'text-center',
					style: { 'width': this.browserHelperService.currentResolution != 'xs' ? '12%' : 'auto' }
				},
				'donations': {
					label: this.browserHelperService.currentResolution != 'xs' ? this.translate.instant('Donations Received') : this.translate.instant('Received'),
					show: true,
					class: 'text-center',
					style: { 'width': this.browserHelperService.currentResolution != 'xs' ? '25%' : 'auto' }
				},
				'supporters': {
					label: this.translate.instant('Supporters'),
					show: true,
					class: 'text-center hidden-xs',
					style: { 'width': '15%' }
				},
				'actions': {
					label: this.translate.instant('Actions'),
					show: true,
					class: 'text-center',
					style: { 'width': this.browserHelperService.currentResolution != 'xs' ? '25%' : 'auto' }
				}
			};
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.error);
		});
	}

	showModal(id) {
		$('#' + id).modal('show');
		$('#' + id).on('hide.bs.modal', e => {
			if (id == 'modalProject')
				this.initProjects();
		});
		$('#' + id).on('hidden.bs.modal', e => {
			//cancella gli eventi associata alla modal
			$('#' + id).unbind();
		});
	}

	setRowStyle(project: Project): void {
		const style: RowStyle = {
			status: {
				class: {
					label: null,
					icon: null
				},
				text: null
			},
			buttons: null
		};

		if (project.status == 'approved' && !project.paused)
			style.status = { class: { label: 'label-success', icon: 'fa-check' }, text: this.translate.instant('Approved') };
		else if (project.status == 'approved' && project.paused)
			style.status = { class: { label: 'label-info', icon: 'fa-pause' }, text: this.translate.instant('Paused') };
		else if (project.status == 'rejected')
			style.status = { class: { label: 'label-danger', icon: 'fa-times' }, text: this.translate.instant('Rejected') };
		else if (project.status == 'submitted')
			style.status = { class: { label: 'label-info', icon: 'fa-clock-o' }, text: this.translate.instant('Submitted') };
		else // if (project.status == 'draft')
			style.status = { class: { label: 'label-default', icon: 'fa-pencil-square-o' }, text: this.translate.instant('Draft') };

		style.buttons = [
			{
				text: this.translate.instant('Go to'),
				class: 'btn-info',
				icon: {
					class: 'fa-eye'
				},
				tooltip: this.translate.instant('Click to go to this project.'),
				show: true,
				click: project => this.goToProject(project)
			},
			{
				text: this.translate.instant('Donation Button'),
				class: 'btn-info',
				icon: {
					class: 'fa-heart'
				},
				tooltip: this.translate.instant('Click to generate the donation button code of this project.'),
				show: project.status == 'approved',
				click: project => this.createDonationButton(project)
			},
			{
				text: this.translate.instant('Submit'),
				class: 'btn-success',
				icon: {
					class: 'fa-paper-plane'
				},
				tooltip: this.translate.instant('To make the project visible in the platform you need to submit it; an Helperbit admin will validate the project and will approve or reject the project. Click to submit.'),
				show: project.status != 'approved' && project.status != 'submitted',
				click: project => this.submitProject(project)
			},
			{
				text: this.translate.instant('Resume'),
				class: 'btn-info',
				icon: {
					class: 'fa-play'
				},
				tooltip: this.translate.instant('Your project is paused, so it doesn\'t accept donations; click to resume it to receive donations.'),
				show: project.status == 'approved' && project.paused,
				click: project => this.pauseResumeProject(project)
			},
			{
				text: this.translate.instant('Pause'),
				class: 'btn-info',
				icon: {
					class: 'fa-pause'
				},
				tooltip: this.translate.instant('Your project is accepting donations; click to pause it if you want to stop donations for a period.'),
				show: project.status == 'approved' && !project.paused,
				click: project => this.pauseResumeProject(project)
			},
			{
				text: this.translate.instant('Edit'),
				class: 'btn-default',
				icon: {
					class: 'fa-pencil'
				},
				tooltip: this.translate.instant('Click to edit this project.'),
				show: true,
				click: project => this.editProject(project)
			},
			{
				text: this.translate.instant('Delete'),
				class: 'btn-danger',
				icon: {
					class: 'fa-trash'
				},
				tooltip: this.translate.instant('Click to delete this project.'),
				show: project.receiveddonations == 0,
				click: project => this.openConfirmDeleteProject(project)
			}
		];

		this.projectsRowStyle[project._id] = style;
	}

	createDonationButton(project) {
		this.selectedProject = project;
		$('#' + this.modals.createDonationButton.id).modal('show');
	}

	newProject() {
		this.router.navigateByUrl('/project/new/edit');
	}

	editProject(project) {
		this.router.navigateByUrl('/project/' + project.id + '/edit');
	}

	submitProject(project) {
		this.responseMessage = null;

		this.projectService.submitProject(project._id).subscribe(_ => {
			this.initProjects();
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.error);
		});
	}

	pauseResumeProject(project) {
		this.responseMessage = null;

		this.projectService.edit(project._id, { paused: !project.paused }).subscribe(_ => {
			this.initProjects();
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.error);
		});
	}

	openConfirmDeleteProject(project) {
		this.modals.confirm.confirm.method = project => this.deleteProject(project);
		this.modals.confirm.confirm.parameters = [project];
		this.modals.confirm.title = this.translate.instant('Confirm delete project');
		this.modals.confirm.confirm.description = this.translate.instant('Are you sure to delete') + ' ' + this.utilsService.getSString(project.title) + ' ' + this.translate.instant('project?');

		this.showModal(this.modals.confirm.id);
	}

	deleteProject(project) {
		this.responseMessage = null;

		this.projectService.deleteProject(project._id).subscribe(_ => {
			this.initProjects();
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.error);
		});
	}

	goToProject(project) {
		this.router.navigateByUrl('/project/' + project._id);
	}

	ngOnInit() {
		this.responseMessage = null;

		return this.dashboardService.get().subscribe(user => {
			this.user = user;
			this.initProjects()
		}, res => {
			this.responseMessage = buildErrorResponseMessage(res.error);
		});
	}
}

