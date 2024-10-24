import { Pipe, PipeTransform } from '@angular/core';
import { LaunchDto } from '../models/launch.dto';

/**
 * Pipe to format the launch title
 */
@Pipe({
  name: 'launchTitle',
  standalone: true,
})
export class LaunchTitlePipe implements PipeTransform {
  transform(launch: LaunchDto, ...args: unknown[]): string {
    const innerText = args[0] || '🚀';
    return `${launch.mission} ${innerText} ${launch.destination}`;
  }
}
