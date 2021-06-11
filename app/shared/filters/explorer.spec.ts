import { ExplorerPipe } from './explorer';
import AppSettings from 'app/app.settings';

describe('ExplorerPipe', () => {
	const pipe = new ExplorerPipe();

	it('should return the explorer url for tx', async () => {
		expect(pipe.transform('123', 'tx')).toBe(AppSettings.explorer.tx + '123')
	});
});
