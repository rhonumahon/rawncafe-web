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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const authId = this.authService.getUserId();
    this.isAuthenticated = authId ? true : false
  }

  logout() {
    this.authService.logout()
    this.router.navigate(['/login']);
  }
}
