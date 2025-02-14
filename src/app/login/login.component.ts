// src/app/components/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  isLoading = false;
  errorMessage: string | null = null;
  
  userRole: string | null = null;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

    onLogin(): void {
      if (this.loginForm.invalid) {
        return;
      }
  
      this.isLoading = true;
      const { username, password } = this.loginForm.value;
  
        this.authService.login(username, password).subscribe(
          (response) => {
            this.isLoading = false;
            if (response && response.access_token) {
              // Store the access token in localStorage
              localStorage.setItem('access_token', response.access_token);
              // Navigate to the dashboard after successful login
              this.userRole = this.authService.getUserRole();
              const userId = this.authService.getUserId()
              this.router.navigate(['/loyalty-card', userId]);
            } else if (response && response.error) {
              this.errorMessage = response.error;
            }
          },
          (error) => {
          console.log('error :', error);

            this.isLoading = false;
            this.errorMessage = 'Invalid credentials or server error';
          }
        );
    }
  

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
