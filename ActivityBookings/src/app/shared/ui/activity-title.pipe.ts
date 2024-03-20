import { Pipe, PipeTransform } from '@angular/core';
import { Activity } from '@domain/activity.type';

/**
 * Pipe for presenting the title of an activity
 */
@Pipe({
  name: 'activityTitle',
  standalone: true,
})
export class ActivityTitlePipe implements PipeTransform {
  /**
   * Transforms the activity into a string with the title of the activity
   * @param value The activity to be presented
   * @returns A string with the title of the activity
   */
  transform(value: Activity): string {
    return `${value.name} at ${value.location}`;
  }
}
