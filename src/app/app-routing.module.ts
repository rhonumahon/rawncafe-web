// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { ROLES } from './constants/roles.constants';
import { UnAuthGuard } from './guards/unauth.guard';
import { LoyaltyCardComponent } from './loyalty-card/loyalty-card.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [UnAuthGuard] },
  {
    path: 'users-list',
    loadChildren: () => import('./users-list/users-list.module').then(m => m.UsersListModule),
    canActivate: [RoleGuard, AuthGuard],
    data: { role: [ROLES.Admin, ROLES.SuperAdmin]},
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [RoleGuard, AuthGuard],
    data: { role: [ROLES.User, ROLES.Admin, ROLES.SuperAdmin] },
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule),
    canActivate: [RoleGuard, AuthGuard],
    data: { role: [ROLES.User, ROLES.Admin, ROLES.SuperAdmin] },
  },
  {
    path: 'loyalty-card/:user_id',
    loadChildren: () => import('./loyalty-card/loyalty-card.module').then(m => m.LoyaltyCardModule),
    canActivate: [RoleGuard, AuthGuard],
    data: { role: [ROLES.User, ROLES.Admin, ROLES.SuperAdmin] },
  },
  { path: 'register', component: RegisterComponent, canActivate: [UnAuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
