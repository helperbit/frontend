import { CookieConsentComponent } from './cookie-consent';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('CookieConsentComponent (isolated test)', () => {
	let component: CookieConsentComponent;

	beforeEach(() => {
		window.localStorage.removeItem('cookie-consent-accepted');
		component = new CookieConsentComponent();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should have showBanner true', () => {
		expect(component.showBanner).toBe(true);
	});

	it('should update showBanner', () => {
		component.accept();
		expect(component.showBanner).toBe(false);
	});
});



describe('CookieConsentComponent (shallow test)', () => {
	let component: CookieConsentComponent;
	let fixture: ComponentFixture<CookieConsentComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CookieConsentComponent],
			providers: [],
			imports: [TranslateModule.forRoot()]
		}).compileComponents();
	}));

	beforeEach(() => {
		window.localStorage.removeItem('cookie-consent-accepted');
		fixture = TestBed.createComponent(CookieConsentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should display banner', () => {
		expect(fixture.nativeElement.querySelector('.alert-dismissible')).toBeDefined();
	});

	it('should hide banner on button accept', () => {
		fixture.nativeElement.querySelector('.btn').click();
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('.alert-dismissible')).toBeNull();
	});
});

