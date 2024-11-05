import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LaunchDto } from '@models/launch.dto';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  // Injectable services
  readonly http = inject(HttpClient);
  // Read-only signals
  // readonly launches: Signal<LaunchDto[]> = signal(LAUNCHES_DB);
  readonly URL = 'http://localhost:3000/api/launches';
  readonly launches: Signal<LaunchDto[]> = toSignal(this.http.get<LaunchDto[]>(this.URL), {
    initialValue: [],
  });
}
