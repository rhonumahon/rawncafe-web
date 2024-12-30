import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './users-list.component';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../guards/role.guard';
import { AuthGuard } from '../guards/auth.guard';
import { ROLES } from '../constants/roles.constants';

const routes: Routes = [
  {
    path: '',
    component: UsersListComponent,
    canActivate: [RoleGuard, AuthGuard],
    data: { role: [ROLES.Admin, ROLES.SuperAdmin] }
  }
];

@NgModule({
  declarations: [UsersListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class UsersListModule { }
