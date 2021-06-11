import { newlineToBr } from '../../shared/helpers/utils';
import { Pipe, PipeTransform } from '@angular/core';

const LINKY_URL_REGEXP = /((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019]/i;
const MAILTO_REGEXP = /^mailto:/i;

function linkyCompile (text: string) {
	if (text == null || text === '') return text;
	if (!(typeof(text) == 'string')) throw Error(`linky - notstring: Expected string but received: ${text}`);

	const html = [];
	let match;
	let raw = text;
	let url;
	let i;

	function addText(text) {
		if (!text) return;
		html.push(text);
	}

	function addLink(url, text) {
		// html.push('<external-link style="display: inline-block;" ');
		// html.push('[url]="', url.replace(/"/g, '&quot;'), '">');
		// addText(text);
		// html.push('</external-link>');
		html.push('<a href="' + url.replace(/"/g, '&quot;'), '" target="_blank">');
		addText(text);
		html.push('</a>');
	}

	while ((match = raw.match(LINKY_URL_REGEXP))) {
		// We can not end in these as they are sometimes found at the end of the sentence
		url = match[0];
		// if we did not match ftp/http/www/mailto then assume mailto
		if (!match[2] && !match[4]) {
			url = (match[3] ? 'http://' : 'mailto:') + url;
		}
		i = match.index;
		addText(raw.substr(0, i));
		addLink(url, match[0].replace(MAILTO_REGEXP, ''));
		raw = raw.substring(i + match[0].length);
	}
	addText(raw);
	return newlineToBr(html.join(''));
}


@Pipe({ name: 'linkyCompile' })
export class LinkyCompilePipe implements PipeTransform {
	transform(text: string) {
		return linkyCompile(text);
	}
}