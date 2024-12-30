import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-loyalty-card',
  templateUrl: './loyalty-card.component.html',
  styleUrls: ['./loyalty-card.component.css']
})
export class LoyaltyCardComponent implements OnInit {
  userId: string | null = ''; // User ID to fetch data for the loyalty card
  user: any; // Holds the user data
  logos: string[] = []; // Array to store the logos for each point earned
  rewardDescription: string = ''; // Reward description text
  canRedeem: boolean = false; // Whether the user can redeem a reward
  redeemableRewards: string[] = []; // List of rewards user can redeem based on points
  
  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if(this.userId) {
      this.getUserData(this.userId)
    }
  }

  // Method to fetch user data from API
  getUserData(userId: string): void {
    this.http.get(`http://localhost:3000/users/${userId}`).subscribe(
      (data: any) => {
        this.user = data;
        this.updateCardData();
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  // Method to update the loyalty card data
  updateCardData(): void {
    const points = this.user.points;

    // Update logos based on points
    this.logos = this.generateLogos(points);
    console.log('logos :', this.logos);

    // Set the reward description and redemption button logic based on points
    if (points >= 1 && points < 5) {
      this.rewardDescription = 'You have unlocked a reward! Keep going for more!';
      this.canRedeem = false;
    } else if (points >= 5 && points < 10) {
      this.rewardDescription = 'You can redeem a small reward!';
      this.canRedeem = true;
      this.redeemableRewards = ['Small Reward'];
    } else if (points >= 10) {
      this.rewardDescription = 'You can redeem a big reward!';
      this.canRedeem = true;
      this.redeemableRewards = ['Big Reward'];
    } else {
      this.rewardDescription = 'Start earning points to unlock rewards!';
      this.canRedeem = false;
    }
  }

  // Generate logos based on points
  generateLogos(points: number): string[] {
    let logos = [];
    for (let i = 1; i <= 10; i++) {
      logos.push(i <= points ? 'credit-logo' : 'default-logo');
    }
    return logos;
  }

  // Method to redeem the reward
  redeemReward(): void {
    if (this.canRedeem && this.redeemableRewards.length > 0) {
      alert(`You redeemed: ${this.redeemableRewards[0]}`);
      this.updateRewardStatus(); // Update reward status after redemption
    }
  }

  // Method to update the rewards after redemption
  updateRewardStatus(): void {
    const updatedRewards = [...this.user.rewards, this.redeemableRewards[0]];
    this.user.rewards = updatedRewards;
    this.user.points -= 10; // Deduct points after redeeming
    this.http.put(`http://localhost:3000/users/${this.userId}`, this.user).subscribe(
      (updatedUser) => {
        console.log('User data updated:', updatedUser);
        this.updateCardData(); // Recalculate the data after redeeming
      },
      error => {
        console.error('Error updating user data:', error);
      }
    );
  }
}
