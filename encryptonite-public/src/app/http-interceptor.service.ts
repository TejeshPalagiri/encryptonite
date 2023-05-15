import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpResponse,
  HttpHeaders,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from './loader.service';
import { AuthenticationService } from './authentication.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  private httpCount = 0;
  constructor(
    private _router: Router,
    private _loader: LoaderService,
    private _autenticationService: AuthenticationService,
    private _sharedService: SharedService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let hideLoader =
      request.headers.get('hideLoader') === 'true' ? true : false;
    if (!hideLoader) {
      this.httpCount += 1;
      this._loader.changeLoadingVisibility(true);
    }

    let ignore =
      typeof request.body === 'undefined' ||
      request.body === null ||
      request.body.toString() === '[object FormData]' ||
      request.headers.has('Content-Type');

    if (!ignore) {
      request = request.clone({
        headers: request.headers.set('Content-Type', 'application/json'),
      });
    }

    let token = this._autenticationService.getAuthToken();
    let refreshToken = this._autenticationService.getRefreshToken();
    if (token) {
      request = request.clone({
        headers: request.headers.set('x-header-authtoken', token),
      });
      // request = request
    }
    if (refreshToken) {
      request = request.clone({
        headers: request.headers.set('x-header-refreshtoken', refreshToken),
      });
    }
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.status === 401) {
            localStorage.clear();
            this._router.navigateByUrl('/login');
          }
          if (event.body && event.body.accessToken) {
            if (event.body.refreshToken) {
              this._autenticationService.setRefreshToken(
                event.body.refreshToken
              );
            }
            this._autenticationService.setAuthToken(event.body.accessToken);
          }
          if (this.httpCount > 0) {
            this.httpCount -= 1;
          }
          if (this.httpCount === 0) {
            this._loader.changeLoadingVisibility(false);
          }
        }
        return event;
      }),
      catchError((error: any) => {
        console.log(error);
        if (this.httpCount > 0) {
          this.httpCount -= 1;
        }
        if (this.httpCount === 0) {
          this._loader.changeLoadingVisibility(false);
        }
        if (
          error.status === 401 ||
          error.name === 'UnauthorizedError' ||
          (error.error && error.error.message === 'invalid token')
        ) {
          if (error.error.name == 'AccessTokenExpiredError') {
            let { accessToken, refreshToken } = error.error;
            this._autenticationService.setAuthToken(accessToken);
            this._autenticationService.setRefreshToken(refreshToken);
            request.headers.delete('x-header-authtoken');
            request.headers.delete('x-header-refreshtoken');
            request.headers.append('x-header-authtoken', accessToken);
            request.headers.append('x-header-refreshtoken', refreshToken);
            return this.intercept(request, next);
          } else {
            this._sharedService.openNotification('info', 'Error', error.error.message)
            this._router.navigateByUrl('/login');
            this._autenticationService.clearAllCookies();
            localStorage.clear();
          }
        } else if (error.status === 400) {
          this._sharedService.openNotification('warning', 'Error', error.error.message)
        } else if (error.status === 500) {
          this._sharedService.openNotification('error', 'Error', error.error.message)
        } else if (error.status === 0) {
          this._sharedService.openNotification('error', 'Error', "No Response from server (or) server not connected.")
        } else {
          this._loader.changeLoadingVisibility(false);
        }
        return throwError(error);
      })
    );
  }
}
