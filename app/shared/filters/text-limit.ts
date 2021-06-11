import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'textLimit' })
export class TextLimitPipe implements PipeTransform {
	constructor() { }

	transform(text: string, limit: number) {
		if(typeof(text) == 'undefined' || !text)
			return '';
		else if(text.length <= limit)
			return text;
		else {
			const arr = [' ', ',', '.', '!', '?', ':', ';', '_', '-', '+', '*', '/'];

			if(arr.indexOf(text.charAt(limit+1))>-1)
				return text.slice(0, limit+1)+'...';
			else {
				let i = limit;
				while(arr.indexOf(text.charAt(i))==-1 && i>=0)
					i--;

				if(i==0)
					return text.slice(0, limit);
				else
					return (text.charAt(i) == ' ') ? text.slice(0, i)+'...' : text.slice(0, i+1)+'...';
			}
		}
	}
}