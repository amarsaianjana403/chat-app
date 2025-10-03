import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  profile: any;
  constructor(private authService: AuthService, private router: Router) {}



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
  }

   logout() {
    localStorage.removeItem('token'); // clear token
    this.router.navigate(['/login']); // redirect to login
  }
}
