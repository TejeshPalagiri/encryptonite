import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { HttpClientService } from '../http-client.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private _httpService: HttpClientService,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private _sharedService: SharedService
  ) {
    this.loginForm = this._formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    if (this._authenticationService.getAuthToken()) {
      this._router.navigateByUrl('/credentials');
    }
  }

  submitForm() {
    let formValue = this.loginForm.value;

    if (this.loginForm.valid) {
      this._httpService.login(formValue).subscribe((response: any) => {
        if (response['success']) {
          let user = response['user'];
          localStorage.setItem('userId', user._id);
          localStorage.setItem('userName', user.name);
          localStorage.setItem('userEmail', user.email);
          localStorage.setItem('userStatus', user.status);
          this._router.navigateByUrl('/dashboard');
        }
      });
    } else {
      this._sharedService.openNotification('info', 'Info', 'Please fill all the required fields.')
    }
  }
}
