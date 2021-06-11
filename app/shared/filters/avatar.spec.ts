import { AvatarPipe } from './avatar';
import AppSettings from 'app/app.settings';

describe('AvatarPipe', () => {
	const pipe = new AvatarPipe();

	it('should transforms string to avatar', () => {
		expect(pipe.transform('luca'))
			.toContain('/user/luca/avatar');
	});

	it('should transforms user object to avatar (avatar)', () => {
		expect(pipe.transform({ usertype: 'singleuser', publicfields: ['gender'], gender: 'male', avatar: 'lol', username: 'luca' }))
			.toContain('/media/lol/thumbnail/400');
	});

	it('should transforms user object to avatar (no-avatar, male)', () => {
		expect(pipe.transform({ avatar: null, usertype: 'singleuser', publicfields: ['gender'], gender: 'm', username: 'luca' }))
			.toBe(AppSettings.media.avatar.singleuser.male);
	});

	it('should transforms user object to avatar (no-avatar, female)', () => {
		expect(pipe.transform({ avatar: null, usertype: 'singleuser', publicfields: ['gender'], gender: 'f', username: 'luca' }))
			.toBe(AppSettings.media.avatar.singleuser.female);
	});

	it('should transforms user object to avatar (no-avatar, notdeclared)', () => {
		expect(pipe.transform({ avatar: null, usertype: 'singleuser', publicfields: ['gender'], gender: 'a', username: 'luca' }))
			.toBe(AppSettings.media.avatar.singleuser.notDeclared);
	});

	it('should transforms user object to avatar (no-avatar, npo)', () => {
		expect(pipe.transform({ avatar: null, subtype: 'none', usertype: 'npo', username: 'luca' }))
			.toBe(AppSettings.media.avatar.npo);
	});

	it('should transforms user object to avatar (no-avatar, company)', () => {
		expect(pipe.transform({ avatar: null, usertype: 'company', username: 'luca' }))
			.toBe(AppSettings.media.avatar.company);
	});
});
