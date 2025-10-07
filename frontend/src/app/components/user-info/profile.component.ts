import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FriendService } from '../../services/friend.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profile: any;
  users: any[] = [];
  pendingRequests: any[] = [];
  friends: any[] = [];
  sentRequests: any[] = [];
  constructor(private authService: AuthService, private router: Router, private friendService: FriendService) {}



  ngOnInit(){
    const token = localStorage.getItem('token');
    if(token){
      this.authService.getProfile().subscribe({
        next: (res) => {
          this.profile = res;
          console.log('Profile data:', res);
        },
        error: (err) => {
          console.error('Not authorized', err);
          alert('Failed to fetch profile. Please login again.');
          this.router.navigate(['/login']); // redirect if not logged in
        }
      });
    }
    this.loadAllUsers()
    this.loadPending();
    this.loadFriends();
    this.loadSentRequests();
  }



   loadAllUsers() {
    this.friendService.getAllUsers().subscribe((res: any) => {
      this.users = res || [];
    });
  }

  loadPending() {
    this.friendService.getPendingRequests().subscribe((res: any) => {
      this.pendingRequests = res || [];
    });
  }

  loadFriends() {
    this.friendService.getFriends().subscribe((res: any) => {
      this.friends = res || [];
    });
  }

  loadSentRequests() {
    this.friendService.getSentRequests().subscribe((res: any) => {
      this.sentRequests = res || [];
    });
  }


  sendRequest(userId: number) {
    this.friendService.sendFriendRequest(userId).subscribe(() => {
      alert('Friend request sent!');
      this.loadAllUsers();
      this.loadSentRequests();
    });
  }

  // Helper method to check if user can receive a friend request
  canSendRequest(user: any): boolean {
    if (!this.profile || user.id === this.profile.id) return false;
    
    // Check if already friends
    const isFriend = this.friends.some(friend => friend.id === user.id);
    if (isFriend) return false;
    
    // Check if request already sent
    const requestSent = this.sentRequests.some(req => req.receiver.id === user.id);
    if (requestSent) return false;
    
    // Check if request already received
    const requestReceived = this.pendingRequests.some(req => req.requester.id === user.id);
    if (requestReceived) return false;
    
    return true;
  }

  // Helper method to get button text for user
  getButtonText(user: any): string {
    if (!this.profile || user.id === this.profile.id) return 'You';
    
    const isFriend = this.friends.some(friend => friend.id === user.id);
    if (isFriend) return 'Friend';
    
    const requestSent = this.sentRequests.some(req => req.receiver.id === user.id);
    if (requestSent) return 'Pending';
    
    const requestReceived = this.pendingRequests.some(req => req.requester.id === user.id);
    if (requestReceived) return 'Respond';
    
    return 'Send Request';
  }

  accept(id: number) {
    this.friendService.acceptFriendRequest(id).subscribe(() => {
      this.loadPending();
      this.loadFriends();
    });
  }

  reject(id: number) {
    this.friendService.rejectFriendRequest(id).subscribe(() => {
      this.loadPending();
    });
  }

  undoFriendRequest(id: number) {
    this.friendService.getUndoRequest(id).subscribe((data)=>{
      this.loadSentRequests();
      this.loadAllUsers();
      alert('Friend request undo successfully.');
    });
  }

  unfriendRequest(id: number) {
    this.friendService.getUnfriendRequest(id).subscribe((data)=>{
      this.loadFriends();
      this.loadAllUsers();
      alert('Unfriend successfully.');
    });
  }

   logout() {
    localStorage.removeItem('token'); // clear token
    this.router.navigate(['/login']); // redirect to login
  }
}
