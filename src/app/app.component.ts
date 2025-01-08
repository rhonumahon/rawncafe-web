import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ROLES } from './constants/roles.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'rawncafe-web';
  isAuthenticated: boolean = false;
  isLoading: boolean = false;
  authId: string | null = '';
  authSubscription!: Subscription;
  isAdmin: boolean | null = false;

  constructor(private authService: AuthService, private router: Router, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    // Subscribe to authentication state changes
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      setTimeout(() => {
        this.authId = this.isAuthenticated ? this.authService.getUserId() : '';
        const role = this.authService.getUserRole()
        this.isAdmin = role && role !== ROLES.User
      }, 3000)
    });
  }

  logout() {
    this.isLoading = true;
    setTimeout(() => {
      this.authService.logout();
      this.isLoading = false;
      this.router.navigate(['/login']);
    }, 1000);
  }

  ngOnDestroy() {
    // Unsubscribe when the component is destroyed
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
