import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { CommonService } from '../services/common.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private requestCount = 0;
  constructor(private _commonSrv: CommonService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.requestCount++;
    this._commonSrv.isLoading.next(true);

    return next.handle(req).pipe(
      finalize(() => {
        this.requestCount--;
        if (this.requestCount === 0) {
          this._commonSrv.isLoading.next(false);
        }
      }),
      catchError((error) => {
        return throwError('error interceptor');
      })
    );
  }
}
