

// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';
import { ROLES } from '../constants/roles.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

    // Register function to hit the register API
    register(payload: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/users/register`, payload);
      }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, { username, password });
  }

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUserRole(): ROLES | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Decode the token
        return decodedToken.role;  // Extract the role from the decoded token
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
        console.log('decodedToken :', decodedToken);
        return decodedToken.sub;  // Return the user_id
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;  // If token is invalid or expired
      }
    }
    return null;  // If no token, return null
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }
}
