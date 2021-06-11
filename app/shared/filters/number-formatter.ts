import { numberFormatter } from "../../shared/helpers/utils";
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberFormatter' })
export class NumberFormatterPipe implements PipeTransform {
	transform(value: string): string {
		return numberFormatter(value);
	}
}