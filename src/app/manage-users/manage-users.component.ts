import { Component, OnInit } from '@angular/core';// Adjust path if necessary
import { LoyaltyCardService } from '../services/loyalty-card.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];           // Array to store users
  filterBy: string = 'name';   // Default filter is by name
  searchQuery: string = '';    // Variable to store the search query

  constructor(private loyaltyCardService: LoyaltyCardService, private router: Router) {}

  ngOnInit() {
    this.loadUsers();  // Load users when the component initializes
  }

  // Method to load users from the API
  loadUsers() {
    this.loyaltyCardService.getAllUsers().subscribe(
      (data) => {
        this.users = data;  // Store the user data in the users array
        console.log('data :', data);
      },
      (error) => {
        console.error('Error loading users:', error);  // Handle errors
      }
    );
  }

  // Method to filter users based on selected filter and search query
  filteredUsers() {
    return this.users.filter(user => {
      if (this.filterBy === 'name') {
        // Filter by name
        return !this.searchQuery || user.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      } else if (this.filterBy === 'card_number') {
        // Filter by card number (convert to string for comparison)
        return !this.searchQuery || user.card_number.toString().includes(this.searchQuery);
      }
      return true;
    });
  }

  goToUsersLoyaltyCard(userId: string) {
    this.router.navigate(['/loyalty-card', userId]);
  }
}
