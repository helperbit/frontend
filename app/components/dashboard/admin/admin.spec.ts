import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TooltipDirective } from 'app/shared/directives/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MockTranslateService, MockDashboardService } from 'app/shared/helpers/mocks';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MeAdminComponent } from './admin';
import { PageHeaderComponent } from 'app/shared/components/page-header/page-header';
import { DashboardService } from 'app/models/dashboard';
import { RouterTestingModule } from '@angular/router/testing';
import AppSettings from 'app/app.settings';



describe('MeAdminComponent (isolated test)', () => {
	let component: MeAdminComponent;

	beforeEach(() => {
		component = new MeAdminComponent(null, new MockTranslateService as any);
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
});



describe('MeAdminComponent (shallow test)', () => {
	let component: MeAdminComponent;
	let fixture: ComponentFixture<MeAdminComponent>;
	let mockDashboardService: MockDashboardService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MeAdminComponent, TooltipDirective],
			providers: [
				{ provide: DashboardService, useClass: MockDashboardService }
			],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot()]
		}).compileComponents();
		mockDashboardService = TestBed.get(DashboardService) as MockDashboardService;

		mockDashboardService._setMockAdmins({
			admins: ['cino@riccio.it', 'cino2@riccio.it'],
			adminsusers: [
				{ username: 'cinoppo', email: 'cino@riccio.it', trustlevel: 2 },
				{ username: 'cinoppolo', email: 'cino2@riccio.it', trustlevel: 28 },
			],
			allowedadmins: []
		});
		mockDashboardService._setMockVerify({
			verification: [
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
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MeAdminComponent);
		component = fixture.componentInstance;
	});

	it('should instantiate', () => {
		fixture.detectChanges();
		expect(component).toBeDefined();
	});

	it('should render admin status correctly', () => {
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelectorAll('.panel-heading').length).toBe(3);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.state-none').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.state-signed').length).toBe(1);
		expect(fixture.debugElement.nativeElement.querySelectorAll('.state-verified').length).toBe(1);
	});
});



describe('MeAdminComponent (integrated test)', () => {
	let component: MeAdminComponent;
	let fixture: ComponentFixture<MeAdminComponent>;
	let httpMock: HttpTestingController;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MeAdminComponent, TooltipDirective, PageHeaderComponent],
			providers: [DashboardService],
			imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
		httpMock = TestBed.get(HttpTestingController);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MeAdminComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should initialize data from services', () => {
		httpMock.expectOne(AppSettings.apiUrl + '/me/admin')
			.flush({
				admins: ['cino@riccio.it', 'cino2@riccio.it'],
				adminsusers: [
					{ username: 'cinoppo', email: 'cino@riccio.it', trustlevel: 2 },
					{ username: 'cinoppolo', email: 'cino2@riccio.it', trustlevel: 28 },
				],
				allowedadmins: []
			});
		httpMock.expectOne(AppSettings.apiUrl + '/me/verify')
			.flush({
				verification: [
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
		expect(component.admins.filter(v => v.email == 'cino@riccio.it')[0].status)
			.toEqual('signed');
		expect(component.admins.filter(v => v.email == 'cino2@riccio.it')[0].status)
			.toEqual('verified');
		expect(component.admins.filter(v => v.email == 'cino3@riccio.it')[0].status)
			.toEqual('none');
	});
});
