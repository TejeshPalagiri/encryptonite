import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isCollapsed = false;
  currentPage: string = '';

  constructor(
    private _router: Router
  ) {
    this._router.events.subscribe((val) => {
      if(val instanceof NavigationEnd) {
        this.currentPage = this._router.url;
      }
    })
  }
}
