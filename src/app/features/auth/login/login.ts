import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      
      const { email, password } = this.loginForm.value;
      
      this.auth.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/calendar']);
        },
        error: (err) => {
          this.error = 'Invalid credentials';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}