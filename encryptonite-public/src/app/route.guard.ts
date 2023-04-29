import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class RouteGuard implements CanActivate {
  constructor(
    private _cookieService: CookieService,
    private _router: Router,
    private _httpService: HttpClientService
  ) {}
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    if (this._cookieService.get('x-header-authtoken')) {
      await this.getUserDetails();
      return true;
    }
    this._router.navigate(['/login']);
    return false;
  }

  getUserDetails() {
    return new Promise((resolve, reject) => {
      this._httpService.getCurrentUserDetails().subscribe((response: any) => {
        if (response['success']) {
          let user = response['user'];
          localStorage.setItem('userId', user._id);
          localStorage.setItem('userName', user.name);
          localStorage.setItem('userEmail', user.email);
          localStorage.setItem('userStatus', user.status);
          resolve(null);
        }
      });
    });
  }
}
