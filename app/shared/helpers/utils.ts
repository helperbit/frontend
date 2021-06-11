/* 
 *  Helperbit: a p2p donation platform (frontend)
 *  Copyright (C) 2016-2021  Davide Gessa (gessadavide@gmail.com)
 *  Copyright (C) 2016-2021  Helperbit team
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

import AppSettings from 'app/app.settings';
import * as enLocale from 'date-fns/locale/en-US';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';


/* PUBLIC METHODS */
export const mimeTypesExtension = {
	// 'text/html': 'html', //html htm shtml
	// 'text/css': 'css',
	// 'text/xml': 'xml',
	// 'text/mathml': 'mml',
	// 'text/plain': 'txt',
	// 'text/vnd.sun.j2me.app-descriptor': 'jad',
	// 'text/vnd.wap.wml': 'wml',
	// 'text/x-component': 'htc',

	'image/gif': 'gif',
	'image/jpeg': 'jpg', //jpeg jpg
	'image/png': 'png',
	'image/tiff': 'tiff', //tif tiff
	'image/vnd.wap.wbmp': 'wbmp',
	'image/x-icon': 'ico',
	'image/x-jng': 'jng',
	'image/x-ms-bmp': 'bmp',
	'image/svg+xml': 'svg',
	'image/webp': 'webp',

	// 'application/x-javascript': 'js',
	// 'application/atom+xml': 'atom',
	// 'application/rss+xml': 'rss',
	// 'application/java-archive': 'jar', //jar war ear
	// 'application/mac-binhex40': 'hqx',
	// 'application/msword': 'doc',
	'application/pdf': 'pdf',
	// 'application/postscript': 'ps', //ps eps ai
	// 'application/rtf': 'rtf',
	// 'application/vnd.ms-excel': 'xls',
	// 'application/vnd.ms-powerpoint': 'ppt',
	// 'application/vnd.wap.wmlc': 'wmlc',
	// 'application/vnd.google-earth.kml+xml': 'kml',
	// 'application/vnd.google-earth.kmz': 'kmz',
	// 'application/x-7z-compressed': '7z',
	// 'application/x-cocoa': 'cco',
	// 'application/x-java-archive-diff': 'jardiff',
	// 'application/x-java-jnlp-file': 'jnlp',
	// 'application/x-makeself': 'run',
	// 'application/x-perl': 'pl', //pl pm
	// 'application/x-pilot': 'prc', //prc pdb
	// 'application/x-rar-compressed': 'rar',
	// 'application/x-redhat-package-manager': 'rpm',
	// 'application/x-sea': 'sea',
	// 'application/x-shockwave-flash': 'swf',
	// 'application/x-stuffit': 'sit',
	// 'application/x-tcl': 'tcl', //tcl tk
	// 'application/x-x509-ca-cert': 'der', //der pem crt
	// 'application/x-xpinstall': 'xpi',
	// 'application/xhtml+xml': 'xhtml',
	// 'application/zip': 'zip',

	// 'application/octet-stream': 'bin', //bin exe dll
	/*'application/octet-stream': 			'deb',
	'application/octet-stream': 			'dmg',
	'application/octet-stream': 			'eot',
	'application/octet-stream': 			'iso', //iso img
	'application/octet-stream': 			'msi', //msi msp msm*/

	// 'audio/midi': 'mid', //mid midi kar
	// 'audio/mpeg': 'mp3',
	// 'audio/ogg': 'ogg',
	// 'audio/x-realaudio': 'ra',

	// 'video/3gpp': '3gpp', //3gpp 3gp
	// 'video/mpeg': 'mpeg', //mpeg mpg
	// 'video/quicktime': 'mov',
	// 'video/x-flv': 'flv',
	// 'video/x-mng': 'mng',
	// 'video/x-ms-asf': 'asx', //asx asf
	// 'video/x-ms-wmv': 'wmv',
	// 'video/x-msvideo': 'avi',
	// 'video/mp4': 'mp4' //m4v mp4
};

/**
 * Returns a mimetypes list given a list of extensions
 * @param exts List of extensions
 * @todo possiamo invertire l'oggetto precedente e fare un semplice accesso  per chiave?
 */
export function getMimeTypesFromExtensions(exts: string[]): string[] {
	const arr = [];

	exts.forEach((v, i) => {
		for (const key in mimeTypesExtension) {
			if (mimeTypesExtension[key] == v)
				arr.push(key);
		}
	});

	return arr;
}

export function numberToOrdinal(value: number): string {
	/*
		1 = first
		2 = second
		3 = third

		21 = twenty - first
		22 = twenty - second
		23 = twenty - third

		se c'è 1 come numero iniziale, ad eccezione di 11, va sempre st
		se c'è 2 come numero iniziale, ad eccezione di 12, va sempre nd
		se c'è 3 come numero iniziale, ad eccezione di 13, va sempre rd
	*/

	const word = '' + value;
	let checkNumb = value;

	if (word.length > 1 && (checkNumb < 11 || checkNumb > 13))
		checkNumb = parseInt(word.slice(word.length - 1));

	//verifico solo checkNumb che può essere
	//1, 2, 3 e quindi un caso particolare (st, nd, rd)
	//11, 12, 13, unici casi con 1, 2, 3 che vogliono come suffisso th
	//default che sono tutti quei numeri che non hanno come numero iniziale 1, 2, 3
	switch (checkNumb) {
		case 1: return '' + value + 'st';
		case 2: return '' + value + 'nd';
		case 3: return '' + value + 'rd';
		case 11:
		case 12:
		case 13:
		default: return '' + value + 'th';
	}
}




export function incrementEffect(end, time, round, mainCallaback) {
	if (!time) time = 3000;
	let current = 0;

	const effect = function () {
		const step = end / time;

		if (current < end) {
			current += step * 100;
			if (current > end)
				current = end;
		}

		return current;
	};

	const intervalFunction = callback => {
		const intinc = setInterval(() => {
			callback(effect());

			if (current >= end)
				clearInterval(intinc);
		}, 100);
	}

	intervalFunction((currentValue) => {
		if (round) currentValue = Math.floor(currentValue);

		mainCallaback(currentValue);
	});
}


export function getExplorerUrl(id: string, what: 'tx' | 'address') {
	if (what == 'address')
		return null;
	// return AppSettings.explorer.address + id;
	else
		return AppSettings.explorer.tx + id;
}



export function getLocalStorage(): Storage {
	return (typeof window !== "undefined") ? window.localStorage : null;
}

export function getSessionStorage(): Storage {
	return (typeof window !== "undefined") ? window.sessionStorage : null;
}

export function getWindow(): Window {
	return (typeof window !== "undefined") ? window : null;
}



export function triggerDigest(fn?: () => void) {
	setTimeout(fn ? fn : () => { });
}



/**
 * Interpolate a string with {{key}}
 * @param str String to replace
 * @param ob A dict of keys
 */
export function interpolateString(str: string, ob: { [k: string]: string }, sep: string[] = ['{{', '}}']): string {
	let ns = '';

	const splitstr = str.split(sep[0]);
	for (let i = 0; i < splitstr.length; i++) {
		const s = splitstr[i];
		if (s.indexOf(sep[1]) != -1) {
			const key = s.split(sep[1])[0];
			if (key in ob)
				ns += ob[key];
			else
				ns += 'undefined';
			ns += s.split(sep[1])[1];
		} else {
			ns += s;
		}
	}

	return ns;
}


export function byteSize(size: number, howMuchDigit: number = 2): string {
	let str = '';
	let finalSize = 0;
	let exp = 0;
	let type = '';

	switch (true) {
		case (size < Math.pow(2, 10)): {
			type = 'byte';
			exp = 0;
			break;
		}
		case (size >= Math.pow(2, 10) && size < Math.pow(2, 20)): {
			type = 'kB';
			exp = 10;
			break;
		}
		case (size >= Math.pow(2, 20) && size < Math.pow(2, 30)): {
			type = 'MB';
			exp = 20;
			break;
		}
		case (size >= Math.pow(2, 30)): {
			type = 'GB';
			exp = 30;
			break;
		}
	}

	finalSize = size / Math.pow(2, exp);

	if (finalSize % 1 != 0) {
		const rounded = parseFloat(finalSize.toFixed(howMuchDigit));

		if (rounded % 1 == 0)
			str = Math.floor(rounded) + '';
		else
			str = (rounded + '').replace('.', ',');
	}
	else
		str = Math.floor(finalSize) + '';

	return str + ' ' + type;
}


export function Moneysymbol(text: string): string {
	if (!text) return '';

	switch (text.toLowerCase()) {
		case 'eur': return '\u20AC';
		case 'btc': return '\u0E3F';
		case 'usd': return '\u0024';
		default: return '';
	}
}


export function getValueFormArrayByKeyName(arr: any[], key: string, value: string): any {
	return arr.filter((m) => m[key] == value)[0];
}

export function toCapitalize(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

export function isEmpty(value): boolean {
	return (value == null || value == 'undefined' || typeof value == 'undefined' || (value.constructor === Object && Object.keys(value).length === 0) || (typeof value == 'string' && (value == '' || value.length == 0)))
}


export function isInArray<T>(el: T, arr: T[]): boolean {
	for (const i of arr)
		if (el == i)
			return true;
	return false;
}


export function getMediaUrl(mid: string, what?: string, size?: number): string {
	if (isEmpty(mid)) return;

	if (mid.indexOf('http') != -1)
		return mid;

	if (what == 'avatar')
		return AppSettings.apiUrl + '/user/' + mid + '/avatar';
	else if (size)
		return AppSettings.apiUrl + '/media/' + mid + '/thumbnail/' + size;
	else
		return AppSettings.apiUrl + '/media/' + mid;
}

/**
 * Works with .animation-height-expand CSS class
 */
export function heightExpandAnimation(element) {
	if (element.style.maxHeight)
		element.style.maxHeight = null;
	else
		element.style.maxHeight = element.scrollHeight + 'px';
}


export function getMaxRoundNumber(number: string): number {
	let maxRound = 0;
	const res = String(number).split(/[eE]/);

	//check exponential or decimal exponential

	if (res.length > 1) {
		//esponenziale
		//4e-5
		//2.9e-2
		// nell'ultimo caso qui sopra, il numero è formato da una parte intera + una parte decimale (che incremente rispetto allo step)
		const checkDecimal = res[0].split('.');

		if (checkDecimal.length > 1) {
			//decimale
			maxRound = checkDecimal[1].length;
		}

		let n = Number(res[1]);

		//check if exponent is negative
		if (n < 0)
			n *= -1;

		maxRound += n;
	}
	else {
		//non esponenziale
		//7
		//0.1
		const checkDecimal = res[0].split('.');

		if (checkDecimal.length > 1) {
			//decimale
			maxRound = checkDecimal[1].length;
		}
	}

	return maxRound;
}


export function roundNumber(n, maxRound) {
	let maxRoundProposed = getMaxRoundNumber(n);

	if (maxRoundProposed > maxRound)
		maxRoundProposed = maxRound;

	return n.toFixed(maxRoundProposed);
}

//parse a number in the 3group format (es: 10 231)
export function parseNumber(value: string): string {
	value = String(value);
	let count = 0;

	for (let index = value.length - 1; index >= 0; index--) {
		count++;
		if (count % 3 == 0 && index != 0) {
			value = value.substring(0, index) + ' ' + value.substring(index, value.length);
			count = 0;
		}
	}

	return value;
}

export function objectToFormData(form: FormData, fields: any) {
	Object.keys(fields).forEach(k => form.append(k, fields[k]));
}


/** Return the readable string of a timediff */
export function timeDiff(date: string | Date): string {
	const isodate = typeof (date) == 'string' ? parseISO(date) : date;
	return formatDistanceToNow(isodate, { addSuffix: true, locale: (window as any).dateLocale || enLocale.default });
}


/**
 * Transforms a number value (text/number) into a correctly written number (String type) 
 * @param number 
 * @param maxRound 
 */
export function normalizeNumber(number, maxRound: number) {
	number = number.toFixed(maxRound);

	let found = false;
	let prev = number.length - 1;

	while (!found) {
		const current = number.charAt(prev);
		if (current == '0')
			prev--;
		else if (current == '.')
			break;
		else
			found = true;
	}

	//case N.0000420000 -> last four 0 will be removed
	if (found)
		number = number.substring(0, prev + 1);
	//case 1.0000000000 -> an integer
	else
		number = number.substring(0, prev);

	return number;
}


export function getBase64(file: File): Promise<{ file: File; base64: string | ArrayBuffer }> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve({ file: file, base64: reader.result });
		reader.onerror = error => reject(error);
	});
}

export function HTMLToPlaintext(text: string): string {
	return text ? String(text).replace(/<[^>]+>/gm, '')
		.replace('&#8217;', '\'')
		.replace('&#8211;', '-')
		.replace('&#160;', '')
		.replace('&#8220;', '“')
		.replace('&#8221;', '”')
		.replace('&#8230;', '…') : '';
}


export function formatUrl(url: string): string {
	if (!url) return '';

	if (url.indexOf('http') == -1)
		return 'http://' + url;
	else
		return url;
}



export function numberFormatter(value: string, divisor: string = ' '): string {
	const splitVal = value.split('.');

	if (splitVal.length > 1)
		value = splitVal[0];

	let final = '';
	let next = 0;

	for (let i = value.length - 1; i > -1; i--) {
		final = value.charAt(i) + final;
		next++;
		if ((next) % 3 == 0 && i > 0) final = divisor + final;
	}

	if (splitVal.length > 1)
		return final + '.' + splitVal[1];
	else
		return final;
}

/**
 * Crop a string putting ... if the string is longer than len
 * @param text String to crop
 * @param len Length of the cropped string
 */
export function cropString(text: string, len: number): string {
	if (text.length <= len)
		return text;
	else
		return text.substring(0, len) + '...';
}

export function newlineToBr(text: string): string {
	if (typeof (text) == 'undefined' || !text || text.length == 0)
		return '';
	else {
		//change /n with <br>
		return text.split(/\n/g).join('<br>');
	}
}





// export function titleCase(input: string): string {
// 	const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

// 	input = input.toLowerCase();
// 	return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function (match, index, title) {
// 		if (index > 0 && index + match.length !== title.length &&
// 			match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
// 			(title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
// 			title.charAt(index - 1).search(/[^\s-]/) < 0) {
// 			return match.toLowerCase();
// 		}

// 		if (match.substr(1).search(/[A-Z]|\../) > -1)
// 			return match;

// 		return match.charAt(0).toUpperCase() + match.substr(1);
// 	});
// }

// export function textLimit(text, limit) {
// 	if (typeof (text) == 'undefined' || !text)
// 		return '';
// 	else if (text.length <= limit)
// 		return text;
// 	else {
// 		const arr = [' ', ',', '.', '!', '?', ':', ';', '_', '-', '+', '*', '/'];

// 		if (arr.indexOf(text.charAt(limit + 1)) > -1)
// 			return text.slice(0, limit + 1) + '...';
// 		else {
// 			let i = limit;
// 			while (arr.indexOf(text.charAt(i)) == -1 && i >= 0)
// 				i--;

// 			if (i == 0)
// 				return text.slice(0, limit);
// 			else
// 				return (text.charAt(i) == ' ') ? text.slice(0, i) + '...' : text.slice(0, i + 1) + '...';
// 		}
// 	}
// }


// export function getObjectFromObjectByKeyValue(mainObject, mainKey, mainValue) {
// 	/*

// 		DEVO SCORRERE LE CHIAVI DELL'OGGETTO CORRENTE E VERIFICARE SE IL VALORE ASSOCIATO ALLA CHIAVE CORRENTE SIA UN ALTRO OGGETTO.
// 		SE NON È UN OGGETTO VERIFICO CHE IL VALORE SIA DI TIPO STRINGA E CHE SIA UGUALE AL VALORE CHE STO CERCANDO.
// 		SE È UN OGGETTO DOVRÒ RIPETERE UN NUOVO CILO PASSANDO IL VALORE ASSOCIATO ALLA CHIAVE (UN ALTRO OGGETTO).

// 		VERRÀ RESTITUITO IL'OGGETTO CHE HA CHIAVE E VALORE UGUALI A QUELLI PASSATI COME PARAMETRI.
// 	*/

// 	if (mainObject[mainKey] && typeof mainObject[mainKey] == 'object')
// 		mainObject = getObjectFromObjectByKeyValue(mainObject[mainKey], mainKey, mainValue)
// 	else if (typeof mainObject[mainKey] == 'string' && mainObject[mainKey] == mainValue)
// 		mainObject;

// 	return mainObject;
// }