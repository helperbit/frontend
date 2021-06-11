import { MoneyToBTCPipe } from './money-to-btc';
import { CurrencyService } from 'app/services/currency';
import { MockCurrencyService } from '../helpers/mocks';

describe('MoneyToBTCPipe', () => {
	const pipe = new MoneyToBTCPipe((new MockCurrencyService as unknown) as CurrencyService);

	it('should return btc with the same value', async () => {
		expect(pipe.transform(12.564, 'BTC')).toBe(12.564);
	});

	it('should return 0 if the currency is not supported', async () => {
		expect(pipe.transform(12.564, 'CNY')).toBe(0);
	});

	it('should return the number converted to EUR', async () => {
		expect(pipe.transform(12, 'EUR')).toBe(12/3);
	});

	it('should return the number converted to USD', async () => {
		expect(pipe.transform(12, 'USD')).toBe(12/2);
	});
});
