import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private _cookieService: CookieService,
    private _router: Router
  ) { }

  public setAuthToken(token: string): void {
      this._cookieService.set('x-header-authtoken', token);
  }

  public setRefreshToken(token: string): void {
      this._cookieService.set('x-header-refreshtoken', token);
  }

  public getAuthToken(): string {
      return this._cookieService.get('x-header-authtoken');
  }
  public getRefreshToken(): string {
      return this._cookieService.get('x-header-refreshtoken');
  }

  public getCookieExpiry(): number {
      return 2;   // days
  }

  public infiniteCookieExpiry(): Date {
      let expireDate = new Date();
      expireDate.setTime(2144232732000); // To date 30th Dec 2037 - 2037-12-12T12:12:12.000Z
      return expireDate;
  }

  public clearAllCookies() {
      this._cookieService.deleteAll();
  }
}
