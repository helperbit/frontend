import { TestBed } from '@angular/core/testing';
import { CurrencyService } from './currency';

describe('CurrencyService', () => {
	let currencyService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
			],
			providers: [
				CurrencyService
			]
		});
		currencyService = TestBed.get(CurrencyService);
	});

	it('should istantiate', () => {
		expect(currencyService).toBeDefined();
	});

	it('should detect currency', () => {
		expect(currencyService.detectCurrency().code).toBe('USD');
	});

	it('should return currency', () => {
		currencyService.detectCurrency();
		expect(currencyService.getCurrencyCode()).toBe('USD');
		expect(currencyService.getCurrency()).toEqual({ code: 'USD', name: 'dollar', symbol: '$', value: 0 });
	});

	it('should set currency', () => {
		currencyService.detectCurrency();
		expect(currencyService.getCurrencyCode()).toBe('USD');
		currencyService.setCurrency('EUR');
		expect(currencyService.getCurrencyCode()).toBe('EUR');
		currencyService.setCurrency('USD');
	});
});
