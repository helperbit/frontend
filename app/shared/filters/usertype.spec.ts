import { UsertypePipe } from "./usertype";
import { TranslateService } from '@ngx-translate/core';
import { MockTranslateService } from '../helpers/mocks';


describe('UsertypePipe', () => {
	const pipe = new UsertypePipe(new MockTranslateService() as any);

	it('should return a valid type string', async () => {
		expect(pipe.transform('npo')).toBe('non-profit organization');
		expect(pipe.transform('npo', 'short')).toBe('npo');
		expect(pipe.transform('singleuser')).toBe('user');
		expect(pipe.transform({ username: 'mondingo', usertype: 'npo', subtype: 'none' })).toBe('non-profit organization');
		expect(pipe.transform({ username: 'mondingo', usertype: 'npo', subtype: 'none' }, 'short')).toBe('npo');
		expect(pipe.transform({ username: 'mondingo', usertype: 'singleuser', subtype: 'none' })).toBe('user');
	});
});
