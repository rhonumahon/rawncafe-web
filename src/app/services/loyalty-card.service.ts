import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyCardService {

  constructor(private http: HttpClient) { }
  
  getUserDetails(userId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/${userId}`);
  }

  addRewardToUser(userId: string, reward_id: string): Observable<any> {
    return  this.http.post(`${environment.apiUrl}/users/${userId}/redeem/${reward_id}`, {})
  }

  getAllRewards(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/rewards`);
  }

  addPoints(userId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/update-points`, { userId})
  }
}
