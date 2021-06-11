import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginComponent } from './login';
import { MockTranslateService, MockEmptyService, MockAuthService, MockCookieService, MockUtilsService, MockActivatedRoute, MockRouter } from 'app/shared/helpers/mocks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { ModelsModule } from 'app/models/models.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedFormExModule } from 'app/shared/shared.formex.module';
import { DashboardService } from 'app/models/dashboard';
import { AuthService } from 'app/models/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from 'app/services/utils';
import { CookieService } from 'ngx-cookie-service';
import { FormlyInit2Service } from 'app/services/formly-init2';
import { FormlyFieldRecaptcha } from 'app/shared/ngx-formly/fields/recaptcha/recaptcha';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { FormlyWrapperFormField } from 'app/shared/ngx-formly/wrapper/form-field';
import AppSettings from 'app/app.settings';

describe('LoginComponent (isolated test)', () => {
	let component: LoginComponent;

	beforeEach(() => {
		component = new LoginComponent(null, null, null, null, null, null, new MockTranslateService() as any);
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	// it('should run socialLogin', () => {
	// 	expect(component.socialLogin('facebook')).toBeUndefined();
	// });
});



describe('LoginComponent (shallow test)', () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;
	let mockActivatedRoute: MockActivatedRoute;
	let mockAuthService: MockAuthService;

	beforeEach(async(() => {
		AppSettings.features.captcha = false;

		TestBed.configureTestingModule({
			declarations: [LoginComponent, FormlyFieldRecaptcha, FormlyWrapperFormField],
			providers: [
				{ provide: DashboardService, useClass: MockEmptyService },
				{ provide: AuthService, useClass: MockAuthService },
				{ provide: Router, useClass: MockRouter },
				{ provide: ActivatedRoute, useClass: MockActivatedRoute },
				{ provide: UtilsService, useClass: MockUtilsService },
				{ provide: CookieService, useClass: MockCookieService },
				FormlyInit2Service
			],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslateModule.forRoot(), FormsModule, ReactiveFormsModule,
				FormlyModule.forRoot(), FormlyBootstrapModule
			],
		}).overrideModule(BrowserDynamicTestingModule, {
			set: {
				entryComponents: [FormlyFieldRecaptcha, FormlyWrapperFormField],
			}
		}).compileComponents();
		mockActivatedRoute = TestBed.get(ActivatedRoute);
		mockAuthService = TestBed.get(AuthService);
		TestBed.get(FormlyInit2Service).init();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;
		window.localStorage.clear();
		// mockRouter.setQueryParamMap
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should display all form inputs', () => {
		const inputs = fixture.debugElement.nativeElement.querySelectorAll('input');

		expect(fixture.debugElement.nativeElement.querySelector('button[type="submit"]')).toBeDefined();
		expect(fixture.debugElement.nativeElement.querySelector('button[type="submit"]:disabled')).toBeDefined();
		expect(inputs.length).toBe(2);
		// expect(inputs[0].getAttribute('placeholder').toLowercase()).toContain('username');
		// expect(inputs[1].getAttribute('placeholder').toLowercase()).toContain('password');
	});

	it('should login', () => {
		const inputs = fixture.debugElement.nativeElement.querySelectorAll('input');

		expect(fixture.debugElement.nativeElement.querySelector('button[type="submit"]:disabled')).toBeDefined();
		inputs[0].value = 'pino';
		inputs[0].dispatchEvent(new Event('input'));
		inputs[1].value = 'pawword';
		inputs[1].dispatchEvent(new Event('input'));
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelector('button[type="submit"]:disabled')).toBeNull();
		expect(fixture.debugElement.nativeElement.querySelector('button[type="submit"]')).toBeDefined();
		fixture.debugElement.nativeElement.querySelector('button[type="submit"]').click();

		mockAuthService.onLoginStatusChange.subscribe(v => {
			expect(v).toBeTrue();
		});

		fixture.detectChanges();
		expect(window.localStorage.getItem('username')).toBe('pino');
		expect(window.localStorage.getItem('token')).toBeDefined();
	});

	it('should handle failed login (wrong username)', () => {
		const inputs = fixture.debugElement.nativeElement.querySelectorAll('input');

		expect(fixture.debugElement.nativeElement.querySelector('button[type="submit"]:disabled')).toBeDefined();
		inputs[0].value = 'pinoerror';
		inputs[0].dispatchEvent(new Event('input'));
		inputs[1].value = 'pawword';
		inputs[1].dispatchEvent(new Event('input'));
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelector('button[type="submit"]:disabled')).toBeNull();
		expect(fixture.debugElement.nativeElement.querySelector('button[type="submit"]')).toBeDefined();
		fixture.debugElement.nativeElement.querySelector('button[type="submit"]').click();

		mockAuthService.onLoginStatusChange.subscribe(v => {
			expect(v).toBeFalse();
		});

		fixture.detectChanges();
		expect(window.localStorage.getItem('username')).toBeNull();
		expect(window.localStorage.getItem('token')).toBeNull();
	});

	it('should handle failed login (wrong password)', () => {
		const inputs = fixture.debugElement.nativeElement.querySelectorAll('input');

		expect(fixture.debugElement.nativeElement.querySelector('button[type="submit"]:disabled')).toBeDefined();
		inputs[0].value = 'pino';
		inputs[0].dispatchEvent(new Event('input'));
		inputs[1].value = 'pawworderror';
		inputs[1].dispatchEvent(new Event('input'));
		fixture.detectChanges();
		expect(fixture.debugElement.nativeElement.querySelector('button[type="submit"]:disabled')).toBeNull();
		expect(fixture.debugElement.nativeElement.querySelector('button[type="submit"]')).toBeDefined();
		fixture.debugElement.nativeElement.querySelector('button[type="submit"]').click();

		mockAuthService.onLoginStatusChange.subscribe(v => {
			expect(v).toBeFalse();
		});

		fixture.detectChanges();
		expect(window.localStorage.getItem('username')).toBeNull();
		expect(window.localStorage.getItem('token')).toBeNull();
	});
});



describe('LoginComponent (integrated test)', () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;
	let httpMock: HttpTestingController;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [LoginComponent],
			providers: [
				FormlyInit2Service,
				{ provide: UtilsService, useClass: MockUtilsService },
				{ provide: Router, useClass: MockRouter },
				{ provide: ActivatedRoute, useClass: MockActivatedRoute }
			],
			imports: [HttpClientTestingModule, TranslateModule.forRoot(),
				FormsModule, ReactiveFormsModule, FormlyModule.forRoot(),
				FormlyBootstrapModule, ModelsModule, SharedFormExModule
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
		httpMock = TestBed.get(HttpTestingController);
		TestBed.get(FormlyInit2Service).init();
		window.localStorage.clear();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LoginComponent);
		fixture.detectChanges();
	});

	// it('should instantiate', () => {
	// 	expect(component).toBeDefined();
	// });

	// 	// it('should initialize balance', () => {
	// 	// 	httpMock.expectOne(AppSettings.apiUrl + '/wallet/1MN/balance')
	// 	// 		.flush({ balance: 1, received: 2, unconfirmed: 3 });

	// 	// 	fixture.detectChanges();
	// 	// 	expect(component.balance).toEqual({ balance: 1, received: 2, unconfirmed: 3 });
	// 	// });
});
