import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TestService } from './test.service';
// import { NxWelcome } from './nx-welcome';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected title = 'frontend';
  constructor(private testService: TestService) { }

  ngOnInit(): void {
    this.testService.getUsers().subscribe(data => {
      console.log(data);
    });
    this.testService.createUser(null).subscribe(data => {
      console.log(data);
    });

    // this.testService.register('testuser', 'test@example.com', 'password123').subscribe(
    //   response => {
    //     console.log('Registration successful:', response);
    //     localStorage.setItem('token', response.token); // Save token
    //   },
    //   error => console.error('Registration failed:', error)
    // );
  }

  login() {
    this.testService.login('test@example.com', 'password123').subscribe(
      response => {
        console.log('Login successful:', response);
        localStorage.setItem('token', response.token); // Save token
      },
      error => console.error('Login failed:', error)
    );
  }

  logout(){
    this.testService.logout().subscribe(
      response => {
        console.log('Logout successful:', response);
        localStorage.removeItem('token'); // Remove token
      },
      error => console.error('Logout failed:', error)
    );
  }
}
