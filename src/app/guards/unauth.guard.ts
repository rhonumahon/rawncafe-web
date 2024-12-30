// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import * as router_1 from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ROLES } from '../constants/roles.constants';

@Injectable({
  providedIn: 'root',
})
export class UnAuthGuard implements router_1.CanActivate {
  constructor(private authService: AuthService, private router: router_1.Router) {}

  canActivate(): boolean {
    if (!this.authService.getToken()) {
      return true; // Allow access to the route
    } else {
      const role = this.authService.getUserRole()
      if(role === ROLES.Admin || role === ROLES.SuperAdmin) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/user']);
      }
 // Redirect to login if not authenticated
      return false;
    }
  }
}
