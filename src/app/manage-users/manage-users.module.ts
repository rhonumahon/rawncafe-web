import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ManageUsersComponent } from './manage-users.component';
import { RoleGuard } from '../guards/role.guard';
import { AuthGuard } from '../guards/auth.guard';
import { ROLES } from '../constants/roles.constants';
import { FormsModule } from '@angular/forms'; 

const routes: Routes = [
  {
    path: '',
    component: ManageUsersComponent,
    canActivate: [RoleGuard, AuthGuard],
    data: { role: [ROLES.User, ROLES.Admin, ROLES.SuperAdmin] }
  }
];

@NgModule({
  declarations: [ManageUsersComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ManageUsersModule { }


