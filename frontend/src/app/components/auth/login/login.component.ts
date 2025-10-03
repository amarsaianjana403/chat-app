import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'frontend/src/app/services/auth.service';
import { RouterModule, Router} from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  loginForm!: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }


  onSubmit(){
    if(this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res)=> {
        localStorage.setItem('token', res.token); // Save token
        alert('Login successful');
        this.router.navigate(['/profile']); 
      },
      error: (err)=> {
        console.error('Login failed:', err);
        alert('Login failed');
      }
    })
  }
}
