// src/app/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRole = route.data['role'];
    const role = this.authService.getUserRole();

    if (!role) {
      this.router.navigate(['/login']);
      return false;
    } else if (role === requiredRole[0] || role === requiredRole[1]) {
      return true;
    }

    this.router.navigate(['/forbidden']);
    return false;
  }
}
