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

    // =========================
    // PHONE VALIDATION
    // =========================

    if (!/^[0-9]{10}$/.test(phone)) {

      this.errorMessage =
        'Please enter a valid 10 digit mobile number.';

      return;
    }


    // =========================
    // PASSWORD VALIDATION
    // =========================

    if (!this.password) {

      this.errorMessage =
        'Please enter your password.';

      return;
    }


    // =========================
    // TEMPORARY FRONTEND LOGIN
    // =========================

    this.loading = true;

    setTimeout(() => {

      this.loading = false;

      /*
       * TEMPORARY LOGIN
       *
       * Backend is not connected yet.
       *
       * This only creates frontend login state
       * so we can test AuthGuard.
       */

      const user = {
        phone: phone
      };

      this.authService.loginUser(user);

      // =========================
      // GO TO USER HOME
      // =========================

      this.router.navigate(['/user-home']);

    }, 700);
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