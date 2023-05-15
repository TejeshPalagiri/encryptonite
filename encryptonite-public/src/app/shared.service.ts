import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  url_validator = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;


  constructor(
    private _notification: NzNotificationService
  ) { }

  openNotification(type: "error" | 'success' | 'warning' | 'info', title: string, message: string) {
    switch(type) {
      case 'error':
        this._notification.error(title, message);
        break;
      case 'success':
        this._notification.success(title, message);
        break;
      case 'warning':
        this._notification.warning(title, message);
        break;
      case 'info':
        this._notification.info(title, message);
        break;
    }
  }
}
