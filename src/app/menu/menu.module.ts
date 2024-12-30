import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu.component';
import { RoleGuard } from '../guards/role.guard';
import { AuthGuard } from '../guards/auth.guard';
import { ROLES } from '../constants/roles.constants';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    canActivate: [RoleGuard, AuthGuard],
    data: { role: [ROLES.User, ROLES.Admin, ROLES.SuperAdmin] }
  }
];

@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class MenuModule { }