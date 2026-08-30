import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink
} from '@angular/router';

import { ApiService } from '../../services/api';

@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {

  // =========================
  // FORM DATA
  // =========================

  phone = '';

  otp = '';

  password = '';

  confirmPassword = '';

  showPassword = false;

  showConfirmPassword = false;

  loading = false;

  errorMessage = '';

  successMessage = '';

  devOtp = '';

  step:
    | 'phone'
    | 'otp'
    | 'password'
    | 'success'
    = 'phone';


  constructor(
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) { }


  // =========================
  // SEND OTP
  // =========================

  sendOtp(): void {

    this.errorMessage = '';
    this.successMessage = '';
    this.devOtp = '';

    const phone =
      this.phone.trim();

    if (!/^[0-9]{10}$/.test(phone)) {

      this.errorMessage =
        'Please enter a valid 10 digit mobile number.';

      this.cdr.detectChanges();

      return;
    }

    this.loading = true;

    this.apiService.sendOtp({

      phone: phone,

      purpose: 'forgot_password'

    }).subscribe({

      next: (response: any) => {

        this.loading = false;

        console.log(
          'FORGOT PASSWORD SEND OTP:',
          response
        );

        if (response?.success === true) {

          this.successMessage =
            'OTP sent successfully.';

          this.devOtp =
            response?.data?.dev_otp || '';

          this.step = 'otp';

          this.cdr.detectChanges();

          return;
        }

        this.errorMessage =
          response?.message ||
          'Unable to send OTP.';

        this.cdr.detectChanges();
      },

      error: (error: any) => {

        console.error(
          'FORGOT PASSWORD SEND OTP ERROR:',
          error
        );

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Unable to connect to the server. Please try again.';

        this.cdr.detectChanges();
      }

    });
  }


  // =========================
  // VERIFY OTP
  // =========================

  verifyOtp(): void {

    this.errorMessage = '';
    this.successMessage = '';

    const phone =
      this.phone.trim();

    const otp =
      this.otp.trim();

    if (!/^[0-9]{6}$/.test(otp)) {

      this.errorMessage =
        'Please enter the 6 digit OTP.';

      this.cdr.detectChanges();

      return;
    }

    this.loading = true;

    this.apiService.verifyOtp({

      phone: phone,

      otp: otp,

      purpose: 'forgot_password'

    }).subscribe({

      next: (response: any) => {

        this.loading = false;

        console.log(
          'FORGOT PASSWORD VERIFY OTP:',
          response
        );

        if (response?.success === true) {

          this.errorMessage = '';

          this.successMessage =
            'OTP verified successfully.';

          this.step = 'password';

          this.cdr.detectChanges();

          return;
        }

        this.errorMessage =
          response?.message ||
          'OTP verification failed.';

        this.cdr.detectChanges();
      },

      error: (error: any) => {

        console.error(
          'FORGOT PASSWORD VERIFY OTP ERROR:',
          error
        );

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Unable to connect to the server. Please try again.';

        this.cdr.detectChanges();
      }

    });
  }


  // =========================
  // PASSWORD VALIDATION
  // =========================

  private validatePassword(): boolean {

    this.errorMessage = '';

    if (!this.password) {

      this.errorMessage =
        'Please create a new password.';

      return false;
    }

    if (this.password.length < 8) {

      this.errorMessage =
        'Password must be at least 8 characters.';

      return false;
    }

    if (!/[A-Z]/.test(this.password)) {

      this.errorMessage =
        'Password must contain at least one uppercase letter.';

      return false;
    }

    if (!/[a-z]/.test(this.password)) {

      this.errorMessage =
        'Password must contain at least one lowercase letter.';

      return false;
    }

    if (!/[0-9]/.test(this.password)) {

      this.errorMessage =
        'Password must contain at least one number.';

      return false;
    }

    if (
      this.password !==
      this.confirmPassword
    ) {

      this.errorMessage =
        'Passwords do not match.';

      return false;
    }

    return true;
  }


  // =========================
  // RESET PASSWORD
  // =========================

  resetPassword(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.validatePassword()) {

      this.cdr.detectChanges();

      return;
    }

    const phone =
      this.phone.trim();

    const otp =
      this.otp.trim();

    this.loading = true;

    this.apiService.resetPassword({

      phone: phone,

      otp: otp,

      password: this.password

    }).subscribe({

      next: (response: any) => {

        this.loading = false;

        console.log(
          'RESET PASSWORD API:',
          response
        );

        if (response?.success === true) {

          // Clear old logged-in session
          localStorage.removeItem('mwi_token');
          sessionStorage.removeItem('mwi_user_auth');

          // Clear sensitive form data
          this.otp = '';
          this.password = '';
          this.confirmPassword = '';

          // Go to fresh login
          this.router.navigate(['/login']);

          return;
          
        }

        this.errorMessage =
          response?.message ||
          'Unable to reset password.';

        this.cdr.detectChanges();
      },

      error: (error: any) => {

        console.error(
          'RESET PASSWORD API ERROR:',
          error
        );

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Unable to reset password. Please try again.';

        this.cdr.detectChanges();
      }

    });
  }


  // =========================
  // BACK
  // =========================

  goBack(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (this.step === 'otp') {

      this.step = 'phone';

      this.otp = '';

      return;
    }

    if (this.step === 'password') {

      this.step = 'otp';

      this.password = '';

      this.confirmPassword = '';

      return;
    }

    this.router.navigate([
      '/login'
    ]);
  }


  // =========================
  // LOGIN
  // =========================

  goToLogin(): void {

    this.router.navigate([
      '/login'
    ]);
  }


  // =========================
  // HOME
  // =========================

  goToHome(): void {

    this.router.navigate([
      '/'
    ]);
  }

}