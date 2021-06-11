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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { WalletService } from 'app/models/wallet';
import { MoneyPipe } from 'app/shared/filters/money';
import { TooltipDirective } from 'app/shared/directives/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockWalletService, MockTranslateService, MockDashboardService } from 'app/shared/helpers/mocks';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WizardProcedureComponent } from './wizard-procedure';
import { DashboardService } from 'app/models/dashboard';
import { SVGIconComponent } from '../svg-icon/svg-icon';
import { RouterTestingModule } from '@angular/router/testing';
import { AppSettings } from 'app/app.settings';

describe('WizardProcedureComponent (isolated test)', () => {
	let component: WizardProcedureComponent;

	beforeEach(() => {
		component = new WizardProcedureComponent(null, null, (new MockTranslateService) as any);
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should return the correct task tooltip', () => {
		expect(component.getTooltipOfTask({ status: 'inprogress', help: 'ciao' })).toBe('ciao');
		expect(component.getTooltipOfTask({ status: 'completed', help: 'ciao' })).toBe('Completed!');
		expect(component.getTooltipOfTask({ status: '', help: 'ciao' })).toBe('');
	});
});



describe('WizardProcedureComponent (shallow test)', () => {
	let component: WizardProcedureComponent;
	let fixture: ComponentFixture<WizardProcedureComponent>;
	let mockDashboardService: MockDashboardService;
	let mockWalletService: MockWalletService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WizardProcedureComponent, SVGIconComponent, TooltipDirective],
			providers: [
				{ provide: WalletService, useClass: MockWalletService },
				{ provide: DashboardService, useClass: MockDashboardService },
				{ provide: TranslateService, useClass: MockTranslateService }
			],
			// schemas: [NO_ERRORS_SCHEMA],
			imports: [RouterTestingModule, TranslateModule.forRoot()]
		}).compileComponents();
		mockDashboardService = TestBed.get(DashboardService);
		mockWalletService = TestBed.get(WalletService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WizardProcedureComponent);
		component = fixture.componentInstance;
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
		fixture.detectChanges();
	});

	it('should hide on singleuser', () => {
		mockDashboardService._setMockUser({ usertype: 'singleuser' });
		fixture.detectChanges();
		expect(component.show).toBeFalse();
		expect(fixture.debugElement.nativeElement.querySelector('.wrapper.hidden')).toBeDefined();
	});

	it('should hide on company', () => {
		mockDashboardService._setMockUser({ usertype: 'company' });
		fixture.detectChanges();
		expect(component.show).toBeFalse();
		expect(fixture.debugElement.nativeElement.querySelector('.wrapper.hidden')).toBeDefined();
	});

	it('should update onProfileUpdate', () => {
		expect(component.initialization).toBeTrue();
		mockDashboardService._setMockUser({ usertype: 'company' });
		fixture.detectChanges();
		expect(component.initialization).toBeFalse();
		expect(component.show).toBeFalse();
		expect(fixture.debugElement.nativeElement.querySelector('.wrapper.hidden')).toBeDefined();
		mockDashboardService.onProfileUpdate.emit();
		fixture.detectChanges();
		expect(component.show).toBeFalse();
		expect(fixture.debugElement.nativeElement.querySelector('.wrapper.hidden')).toBeDefined();
	});

	it('should show on npo', () => {
		mockDashboardService._setMockUser({ usertype: 'npo' });
		mockDashboardService._setMockVerifyError({
			fields: ['fullname']
		});
		fixture.detectChanges();
		expect(component.show).toBeTrue();
		expect(fixture.debugElement.nativeElement.querySelector('.wrapper.hidden')).toBeDefined();
		expect(fixture.debugElement.nativeElement.querySelectorAll('.step').length).toBe(component.procedure.getSteps().length);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.inprogress').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.not-available').length).toBe(component.procedure.getSteps().length - 1);
	});

	it('should handle step basic - no geolocation and no information', () => {
		mockDashboardService._setMockUser({ usertype: 'npo' });
		mockDashboardService._setMockVerifyError({
			fields: AppSettings.verify.errors.profile.concat(AppSettings.verify.errors.geolocalization)
		});
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.edit').length).toBe(2);
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.success').length).toBe(0);
	});

	it('should handle step basic - no geolocation', () => {
		mockDashboardService._setMockUser({ usertype: 'npo' });
		mockDashboardService._setMockVerifyError({
			fields: ['city', 'street']
		});
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelector('li.edit').innerHTML).toContain('Geolocalization');
		expect(fixture.debugElement.nativeElement.querySelector('li.success').innerHTML).toContain('Profile');
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.edit').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.success').length).toBe(1);
	});

	it('should handle step basic - no information', () => {
		mockDashboardService._setMockUser({ usertype: 'npo' });
		mockDashboardService._setMockVerifyError({
			fields: ['operators', 'birthdate']
		});
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelector('li.success').innerHTML).toContain('Geolocalization');
		expect(fixture.debugElement.nativeElement.querySelector('li.edit').innerHTML).toContain('Profile');
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.edit').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.success').length).toBe(1);
	});

	it('should handle step verify - no verifications', () => {
		mockDashboardService._setMockUser({ usertype: 'npo' });
		mockDashboardService._setMockVerify({
			verification: []
		});
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.success')[1].innerHTML).toContain('Geolocalization');
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.success')[0].innerHTML).toContain('Profile');
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.edit').length).toBe(4);
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.success').length).toBe(2);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.inprogress').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.completed').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.not-available').length).toBe(component.procedure.getSteps().length - 2);
	});

	it('should handle step verify - one submitted and others no', () => {
		mockDashboardService._setMockUser({ usertype: 'npo' });
		mockDashboardService._setMockVerify({
			verification: [
				{
					provider: 'npoadmins',
					status: 'inprogress'
				}
			]
		});
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.edit').length).toBe(4);
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.success').length).toBe(2);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.inprogress').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.completed').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.not-available').length).toBe(component.procedure.getSteps().length - 2);
	});

	it('should handle step verify - one accepted and others no', () => {
		mockDashboardService._setMockUser({ usertype: 'npo' });
		mockDashboardService._setMockVerify({
			verification: [
				{
					provider: 'npomemorandum',
					state: 'accepted'
				}
			]
		});
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.success')[2].innerHTML).toContain('Memorandum');
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.edit').length).toBe(3);
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.success').length).toBe(3);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.inprogress').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.completed').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.not-available').length).toBe(component.procedure.getSteps().length - 2);
	});

	it('should handle step verify - admins accepted enables Admins step', () => {
		mockDashboardService._setMockUser({ usertype: 'npo', admins: [] });
		mockDashboardService._setMockVerify({
			verification: [
				{
					provider: 'npoadmins',
					state: 'accepted',
					info: {
						admins: [
							{ firstname: 'Cino', lastname: 'Riccio', email: 'cino@riccio.it' },
							{ firstname: 'Cino2', lastname: 'Riccio', email: 'cino2@riccio.it' },
							{ firstname: 'Cino3', lastname: 'Riccio', email: 'cino3@riccio.it' }
						]
					}
				}
			]
		});
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.success')[2].innerHTML).toContain('Admins');
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.edit').length).toBe(6);
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.success').length).toBe(3);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.inprogress').length).toBe(2);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.completed').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.not-available').length).toBe(component.procedure.getSteps().length - 3);
	});

	it('should handle step admins - none signed up', () => {
		mockDashboardService._setMockUser({ usertype: 'npo', admins: [] });
		mockDashboardService._setMockVerify({
			verification: [
				{
					provider: 'npostatute',
					state: 'accepted'
				},
				{
					provider: 'npomemorandum',
					state: 'accepted'
				},
				{
					provider: 'otc',
					state: 'accepted'
				},
				{
					provider: 'npoadmins',
					state: 'accepted',
					info: {
						admins: [
							{ firstname: 'Cino1', lastname: 'Riccio', email: 'cino@riccio.it' },
							{ firstname: 'Cino2', lastname: 'Riccio', email: 'cino2@riccio.it' },
							{ firstname: 'Cino3', lastname: 'Riccio', email: 'cino3@riccio.it' }
						]
					}
				}
			]
		});
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.edit')[0].innerHTML).toContain('Cino1');
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.edit')[1].innerHTML).toContain('Cino2');
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.edit')[2].innerHTML).toContain('Cino3');
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.edit').length).toBe(3);
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.success').length).toBe(6);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.inprogress').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.completed').length).toBe(2);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.not-available').length).toBe(component.procedure.getSteps().length - 3);
	});

	it('should handle step wallet - no actions done', () => {
		mockDashboardService._setMockUser({ usertype: 'npo', admins: ['cino@riccio.it', 'cino2@riccio.it', 'cino3@riccio.it'] });
		mockDashboardService._setMockVerify({
			verification: [
				{
					provider: 'npostatute',
					state: 'accepted'
				},
				{
					provider: 'npomemorandum',
					state: 'accepted'
				},
				{
					provider: 'otc',
					state: 'accepted'
				},
				{
					provider: 'npoadmins',
					state: 'accepted',
					info: {
						admins: [
							{ firstname: 'Cino1', lastname: 'Riccio', email: 'cino@riccio.it' },
							{ firstname: 'Cino2', lastname: 'Riccio', email: 'cino2@riccio.it' },
							{ firstname: 'Cino3', lastname: 'Riccio', email: 'cino3@riccio.it' }
						]
					}
				}
			]
		});
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.edit').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.success').length).toBe(9);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.inprogress').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.completed').length).toBe(3);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.not-available').length).toBe(1);
	});

	it('should handle step wallet - wallet creation started', () => {
		mockWalletService._setMockWalletList([{address: '12'}], null);
		mockDashboardService._setMockUser({ usertype: 'npo', receiveaddress: null, admins: ['cino@riccio.it', 'cino2@riccio.it', 'cino3@riccio.it'] });
		mockDashboardService._setMockVerify({
			verification: [
				{
					provider: 'npostatute',
					state: 'accepted'
				},
				{
					provider: 'npomemorandum',
					state: 'accepted'
				},
				{
					provider: 'otc',
					state: 'accepted'
				},
				{
					provider: 'npoadmins',
					state: 'accepted',
					info: {
						admins: [
							{ firstname: 'Cino1', lastname: 'Riccio', email: 'cino@riccio.it' },
							{ firstname: 'Cino2', lastname: 'Riccio', email: 'cino2@riccio.it' },
							{ firstname: 'Cino3', lastname: 'Riccio', email: 'cino3@riccio.it' }
						]
					}
				}
			]
		});
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.edit').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.success').length).toBe(10);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.inprogress').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.completed').length).toBe(3);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.not-available').length).toBe(1);
	});

	it('should handle step project - no project', () => {
		mockWalletService._setMockWalletList([{address: '12'}], '12');
		mockDashboardService._setMockUser({ usertype: 'npo', admins: ['cino@riccio.it', 'cino2@riccio.it', 'cino3@riccio.it'] });
		mockDashboardService._setMockVerify({
			verification: [
				{
					provider: 'npostatute',
					state: 'accepted'
				},
				{
					provider: 'npomemorandum',
					state: 'accepted'
				},
				{
					provider: 'otc',
					state: 'accepted'
				},
				{
					provider: 'npoadmins',
					state: 'accepted',
					info: {
						admins: [
							{ firstname: 'Cino1', lastname: 'Riccio', email: 'cino@riccio.it' },
							{ firstname: 'Cino2', lastname: 'Riccio', email: 'cino2@riccio.it' },
							{ firstname: 'Cino3', lastname: 'Riccio', email: 'cino3@riccio.it' }
						]
					}
				}
			]
		});
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.edit').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.success').length).toBe(11);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.inprogress').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.completed').length).toBe(4);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.not-available').length).toBe(0);
	});

	it('should handle step project - project created pending approval', () => {
		mockWalletService._setMockWalletList([{address: '12'}], '12');
		mockDashboardService._setMockUser({ usertype: 'npo', admins: ['cino@riccio.it', 'cino2@riccio.it', 'cino3@riccio.it'] });
		mockDashboardService._setMockVerify({
			verification: [
				{
					provider: 'npostatute',
					state: 'accepted'
				},
				{
					provider: 'npomemorandum',
					state: 'accepted'
				},
				{
					provider: 'otc',
					state: 'accepted'
				},
				{
					provider: 'npoadmins',
					state: 'accepted',
					info: {
						admins: [
							{ firstname: 'Cino1', lastname: 'Riccio', email: 'cino@riccio.it' },
							{ firstname: 'Cino2', lastname: 'Riccio', email: 'cino2@riccio.it' },
							{ firstname: 'Cino3', lastname: 'Riccio', email: 'cino3@riccio.it' }
						]
					}
				}
			]
		});
		mockDashboardService._setMockProjects([{
			status: 'submitted'
		}]);
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.edit').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.success').length).toBe(12);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.inprogress').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.completed').length).toBe(4);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.description.not-available').length).toBe(0);
	});

	it('should handle all steps done', () => {
		mockWalletService._setMockWalletList([{address: '12'}], '12');
		mockDashboardService._setMockUser({ usertype: 'npo', admins: ['cino@riccio.it', 'cino2@riccio.it', 'cino3@riccio.it'] });
		mockDashboardService._setMockVerify({
			verification: [
				{
					provider: 'npostatute',
					state: 'accepted'
				},
				{
					provider: 'npomemorandum',
					state: 'accepted'
				},
				{
					provider: 'otc',
					state: 'accepted'
				},
				{
					provider: 'npoadmins',
					state: 'accepted',
					info: {
						admins: [
							{ firstname: 'Cino1', lastname: 'Riccio', email: 'cino@riccio.it' },
							{ firstname: 'Cino2', lastname: 'Riccio', email: 'cino2@riccio.it' },
							{ firstname: 'Cino3', lastname: 'Riccio', email: 'cino3@riccio.it' }
						]
					}
				}
			]
		});
		mockDashboardService._setMockProjects([{
			status: 'approved'
		}]);
		fixture.detectChanges();
		expect(component.show).toBeFalse();
		expect(fixture.debugElement.nativeElement.querySelector('.wrapper.hidden')).toBeDefined();
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.edit').length).toBe(0);
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.success').length).toBe(13);
		expect(fixture.debugElement.nativeElement.querySelectorAll('li.not-available').length).toBe(0);
	});
});



describe('WizardProcedureComponent (integrated test)', () => {
	let component: WizardProcedureComponent;
	let fixture: ComponentFixture<WizardProcedureComponent>;
	let httpMock: HttpTestingController;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WizardProcedureComponent, MoneyPipe, SVGIconComponent, TooltipDirective],
			providers: [WalletService, DashboardService],
			imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()]
		}).compileComponents();
		httpMock = TestBed.get(HttpTestingController);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WizardProcedureComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	// it('should initialize balance', () => {
	// 	httpMock.expectOne(AppSettings.apiUrl + '/wallet/1MN/balance')
	// 		.flush({ balance: 1, received: 2, unconfirmed: 3 });

	// 	fixture.detectChanges();
	// 	expect(component.balance).toEqual({ balance: 1, received: 2, unconfirmed: 3 });
	// });
});
