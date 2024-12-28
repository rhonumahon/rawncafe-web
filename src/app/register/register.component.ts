// src/app/components/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

// Custom Validator to check if passwords match
function passwordMatchValidator(control: FormGroup): { [key: string]: boolean } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        contact_number: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]], // Validating phone number (10-15 digits)
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        // confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }  // Apply the custom validator for password matching
    );
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;

    const { name, contact_number, username, email, password } = this.registerForm.value;

    // Prepare the payload to match the API schema
    const payload = {
      name,
      contact_number,
      username,
      email,
      password,
    };

    this.authService.register(payload).subscribe(
      (response) => {
        this.snackBar.open('Registration successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      (error) => {
        this.snackBar.open('Registration failed, please try again', 'Close', { duration: 3000 });
      }
    );
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
