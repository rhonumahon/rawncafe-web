import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ROLES } from '../constants/roles.constants';
import { ILogos } from './loyalty-card.model';
import { Subscription } from 'rxjs';
import { LoyaltyCardService } from '../services/loyalty-card.service';

@Component({
  selector: 'app-loyalty-card',
  templateUrl: './loyalty-card.component.html',
  styleUrls: ['./loyalty-card.component.css']
})
export class LoyaltyCardComponent implements OnInit, OnDestroy {
  isLoading = false;
  adminButtonRole: any[] = [ROLES.Admin, ROLES.SuperAdmin]
  userRole: ROLES | null = ROLES.User;
  userId: string | null = ''; // User ID to fetch data for the loyalty card
  rewards: any[] = [];
  isRedeeming: boolean = false; // State to track API call status
  isGrantingPoints: boolean = false;
  rewardTitle: string = ''
  user: any; // Holds the user data
  logos: ILogos[] = []; // Array to store the logos for each point earned
  canRedeem: boolean = false; // Whether the user can redeem a reward
  redeemableRewards: string[] = []; // List of rewards user can redeem based on 
  rewardMessage: string = ''
  isModalVisible: boolean = false; // Tracks modal visibility
  redeemButton: string = 'Redeem Now'
selectedReward: {id: string, description: string, title: string} = {id: '', description: '',  title: ''}; // Tracks the reward details
private routeSub: Subscription | null = null;
  
  constructor(private http: HttpClient, private authService: AuthService, private loyaltyCardService: LoyaltyCardService, private route: ActivatedRoute, private router: Router) { 

  }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    const currentUserId = this.authService.getUserId()
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.userId = params.get('user_id');
      if(this.userRole === ROLES.User && this.userId !== currentUserId) {
        this.router.navigate(['/loyalty-card', currentUserId])
      }
      if(this.userId) {
        this.getUserData(this.userId ?? currentUserId)
      }
    });
  }

// Method to fetch user data from API
getUserData(userId: string): void {
  this.isLoading = true; // Set loading to true when starting the API call

  this.loyaltyCardService.getUserDetails(userId).subscribe(
    (data: any) => {
      this.user = data;
      this.getRewards(data);
      this.isLoading = false; // Set loading to false once the API call is successful
    },
    error => {
      console.error('Error fetching user data:', error);
      this.isLoading = false; // Set loading to false in case of an error as well
    }
  );
}


  // Generate logos based on points
  generateLogos(points: number, rewards: any[]): ILogos[] {
  console.log('points :', points);
    let logos = [];
    for (let i = 1; i <= 10; i++) {
      const reward = rewards.find(r => r.required_points === i); // Find the reward matching the current point
            if (i <= points) {
        logos.push(reward ? {id: reward._id, points, description: reward.reward_description, title: `${reward.reward_name}`} : {id: '', points, description: '', title: 'credit-logo'});
      } else {
        logos.push(reward ? {id: reward._id, points, description: reward.reward_description, title: `${reward.reward_name}`} : {id: '', points, description: '', title: 'default-logo'});
      }
    }
    return logos;
  }

  redeemReward(reward_id: string): void {
    if (!reward_id || this.isRedeeming) {
      return;
    }
  
    this.isRedeeming = true;
    this.isLoading = true;
    console.log('reward_id :', reward_id);
  
    this.loyaltyCardService.addRewardToUser(this.userId!, reward_id)
      .subscribe({
        next: (response) => {
          console.log('Reward redeemed successfully:', response);
          alert('Reward redeemed successfully!');
          
        },
        error: (err) => {
          console.error('Error redeeming reward:', err);
          alert('There was an error redeeming the reward. Please try again.');
        },
        complete: () => {
          this.isRedeeming = false;
          this.isLoading = false;
          window.location.reload();
        }
      });
  }
  

// Method to update the rewards after redemption
getRewards(data: any): void {
  const points = this.user.points;
  
  this.loyaltyCardService.getAllRewards().subscribe(
    (response) => {
      this.rewards = response;
      console.log('User rewards updated:', this.rewards);
      this.logos = this.generateLogos(points, this.rewards);
    },
    (error) => {
      console.error('Error fetching rewards:', error);
    }
  );
}

// Show the modal with reward details
showRewardDetails(reward: {id: string, description: string, title: string}, _points: number): void {
  const points = _points + 1
  this.selectedReward = reward;
  this.isModalVisible = true;
  const data = this.user;
  const role = this.authService.getUserRole()
  if(reward && points <= data.points && !data.redeem_requests.includes(reward.id) && !data.rewards.includes(reward.id)) {
    if (role === ROLES.User) {
      this.canRedeem = true
      this.redeemButton = 'Redeem Reward'
      this.rewardTitle =  'Congratulations!'
      this.rewardMessage = 'You may now redeem your reward.'
      //allow user to click the claim button, send api request, reload the page
    }
  } else if (reward && data.redeem_requests.includes(reward.id) && !data.rewards.includes(reward.id)) {
    //shoot message claim your rewards at Rawn Cafe Waltermart Batangas
    if(role === ROLES.Admin || role === ROLES.SuperAdmin) {
      this.canRedeem = true
      this.redeemButton = 'Grant Reward'
      this.rewardTitle =  'Claim Request!'
      this.rewardMessage = ''
      //allow button to confirm claimed reward, send api , reload page, 
    } else {
      this.canRedeem = false
      this.rewardTitle =  'Request Sent!'
      this.rewardMessage = 'Your reward is now available for redemption at our physical store.'
    }
  } else if (reward && !data.redeem_requests.includes(reward.id) && data.rewards.includes(reward.id)) {
    this.canRedeem = false
    this.rewardTitle =  'Reward Claimed!'
    this.rewardMessage = 'Your reward has already been claimed!'
  }
}

// Close the modal
closeModal(): void {
this.clearProperties();
}

clearProperties(): void {
  this.isModalVisible = false;
  this.selectedReward = {id: '', description: '', title: ''};
  this.redeemButton = ''
  this.rewardTitle =  ''
  this.rewardMessage = ''
  this.canRedeem = false
}

grantPoints(): void {
  if (this.userRole === ROLES.User || !this.userId || this.isGrantingPoints) {
    return; // Prevent multiple calls
  }

  this.isGrantingPoints = true; // Set flag to true
  this.isLoading = true;

  this.loyaltyCardService.addPoints(this.userId!)
    .subscribe({
      next: (response) => {
        console.log('Points granted successfully:', response);
        alert('Points granted successfully!');
      },
      error: (err) => {
        console.error('Error granting points:', err);
        alert('There was an error granting points. Please try again.');
      },
      complete: () => {
        this.isGrantingPoints = false;
        this.isLoading = false;
        window.location.reload();
      }
    });
}

ngOnDestroy(): void {
  if (this.routeSub) {
    this.routeSub.unsubscribe(); // Unsubscribe to avoid memory leaks
  }
}


}
