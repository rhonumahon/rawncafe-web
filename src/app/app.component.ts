import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'rawncafe-web';
  isAuthenticated: boolean = false;
  isLoading: boolean = false;
  authId: string | null = '';
  authSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Subscribe to authentication state changes
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      this.authId = this.isAuthenticated ? this.authService.getUserId() : '';
    });
  }

  logout() {
    this.isLoading = true;
    setTimeout(() => {
      this.authService.logout();
      this.isLoading = false;
      this.router.navigate(['/login']);
    }, 3000);
  }

  ngOnDestroy() {
    // Unsubscribe when the component is destroyed
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
