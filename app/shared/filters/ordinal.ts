import { numberToOrdinal } from "../../shared/helpers/utils";
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ordinal' })
export class OrdinalPipe implements PipeTransform {
	transform(value: number): string {
		return numberToOrdinal(value);
	}
}