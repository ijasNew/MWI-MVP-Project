import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  constructor(private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {

    this.errorMessage = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter your username and password.';
      return;
    }

    this.isLoading = true;

    /*
     * TEMPORARY FRONTEND LOGIN
     * Backend authentication will be connected later.
     */

    setTimeout(() => {

      this.isLoading = false;

      // Temporary demo login
      if (
        this.username.trim() === 'admin' &&
        this.password === 'admin123'
      ) {
        sessionStorage.setItem('mwi_admin_logged_in', 'true');

        this.router.navigate(['/admin/dashboard']);
      } else {
        this.errorMessage = 'Invalid username or password.';
      }

    }, 500);
  }

}