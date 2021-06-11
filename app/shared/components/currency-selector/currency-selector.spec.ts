import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CurrencySelectorComponent } from './currency-selector';
import { MockCurrencyService } from 'app/shared/helpers/mocks';
import { CurrencyService } from 'app/services/currency';
import { SimpleChange } from '@angular/core';


describe('CurrencySelectorComponent (isolated test)', () => {
	let component: CurrencySelectorComponent;
	let currencyService: CurrencyService;

	beforeEach(() => {
		currencyService = new MockCurrencyService() as CurrencyService;
		component = new CurrencySelectorComponent(currencyService);
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should set currency', () => {
		component.changeCurrency('EUR');
		expect(currencyService.getCurrencyCode()).toBeDefined('EUR');
	});
});



describe('CurrencySelectorComponent (shallow test)', () => {
	let component: CurrencySelectorComponent;
	let fixture: ComponentFixture<CurrencySelectorComponent>;
	let currencyService: CurrencyService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CurrencySelectorComponent],
			providers: [
				{ provide: CurrencyService, useClass: MockCurrencyService }
			],
			// schemas: [NO_ERRORS_SCHEMA],
			imports: []
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CurrencySelectorComponent);
		component = fixture.componentInstance;
		currencyService = TestBed.get(CurrencyService);
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});

	it('should display 3 buttons', () => {
		expect(fixture.debugElement.nativeElement.querySelectorAll('button').length).toBe(3);
	});

	it('should have USD selected', () => {
		let button;
		button = fixture.debugElement.nativeElement.querySelector('.active');
		expect(button.querySelectorAll('.fa-dollar').length).toBe(1);
	});

	it('should detect currency change', () => {
		let button;
		button = fixture.debugElement.nativeElement.querySelector('.active');
		expect(button.querySelectorAll('.fa-dollar').length).toBe(1);
		currencyService.setCurrency('BTC');
		fixture.detectChanges();
		button = fixture.debugElement.nativeElement.querySelector('.active');
		expect(button.querySelectorAll('.fa-bitcoin').length).toBe(1);
	});

	it('should set the correct border', () => {
		expect(fixture.debugElement.nativeElement.querySelector('.active').style.border).toBe('');

		component.border = 'white';
		component.ngOnChanges({ border: new SimpleChange(null, component.border, true) });
		fixture.detectChanges();

		expect(fixture.debugElement.nativeElement.querySelector('.active').style.border).toBe('1px solid rgb(255, 255, 255)');
	});

	it('should change currency on click', () => {
		let button;
		button = fixture.debugElement.nativeElement.querySelector('.active');
		expect(button.querySelectorAll('.fa-dollar').length).toBe(1);
		
		button = fixture.debugElement.nativeElement.querySelector('.fa-bitcoin').click();

		fixture.detectChanges();
		button = fixture.debugElement.nativeElement.querySelector('.active');
		expect(button.querySelectorAll('.fa-bitcoin').length).toBe(1);
	});
});



describe('CurrencySelectorComponent (integrated test)', () => {
	let component: CurrencySelectorComponent;
	let fixture: ComponentFixture<CurrencySelectorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CurrencySelectorComponent],
			providers: [
				CurrencyService,
			],
			imports: [] // HttpClientModule]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CurrencySelectorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should instantiate', () => {
		expect(component).toBeDefined();
	});
});
