import { MoneyFIATPipe } from './moneyFIAT';

describe('MoneyFIATPipe', () => {
	const pipe = new MoneyFIATPipe();

	it('should return a valid eur string', async () => {
		expect(pipe.transform(12.564, 'EUR')).toBe('12.56 \u20AC');
	});

	it('should return a valid usd string', async () => {
		expect(pipe.transform(12.5, 'USD')).toBe('12.50 \u0024');
	});
});
