// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import * as router_1 from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements router_1.CanActivate {
  constructor(private authService: AuthService, private router: router_1.Router) {}

  canActivate(): boolean {
    if (this.authService.getToken()) {
      return true; // Allow access to the route
    } else {
      this.router.navigate(['/login']); // Redirect to login if not authenticated
      return false;
    }
  }
}
