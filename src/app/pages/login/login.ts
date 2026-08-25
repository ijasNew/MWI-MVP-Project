import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  // =========================
  // LOGIN DATA
  // =========================

  phone = '';

  password = '';

  showPassword = false;

  loading = false;

  errorMessage = '';


  constructor(
    private router: Router
  ) { }


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
    // TEMPORARY UI TEST
    // =========================

    this.loading = true;

    setTimeout(() => {

      this.loading = false;

      /*
       * API login will be connected here later.
       *
       * Example:
       *
       * this.apiService.login({
       *   phone: this.phone,
       *   password: this.password
       * }).subscribe(...)
       *
       */

      // Temporary:
      // this.router.navigate(['/user-home']);

    }, 700);

  }
  goToHome(): void {

    this.router.navigate(['/']);

}

}
