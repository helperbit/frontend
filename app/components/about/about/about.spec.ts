import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AboutComponent } from './about';
import { RouterTestingModule } from '@angular/router/testing';
import { AboutSectionAwardComponent } from './sections/award';
import { AboutSectionContactComponent } from './sections/contact';
import { AboutSectionPartnersComponent } from './sections/partners';
import { AboutSectionPressComponent } from './sections/press';
import { AboutSectionTopComponent } from './sections/top';
import { AboutSectionWhyhelperbitComponent } from './sections/whyhelperbit';
import { AboutSectionWhysignupComponent } from './sections/whysignup';
import { AboutSectionTeamComponent } from './sections/team';
import { AboutSectionBenefitComponent } from './sections/benefit';
import { SeoFooterComponent } from 'app/components/parts/seofooter/seofooter';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MetaModule } from 'ng2-meta';
import { MockActivatedRoute } from 'app/shared/helpers/mocks';
import { ActivatedRoute } from '@angular/router';

describe('AboutComponent (isolated test)', () => {
	let component: AboutComponent;

	beforeEach(() => {
		component = new AboutComponent(null);
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
});


describe('AboutComponent (shallow test)', () => {
	let component: AboutComponent;
	let fixture: ComponentFixture<AboutComponent>;
	let mockActivatedRoute: ActivatedRoute;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AboutComponent],
			// providers: [ { provider: ActivatedRoute, useClass: MockActivatedRoute } ],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot(), RouterTestingModule]
		}).compileComponents();
		mockActivatedRoute = TestBed.get(ActivatedRoute);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AboutComponent);
		component = fixture.componentInstance;
	});

	it('should instantiate', () => {
		fixture.detectChanges();
		expect(component).toBeDefined();
		mockActivatedRoute.snapshot.fragment = 'whysignup';
	});

	it('should scroll to fragment (call scroll to)', () => {
		spyOn(component, 'scrollTo');
		mockActivatedRoute.snapshot.fragment = 'whysignup';
		fixture.detectChanges();
		expect(component.scrollTo).toHaveBeenCalled();
	});

	it('should scroll to fragment', () => {
		mockActivatedRoute.snapshot.fragment = 'team';
		fixture.detectChanges();
		// expect(fixture.nativeElement.scrollTop).toEqual(50);
	});
});


describe('AboutComponent (integrated test)', () => {
	let component: AboutComponent;
	let fixture: ComponentFixture<AboutComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AboutComponent, AboutSectionAwardComponent, AboutSectionBenefitComponent,
				AboutSectionContactComponent, AboutSectionPartnersComponent, AboutSectionPressComponent,
				AboutSectionTeamComponent, AboutSectionTopComponent, AboutSectionWhyhelperbitComponent,
				AboutSectionWhysignupComponent],
			providers: [],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [RouterTestingModule, HttpClientTestingModule, MetaModule.forRoot(), TranslateModule.forRoot()]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AboutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
});