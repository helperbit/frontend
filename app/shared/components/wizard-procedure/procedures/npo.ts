import { WizardProcedure, Step } from "./procedure";
import { TranslateService } from '@ngx-translate/core';
import { UserPrivate, DashboardService, UserVerify } from 'app/models/dashboard';
import { WalletService } from 'app/models/wallet';
import AppSettings from 'app/app.settings';
import { interpolateString } from 'app/shared/helpers/utils';

export class NPOProcedure extends WizardProcedure {
	steps: Step[];

	constructor(
		private walletService: WalletService,
		private dashboardService: DashboardService,
		private translate: TranslateService
	) {
		super();

		const stepBasic: Step = {
			id: 'basic',
			title: this.translate.instant('Basic'),
			description: this.translate.instant('Complete your profile and geolocalization'),
			iconId: this.icons.profile.iconId,
			src: this.icons.profile.src,
			status: 'not-available',
			tasks: [
				{
					title: this.translate.instant('Profile'),
					help: this.translate.instant('Complete your user profile information to proceed with the verification step.'),
					href: '/me/edit',
					status: 'not-available'
				},
				{
					title: this.translate.instant('Geolocalization'),
					help: this.translate.instant('Complete your geolocalization information to proceed with the verification step.'),
					href: '/me/geoloc',
					status: 'not-available'
				}
			]
		};

		const stepVerify: Step = {
			id: 'verify',
			title: this.translate.instant('Verify'),
			description: this.translate.instant('TODO'),
			iconId: this.icons.verify.iconId,
			src: this.icons.verify.src,
			status: 'not-available',
			tasks: [
				{
					title: this.translate.instant('Admins'),
					help: this.translate.instant('Insert at least 3 organization admins. These admins will be required to manage received donations. The admins must sign up with the emails provided in the verification process.'),
					href: '/me/verify',
					status: 'not-available'
				},
				{
					title: this.translate.instant('Statute'),
					help: this.translate.instant('Upload your organization related document to get verified as an organization.'),
					href: '/me/verify',
					status: 'not-available'
				},
				{
					title: this.translate.instant('Memorandum'),
					help: this.translate.instant('Upload your organization related document to get verified as an organization.'),
					href: '/me/verify',
					status: 'not-available'
				},
				{
					title: this.translate.instant('Geoverification'),
					help: this.translate.instant("Request your code via snail mail, to verify your headquarter's position. We will send you a code to your postal address. When you receive it, insert the code in the geoverification process."),
					href: '/me/verify',
					status: 'not-available'
				}
			]
		};

		const stepAdmins: Step = {
			id: 'admins',
			title: this.translate.instant('Admins'),
			description: this.translate.instant('TODO'),
			iconId: this.icons.admins.iconId,
			src: this.icons.admins.src,
			status: 'not-available',
			tasks: [
				{
					title: this.translate.instant('Admin 1'),
					help: '',
					href: '/me/admin',
					status: 'not-available'
				},
				{
					title: this.translate.instant('Admin 2'),
					help: '',
					href: '/me/admin',
					status: 'not-available'
				},
				{
					title: this.translate.instant('Admin 3'),
					help: '',
					href: '/me/admin',
					status: 'not-available'
				},
			]
		};

		const stepWallet: Step = {
			id: 'wallet',
			title: this.translate.instant('Wallet'),
			description: this.translate.instant('TODO'),
			iconId: this.icons.wallet.iconId,
			src: this.icons.wallet.src,
			status: 'not-available',
			tasks: [
				{
					title: this.translate.instant('Create'),
					help: this.translate.instant('Create now a wallet for receiving donations.'),
					href: '/me/wallet',
					status: 'not-available'
				},
				{
					title: this.translate.instant('Signatures'),
					help: this.translate.instant('The wallet has been created; you should wait for admins signatures.'),
					status: 'not-available'
				}
			]
		};

		const stepProject: Step = {
			id: 'project',
			title: this.translate.instant('Project'),
			description: this.translate.instant('TODO'),
			iconId: this.icons.project.iconId,
			src: this.icons.project.src,
			status: 'not-available',
			tasks: [
				{
					title: this.translate.instant('Create'),
					help: this.translate.instant('Create now a project.'),
					href: '/project/create',
					status: 'not-available'
				},
				{
					title: this.translate.instant('Approved'),
					help: this.translate.instant('Wait until the project will be approved.'),
					href: '/project/create',
					status: 'not-available'
				}
			]
		};

		this.steps = [
			stepBasic,
			stepVerify,
			stepAdmins,
			stepWallet,
			stepProject
		];
	}

	getSteps(): Step[] {
		return [...this.steps];
	}

	private invalidateStepsAfter(i: number) {
		for (let j = i + 1; j < this.steps.length; j++) {
			this.setStepStatus(j, 'not-available');
		}
	}
	private setStepStatus(i, status) {
		this.steps[i].status = status;
		for (let z = 0; z < this.steps[i].tasks.length; z++)
			this.steps[i].tasks[z].status = status;
	}


	update(user: UserPrivate) {
		// Basic profile info
		this.setStepStatus(0, 'inprogress');

		this.dashboardService.getVerify(true).subscribe((data: UserVerify) => {
			this.setStepStatus(0, 'completed');
			this.setStepStatus(1, 'inprogress');

			// Verifications
			data.verification.forEach(v => {
				switch (v.provider) {
					case 'otc':
						if (v.state == 'accepted')
							this.steps[1].tasks[3].status = 'completed';
						break;
					case 'npostatute':
						if (v.state == 'accepted')
							this.steps[1].tasks[1].status = 'completed';
						break;
					case 'npomemorandum':
						if (v.state == 'accepted')
							this.steps[1].tasks[2].status = 'completed';
						break;
					case 'npoadmins':
						if (v.state == 'accepted') {
							this.steps[1].tasks[0].status = 'completed';
							this.setStepStatus(2, 'inprogress');

							const admins: { firstname: string; lastname: string; email: string }[]
								= data.verification.filter(v => v.provider == 'npoadmins')[0].info.admins;

							let i = 0;
							for (let admin of admins) {
								this.steps[2].tasks[i].title = admin.firstname + ' ' + admin.lastname;
								this.steps[2].tasks[i].help = interpolateString(
									this.translate.instant('The admin {{firstname}} {{lastname}} should register as single user on Helperbit using the email {{email}} and should complete the ID verification'), admin);

								if (user.admins.indexOf(admin.email) != -1) {
									this.steps[2].tasks[i].status = 'completed';
								}
								i += 1;
							}

							if (user.admins.length >= 3) {
								this.steps[2].status = 'completed';
							}
						}
						break;
				}
			});

			if (data.verification.filter(v => v.state == 'accepted').length != 4) {
				this.onUpdate.emit(false);
				return;
			}

			// Admins
			this.setStepStatus(1, 'completed');

			if (user.admins.length < 3) {
				this.onUpdate.emit(false);
				return;
			}

			this.setStepStatus(2, 'completed');
			this.setStepStatus(3, 'inprogress');

			// Wallet
			this.walletService.getList(true).subscribe(list => {
				let hasWallet = false;

				if (list.wallets.length > 0) {
					if (list.receiveaddress != '' && list.receiveaddress != null) {
						this.steps[3].status = 'completed';
						this.steps[3].tasks[0].status = 'completed';
						this.steps[3].tasks[1].status = 'completed';
						hasWallet = true;
					}
					else {
						this.steps[3].tasks[0].status = 'completed';
						this.steps[3].tasks[1].status = 'inprogress';
					}
				}
				else {
					this.steps[3].tasks[0].status = 'inprogress';
					this.steps[3].tasks[1].status = 'not-available';
				}


				if (!hasWallet) {
					this.onUpdate.emit(false);
					return;
				}

				this.setStepStatus(4, 'inprogress');

				// Project
				this.dashboardService.getProjects(true).subscribe(data => {
					if (data.projects.length > 0) {
						if (data.projects.filter(project => project.status == 'approved').length > 0) {
							this.steps[4].status = 'completed';
							this.steps[4].tasks[0].status = 'completed';
							this.steps[4].tasks[1].status = 'completed';
							this.onUpdate.emit(true);
						}
						else {
							this.steps[4].tasks[0].status = 'completed';
							this.steps[4].tasks[1].status = 'inprogress';
							this.onUpdate.emit(false);
						}
					}
					else {
						this.steps[4].tasks[0].status = 'inprogress';
						this.steps[4].tasks[1].status = 'not-available';
						this.onUpdate.emit(false);
					}
				}, res => {
					this.steps[4].tasks[0].status = 'not-available';
					this.steps[4].tasks[1].status = 'not-available';
					this.onUpdate.emit(false);
				});
			}, res => { });
		}, d => {
			const res = d.error;

			if (res.error != 'EV1')
				return;

			let profileCompleted = true;
			let geolocalizationCompleted = true;
			let i = 0;

			while (i < res.data.fields.length - 1 && (profileCompleted || geolocalizationCompleted)) {
				if (AppSettings.verify.errors.profile.indexOf(res.data.fields[i]) != -1)
					profileCompleted = false;

				if (AppSettings.verify.errors.geolocalization.indexOf(res.data.fields[i]) != -1)
					geolocalizationCompleted = false;

				i++;
			}

			if (!profileCompleted)
				this.steps[0].tasks[0].status = 'inprogress';
			else
				this.steps[0].tasks[0].status = 'completed';

			if (!geolocalizationCompleted)
				this.steps[0].tasks[1].status = 'inprogress';
			else
				this.steps[0].tasks[1].status = 'completed';

			this.invalidateStepsAfter(0);
			this.onUpdate.emit(false);
		});
	}
}