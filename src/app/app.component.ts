import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'rawncafe-web';
  isAuthenticated: boolean = false;
  isLoading: boolean = false;
  authId: string | null =''

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authId = this.authService.getUserId();
    this.isAuthenticated = this.authId ? true : false
  }

  logout() {
    this.isLoading = true
    setTimeout(() => {
      this.authService.logout();
      this.isLoading = false
      this.router.navigate(['/login']);
    }, 3000)
  }
}
