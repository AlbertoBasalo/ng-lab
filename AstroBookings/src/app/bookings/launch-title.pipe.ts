import { Pipe, PipeTransform } from '@angular/core';
import { LaunchDto } from '../models/launch.dto';

@Pipe({
  name: 'launchTitle',
  standalone: true,
})
export class LaunchTitlePipe implements PipeTransform {
  transform(launch: LaunchDto): string {
    return `${launch.mission} to ${launch.destination}`;
  }
}
