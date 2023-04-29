import { LoaderService } from './loader.service';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterContentChecked {
  isLoading = false;

  constructor(
    private _loaderService: LoaderService,
    private _changeDetectionRef: ChangeDetectorRef
  ) {
    this._loaderService.loadingChange.subscribe((value) => {
      this.isLoading = value;
    });
  }

  ngAfterContentChecked() {
    this._changeDetectionRef.detectChanges();
  }
}
