import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { LaunchDto } from '../models/launch.dto';
import { LaunchTitlePipe } from './launch-title.pipe';

@Component({
  selector: 'lab-launch-header',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, UpperCasePipe, LaunchTitlePipe],
  styles: `
    .scheduled {
      color: violet;
      font-style: italic;
    }
    .confirmed {
      color: green;
    }
    .delayed {
      color: limegreen;
      font-style: italic;
    }
    .launched {
      color: orange;
      font-style: italic;
    }
    .aborted {
      color: red;
      font-style: italic;
    }
  `,
  template: `<header>
    <h2>{{ launch() | launchTitle }}</h2>
    <div [class]="launch().status">
      <span>{{ launch().pricePerSeat | currency: 'USD' : 'symbol' : '1.0-0' }}</span>
      <span>{{ launch().date | date: 'dd/MMM/yyyy' }}</span>
      <span>{{ launch().status | uppercase }}</span>
    </div>
  </header> `,
})
export class LaunchHeaderComponent {
  launch = input.required<LaunchDto>();
}
