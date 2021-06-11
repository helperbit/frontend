import { CurrencyService } from 'app/services/currency';
import { MoneyUSDPipe } from './moneyUSD';
import { MockCurrencyService } from '../helpers/mocks';

describe('MoneyUSDPipe', () => {
	const pipe = new MoneyUSDPipe((new MockCurrencyService as unknown) as CurrencyService);

	it('should return usd value', async () => {
		expect(pipe.transform(12.564)).toBe('12.56$');
	});
});
