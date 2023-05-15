import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  constructor(
    private _http: HttpClient
  ) { }

  getAllCredentials() {
    return this._http.get(`${environment.api}/credentials`);
  }

  getCredentialById(id: string) {
    return this._http.get(`${environment.api}/credentials/${id}`);
  }

  getPasswordById(id: string) {
    return this._http.get(`${environment.api}/password/${id}`);
  }

  createCredentials(payload: any) {
    return this._http.post(`${environment.api}/credentials`, payload);
  }

  updateCrendential(payload: any, id: string) {
    return this._http.put(`${environment.api}/credentials/${id}`, payload);
  }

  deleteCredential(id: string) {
    return this._http.delete(`${environment.api}/credentials/${id}`);
  }
}
