import { CurrencyPipe, DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { LaunchDto } from '@models/launch.dto';
import { LaunchTitlePipe } from '@ui/launch-title.pipe';

@Component({
  selector: 'lab-launch',
  standalone: true,
  imports: [UpperCasePipe, CurrencyPipe, DatePipe, DecimalPipe, LaunchTitlePipe],
  template: `
    <h2>{{ launch() | launchTitle: ' 🧑‍🚀 ' }}</h2>
    <div [class]="launch().status">
      <span>{{ launch().pricePerSeat | currency: 'USD' : 'symbol' : '1.0-0' }}</span>
      <span>{{ launch().date | date: 'dd MMM yyyy' }}</span>
      <span>{{ launch().status | uppercase }}</span>
    </div>
  `,
  styles: `
    .scheduled {
      color: teal;
    }
    .confirmed {
      color: green;
      font-style: bold;
    }
    .delayed {
      color: lime;
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchBlock {
  launch: InputSignal<LaunchDto> = input.required<LaunchDto>();
}
