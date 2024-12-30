import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoyaltyCardComponent } from './loyalty-card.component';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../guards/role.guard';
import { AuthGuard } from '../guards/auth.guard';
import { ROLES } from '../constants/roles.constants';

const routes: Routes = [
  {
    path: '',
    component: LoyaltyCardComponent,
    canActivate: [RoleGuard, AuthGuard],
    data: { role: [ROLES.User, ROLES.Admin, ROLES.SuperAdmin] }
  }
];

@NgModule({
  declarations: [LoyaltyCardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class LoyaltyCardModule { }
