import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  constructor(private _http: HttpClient) {}

  login(payload: any) {
    return this._http.post(`${environment.api}/login`, payload);
  }

  getCurrentUserDetails() {
    return this._http.get(`${environment.api}/user`);
  }
}
