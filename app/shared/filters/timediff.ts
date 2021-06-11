import { timeDiff } from '../../shared/helpers/utils';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timediff' })
export class TimediffPipe implements PipeTransform {
	transform(d: string | Date): string {
		return timeDiff(d);
	}
}