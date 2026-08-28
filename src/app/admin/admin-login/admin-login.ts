import { Component } from '@angular/core';
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
    private authService: AuthService
  ) {}

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

    // Clear previous error
    this.errorMessage = '';

    const username = this.username.trim();
    const password = this.password;


    // =========================
    // EMPTY FIELD VALIDATION
    // =========================

    if (!username || !password) {

      this.errorMessage =
        'Please enter your username and password.';

      return;
    }


    // =========================
    // TEMPORARY ADMIN CREDENTIAL
    // =========================

    /*
     * Backend is not connected yet.
     *
     * Temporary testing credentials:
     *
     * Username: admin
     * Password: admin123
     */

    if (
      username !== 'admin' ||
      password !== 'admin123'
    ) {

      this.errorMessage =
        'Invalid username or password.';

      return;
    }


    // =========================
    // VALID LOGIN
    // =========================

    this.isLoading = true;


    setTimeout(() => {

      this.isLoading = false;


      // Save admin authentication
      this.authService.loginAdmin({
        username: username
      });


      // Go to dashboard
      this.router.navigate(['/admin/dashboard']);

    }, 500);
  }

}