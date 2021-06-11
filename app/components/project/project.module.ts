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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ProjectComponent } from './project/project';
import { MoneyToBTCPipe } from '../../shared/filters/money-to-btc';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectTableComponent } from './table/table';
import { ProjectCreateComponent } from './create/create';
import { RouterModule } from '@angular/router';
import { MetaGuard } from 'ng2-meta';
import { AuthGuard } from 'app/shared/helpers/auth-guard';
import { EditProjectComponent } from './edit/edit';
import { ArchwizardModule } from 'angular-archwizard';
import { FormlyModule } from '@ngx-formly/core';
import { NgbModalModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SharedFormExModule } from 'app/shared/shared.formex.module';
import { SharedMediaModule } from 'app/shared/shared.media';
import { ModalActivityComponent } from './edit/activity/activity';
import { ProjectTimelineComponent } from './project/timeline/timeline';
import { StranslatePipe } from 'app/shared/filters/stranslate';
import { EmbedVideo } from 'ngx-embed-video';


// { path: ':id/edit/:targetCompleted?', {
// 	template: '<project-edit-component></project-edit-component>',
// 	data: {
// 		meta: {
// 			'title': 'Edit Project',
// 			'footerName': 'Projects',
// 			'showWizardProcedure': true
// 		},
// 		auth: {
// 			status: 'logged',
// 			allowedUserType: ['npo', 'municipality', 'company'],
// 			redirect: {
// 				default: '/auth/login',
// 				wrongUserType: '/user/me'
// 			}
// 		}
// 	}
// },

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'list',
				component: ProjectTableComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Project table',
						'footerName': 'Project list',
					}
				}
			},
			{
				path: 'list/:page',
				component: ProjectTableComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Project table',
						'footerName': 'Project list',
					}
				}
			},
			{
				path: 'create',
				component: ProjectCreateComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Your projects',
						'footerName': 'Projects',
						'showWizardProcedure': true
					},
					auth: {
						status: 'logged',
						allowedUserType: ['npo', 'municipality', 'company'],
						redirect: {
							default: '/auth/login',
							wrongUserType: '/user/me'
						}
					}
				}
			},
			{
				path: ':id/edit',
				component: EditProjectComponent,
				canActivate: [MetaGuard, AuthGuard],
				data: {
					meta: {
						'title': 'Edit Project',
						'footerName': 'Edit Project',
						'showWizardProcedure': true
					},
					auth: {
						status: 'logged',
						allowedUserType: ['npo', 'municipality', 'company'],
						redirect: {
							default: '/auth/login',
							wrongUserType: '/user/me'
						}
					}
				}
			},
			{
				path: ':id',
				component: ProjectComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Project',
						'footerName': 'Project',
					}
				}
			},
			{
				path: ':id/:seotext',
				component: ProjectComponent,
				canActivate: [MetaGuard],
				data: {
					meta: {
						'title': 'Project',
						'footerName': 'Project',
					}
				}
			}
		]),
		CommonModule,
		SharedModule,
		SharedFormExModule,
		FormsModule,
		ReactiveFormsModule,
		FormlyModule,
		NgbModalModule,
		NgbTabsetModule,
		ArchwizardModule,
		TranslateModule,
		SharedFormExModule,
		SharedMediaModule,
		EmbedVideo.forRoot()
	],
	exports: [
		RouterModule,

		ProjectComponent,
		ProjectTimelineComponent,
		ProjectTableComponent,
		ProjectCreateComponent,
		EditProjectComponent,
		ModalActivityComponent
	],
	declarations: [
		ProjectComponent,
		ProjectTimelineComponent,
		ProjectTableComponent,
		ProjectCreateComponent,
		EditProjectComponent,
		ModalActivityComponent
	],
	entryComponents: [
		ModalActivityComponent
	],
	providers: [
		MoneyToBTCPipe,
		StranslatePipe
	]
})
export class ProjectModule {
	constructor() { }
} 