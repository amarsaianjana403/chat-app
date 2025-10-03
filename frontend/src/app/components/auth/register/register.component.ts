import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from 'frontend/src/app/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {

  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  onSubmit(){
    if (this.registerForm.invalid) return;
    // username, email, password
    console.log(this.registerForm.value);

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        console.log('Registration successful', res);
        alert('Registration successful. Please login.');
        this.registerForm.reset();
        this.router.navigate(['/login']);
      }, error: (err: any) => {
        console.error('Registration failed:', err);
        alert('Registration failed: ' + err?.error?.error || 'Unknown error');
      }
    })
  }

}
