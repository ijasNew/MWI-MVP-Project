import {
  Component,
  ChangeDetectorRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
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

  step: 'phone' | 'otp' | 'password' | 'success' = 'phone';


  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }


  // =========================
  // SEND OTP
  // =========================

  sendOtp(): void {

  this.errorMessage = '';
  this.successMessage = '';

  const phone = this.phone.trim();

  if (!/^[0-9]{10}$/.test(phone)) {
    this.errorMessage =
      'Please enter a valid 10 digit mobile number.';
    return;
  }

  this.loading = true;

  setTimeout(() => {

    this.loading = false;

    this.successMessage =
      'OTP sent successfully.';

    this.step = 'otp';

    this.cdr.detectChanges();

  }, 700);
}


  // =========================
  // VERIFY OTP
  // =========================

  verifyOtp(): void {

    this.errorMessage = '';
    this.successMessage = '';

    const otp = this.otp.trim();

    if (!/^[0-9]{6}$/.test(otp)) {

      this.errorMessage =
        'Please enter the 6 digit OTP.';

      return;
    }

    // TEMPORARY TEST OTP
    if (otp !== '123456') {

      this.errorMessage =
        'Invalid OTP.';

      return;
    }

    this.loading = true;

    setTimeout(() => {

      this.loading = false;

      this.successMessage =
        'OTP verified successfully.';

      this.step = 'password';
      this.cdr.detectChanges();

    }, 700);
  }


  // =========================
  // RESET PASSWORD
  // =========================

  resetPassword(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.password) {

      this.errorMessage =
        'Please create a new password.';

      return;
    }

    if (this.password.length < 8) {

      this.errorMessage =
        'Password must be at least 8 characters.';

      return;
    }

    if (!/[A-Z]/.test(this.password)) {

      this.errorMessage =
        'Password must contain at least one uppercase letter.';

      return;
    }

    if (!/[a-z]/.test(this.password)) {

      this.errorMessage =
        'Password must contain at least one lowercase letter.';

      return;
    }

    if (!/[0-9]/.test(this.password)) {

      this.errorMessage =
        'Password must contain at least one number.';

      return;
    }

    if (this.password !== this.confirmPassword) {

      this.errorMessage =
        'Passwords do not match.';

      return;
    }

    // TEMPORARY FRONTEND TEST
    this.loading = true;

    setTimeout(() => {

      this.loading = false;

      this.step = 'success';

      this.successMessage =
        'Your password has been reset successfully.';
        this.cdr.detectChanges();

    }, 700);
  }


  // =========================
  // BACK
  // =========================

  goBack(): void {

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

    this.router.navigate(['/login']);
  }


  // =========================
  // LOGIN
  // =========================

  goToLogin(): void {

    this.router.navigate(['/login']);

  }
  goToHome(): void {
  this.router.navigate(['/']);
}

}