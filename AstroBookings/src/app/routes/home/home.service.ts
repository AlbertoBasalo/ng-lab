import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LaunchDto } from '@models/launch.dto';
import { environment } from 'environments/environment';
import { Observable, tap } from 'rxjs';

/**
 * Home service, used to get data from the API
 */
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  // Injectable services
  readonly http = inject(HttpClient);
  // Read-only signals
  readonly URL = `${environment.apiUrl}/launches?delay=1000`;

  /**
   * Get the list of launches as a signal
   * - Logs errors as a demo of error handling with tap
   */
  getLaunches(): Signal<LaunchDto[]> {
    const getLaunches$: Observable<LaunchDto[]> = this.http
      .get<LaunchDto[]>(this.URL)
      .pipe(tap({ error: (err) => console.error('Error', err) }));
    return toSignal(getLaunches$, { initialValue: [] });
  }
}
