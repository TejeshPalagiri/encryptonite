import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { CredentialsService } from './credentials.service';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';
import { Credential } from './creedential-interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})


export class CredentialsComponent implements OnInit {
  
  credentials: Array<any> = [];
  viewAddCredentials: any = false;
  isDeleteVisible: any = false;
  credentialForm: FormGroup;
  selectedCredential: any = undefined;
  isOkLoading: any = false;
  constructor(
    private _credentialService: CredentialsService,
    private _sharedService: SharedService,
    private _formBuilder: FormBuilder
  ) {
    this.credentialForm = this._formBuilder.group({
      name: new FormControl('', [Validators.required]),
      domain_url: new FormControl('', [Validators.required, Validators.pattern(this._sharedService.url_validator)]),
      user_name: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.fetchCredentials();
  }

  fetchCredentials() {
    this._credentialService.getAllCredentials().subscribe((response: any) => {
      if(response['success']) {
        this.credentials = response['data'];
        _.forEach(this.credentials, (credential: Credential) => {
          credential.last_accessed_at = moment(credential.last_accessed_at).format('hh:mm a DD-MMM-yyyy')
        })
      }
    })
  }

  copyToClipboard(credential: Credential, type: 'username' | 'password') {
    const thisInstance = this;
    if(type === 'username') {
      navigator.clipboard.writeText(credential.user_name).then(function() {
        thisInstance._sharedService.openNotification('success', 'Copy', 'Copied username to clipboard')
      }, function(err) {
        thisInstance._sharedService.openNotification('error', 'Error', 'Error copying username to clipbaord')
      });
    } else if(type === 'password') {
      this._credentialService.getPasswordById(credential._id).subscribe((response: any) => {
        if(response['success']) {
          credential.last_accessed_at = moment(response['last_accessed_at']).format('hh:mm a DD-MMM-yyyy');
          navigator.clipboard.writeText(response['data']).then(function() {
            thisInstance._sharedService.openNotification('success', 'Copy', 'Copied password to clipboard')
          }, function(err) {
            thisInstance._sharedService.openNotification('error', 'Error', 'Error copying password to clipbaord')
          });
        } else {
          thisInstance._sharedService.openNotification('error', 'Error', 'Something went wrong')
        }
      })
    }
  }

  onOpenAddCredentials() {
    this.viewAddCredentials = true;
  }

  onCancel() {
    this.viewAddCredentials = false;
    this.isDeleteVisible = false;
    this.credentialForm.reset();
  }
  onSubmitForm(credentialId?: string) {
    if(this.credentialForm.invalid) {
      this._sharedService.openNotification('error', 'Error', 'Please provide all the required valid fields');
      return;
    }

    if(!credentialId) {
      this._credentialService.createCredentials(this.credentialForm.value).subscribe((response: any) => {
        if(response['success']) {
          this.ngOnInit();
          this.viewAddCredentials = false;
          this.credentialForm.reset();
          this._sharedService.openNotification('success', 'Success', 'Created Creedential successfully.')
        }
      }, err => {
        this._sharedService.openNotification('error', 'Error', err.error.message);
        this.viewAddCredentials = false;
      })
    } else {
      this._credentialService.updateCrendential(this.credentialForm.value, credentialId).subscribe((response: any) => {
        if(response['success']) {
          this.ngOnInit();
          this.viewAddCredentials = false;
          this.credentialForm.reset();
          this.selectedCredential = undefined;
          this._sharedService.openNotification('success', 'Success', 'Updated Credential successfully.')
        }
      }, err => {
        this._sharedService.openNotification('error', 'Error', err.error.message);
        this.viewAddCredentials = false;
      })
    }
  }

  onEdit(credential: any) {
    this.selectedCredential = _.cloneDeep(credential);

    this.credentialForm = this._formBuilder.group({
      name: new FormControl(this.selectedCredential['name'], [Validators.required]),
      domain_url: new FormControl(this.selectedCredential['domain_url'], [Validators.required, Validators.pattern(this._sharedService.url_validator)]),
      user_name: new FormControl(this.selectedCredential['user_name'], [Validators.required]),
      password: new FormControl('', [])
    })

    this.viewAddCredentials = true;
  }

  handleDeleteOk(credentialId: string) {
    this.isOkLoading = true;
    this._credentialService.deleteCredential(credentialId).subscribe((response: any) => {
      if(response['success']) {
        this.credentials.splice(this.selectedCredential.index, 1);
        this._sharedService.openNotification('success', 'Success', 'Deleted Credential successfully.')
      }
      this.isDeleteVisible = false;
      this.isOkLoading = false;
      this.selectedCredential = undefined;
    }, (error) => {
      this.isDeleteVisible = false;
      this.selectedCredential = undefined;
      this._sharedService.openNotification('error', 'Error', error.error.message);
      this.isOkLoading = false;
    })
  }
}
