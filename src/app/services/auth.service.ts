// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { ROLES } from '../constants/roles.constants';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BehaviorSubject to track authentication status
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isUserAuthenticated());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Register function to hit the register API
  register(payload: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/register`, payload);
  }

  // Login function, after successful login, set the token and update the auth state
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
      tap((response: any) => {
        this.setToken(response.token);
        this.isAuthenticatedSubject.next(true); // Update authentication status
      })
    );
  }

  // Store the token in localStorage
  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  // Retrieve the token from localStorage
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Check if the user is authenticated based on the token
  private isUserAuthenticated(): boolean {
    const token = this.getToken();
    return token ? true : false;
  }

  // Get the user's role from the token
  getUserRole(): ROLES | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Decode the token
        return decodedToken.role; // Extract the role from the decoded token
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  // Extract user_id from token (decoded JWT)
  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);  // Decode the token
        return decodedToken.sub;  // Return the user_id
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;  // If token is invalid or expired
      }
    }
    return null;  // If no token, return null
  }

  // Logout function, remove token and update auth state
  logout(): void {
    localStorage.removeItem('access_token');
    this.isAuthenticatedSubject.next(false); // Update authentication status
  }
}
