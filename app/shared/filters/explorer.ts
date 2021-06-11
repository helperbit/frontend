import { getExplorerUrl } from "../../shared/helpers/utils";
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'explorer' })
export class ExplorerPipe implements PipeTransform {
	constructor() {}

	transform(id: string, what: 'tx' | 'address' = 'tx'): string {
		return getExplorerUrl(id, what);
	}
}