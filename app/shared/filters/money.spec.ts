import { CurrencyService } from 'app/services/currency';
import { MoneyPipe } from './money';
import { MockCurrencyService } from '../helpers/mocks';

describe('MoneyPipe', () => {
	const pipe = new MoneyPipe((new MockCurrencyService as unknown) as CurrencyService);

	it('should return the currency symbol', async () => {
		expect(pipe.transform(null, 0, true)).toBe('$');
	});

	it('should convert btc to usd', async () => {
		expect(pipe.transform(2, 'auto')).toBe('4.00 $');
	});

	it('should convert usd to btc', async () => {
		expect(pipe.transform(2, 'auto', true, true)).toBe('1.00 $');
	});
});
