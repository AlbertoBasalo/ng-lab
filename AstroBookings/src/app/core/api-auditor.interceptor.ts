import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

/**
 * API auditor interceptor, used to audit the API requests and responses
 * @param req - The request to audit
 * @param next - The next interceptor in the chain
 * @returns The response from the next interceptor
 */
export const apiAuditorInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  console.info(`🚀 [${req.method}] ${req.url}`);

  return next(req).pipe(
    tap({
      next: (res) => {
        const duration = Date.now() - startTime;
        console.info(`👽 [${req.method}] ${req.url} ${duration}ms`, res);
      },
      error: (err) => {
        const duration = Date.now() - startTime;
        console.error(`👾 [${req.method}] ${req.url} ${duration}ms ${err.status}`, err);
      },
    }),
  );
};
