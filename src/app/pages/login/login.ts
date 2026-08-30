import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  phone = '';

  password = '';

  showPassword = false;

  loading = false;

  errorMessage = '';


  constructor(
    private router: Router,
    private authService: AuthService
  ) {}


  // =========================
  // LOGIN
  // =========================
 login(): void {

  this.errorMessage = '';

  const phone = this.phone.trim();

  // Phone validation
  if (!/^[0-9]{10}$/.test(phone)) {
    this.errorMessage =
      'Please enter a valid 10 digit mobile number.';
    return;
  }

  // Password validation
  if (!this.password) {
    this.errorMessage =
      'Please enter your password.';
    return;
  }

  this.loading = true;

  this.authService.login(phone, this.password).subscribe({

    next: (response: any) => {

      console.log('Login API Response:', response);

      this.loading = false;

      if (response.success === true) {

        const user = response.data?.user;

        // Save real login state
        this.authService.loginUser(user);

        // Save backend token
        if (response.data?.token) {
         this.authService.loginUser(response);
        }

        // Pending user → continue registration
        if (user?.account_status === 'pending') {

          this.router.navigate(['/register'], {
            queryParams: {
              resume: 'true'
            }
          });

          return;
        }

        // Active user → home
        if (user?.account_status === 'active') {

          this.router.navigate(['/user-home']);

          return;
        }

        this.errorMessage =
          'Your account status is not valid.';
        return;
      }

      this.errorMessage =
        response.message ||
        'Login failed.';

    },

    error: (error: any) => {

      console.error(
        'Login API Error:',
        error
      );

      this.loading = false;

      this.errorMessage =
        error?.error?.message ||
        'Invalid mobile number or password.';
    }

  });
}

  // =========================
  // GO TO HOME
  // =========================

  goToHome(): void {

    this.router.navigate(['/']);

  }


  // =========================
  // TOGGLE PASSWORD
  // =========================

  togglePassword(): void {

    this.showPassword = !this.showPassword;

  }

}