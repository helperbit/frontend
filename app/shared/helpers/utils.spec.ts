import { newlineToBr, getMimeTypesFromExtensions, formatUrl } from "./utils";

describe('Utils Helper - newlineToBr', () => {
	it('should convert newline to br', () => {
		expect(newlineToBr('ciao\nmondo')).toBe('ciao<br>mondo');
	});
	it('should convert undefined to empty string', () => {
		expect(newlineToBr(undefined)).toBe('');
	});
});

describe('Utils Helper - getMimeTypesFromExtensions', () => {
	it('should convert extension to mimetype', () => {
		expect(getMimeTypesFromExtensions(['png'])).toEqual(['image/png']);
	});
});

describe('Utils Helper - formatUrl', () => {
	it('should format url', () => {
		expect(formatUrl('www.google.it')).toEqual('http://www.google.it');
		expect(formatUrl('https://www.google.it')).toEqual('https://www.google.it');
	});
});