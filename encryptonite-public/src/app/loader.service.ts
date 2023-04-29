import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  
  loading: boolean = false;
  loadingChange: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.loadingChange.subscribe((value) => {
      this.loading = value;
    });
  }

  changeLoadingVisibility(value: boolean) {
    this.loadingChange.next(value);
  }
}
