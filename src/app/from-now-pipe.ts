import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';

@Pipe({
  name: 'fromNow',
})
export class FromNowPipe implements PipeTransform {
  transform(instant: string, ..._args: Array<unknown>): string {
    const date = parseISO(instant);
    return formatDistanceToNowStrict(date, { addSuffix: true });
  }
}
