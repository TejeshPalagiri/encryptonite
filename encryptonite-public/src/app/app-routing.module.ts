import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CredentialsComponent } from './credentials/credentials.component';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { RouteGuard } from './route.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: HeaderComponent,
    canActivate: [RouteGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashbaord',
        pathMatch: 'full',
      },
      {
        path: 'dashbaord',
        component: DashbaordComponent,
      },
      {
        path: 'credentials',
        component: CredentialsComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
