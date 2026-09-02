import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLogin {

  username = '';
  password = '';

  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  // =========================
  // TOGGLE PASSWORD
  // =========================

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }


  // =========================
  // LOGIN
  // =========================

  login(): void {
    this.errorMessage = '';

    const username = this.username.trim();
    const password = this.password;

    if (!username || !password) {
      this.errorMessage =
        'Please enter your username and password.';
      return;
    }

    this.isLoading = true;

    this.authService
      .loginAdmin(username, password)
      .subscribe({

        next: (response) => {

          this.isLoading = false;
          this.cdr.detectChanges();

          if (response?.success !== true) {

            this.errorMessage =
              response?.message ||
              'Unable to login. Please try again.';

            return;
          }

          this.authService.saveAdminSession(response);

          this.router.navigate([
            '/admin/dashboard'
          ]);
        },

        error: (error) => {
          this.isLoading = false;
          this.cdr.detectChanges();

          this.errorMessage =
            error?.error?.message ||
            'Invalid username or password.';
        }
      });
  }

}