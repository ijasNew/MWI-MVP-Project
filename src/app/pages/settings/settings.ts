import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserMenu } from '../../components/user-menu/user-menu';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, UserMenu],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {

  user: any = null;

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  message = '';
  errorMessage = '';


  constructor(
    private router: Router
  ) {}


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    const savedData =
      sessionStorage.getItem(
        'mwi_registration'
      );


    if (!savedData) {
      return;
    }


    try {

      this.user =
        JSON.parse(savedData);

    } catch (error) {

      console.error(
        'Invalid registration data',
        error
      );

      this.user = null;

    }

  }


  // =========================
  // CHANGE PASSWORD
  // =========================

  changePassword(): void {

    this.message = '';
    this.errorMessage = '';


    // Current password

    if (!this.currentPassword) {

      this.errorMessage =
        'Please enter your current password.';

      return;

    }


    // New password

    if (!this.newPassword) {

      this.errorMessage =
        'Please enter your new password.';

      return;

    }


    // Minimum length

    if (
      this.newPassword.length < 8
    ) {

      this.errorMessage =
        'New password must be at least 8 characters.';

      return;

    }


    // Confirm password

    if (
      !this.confirmPassword
    ) {

      this.errorMessage =
        'Please confirm your new password.';

      return;

    }


    // Password match

    if (
      this.newPassword !==
      this.confirmPassword
    ) {

      this.errorMessage =
        'New passwords do not match.';

      return;

    }


    /*
     * TEMPORARY UI ONLY
     *
     * Actual password verification
     * and database update will be
     * handled by the secure backend API.
     */

    this.message =
      'Password change request submitted successfully.';


    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';

  }


  // =========================
  // FORGOT PASSWORD
  // =========================

  openForgotPassword(): void {

    this.router.navigate([
      '/forgot-password'
    ]);

  }


  // =========================
  // PASSWORD VISIBILITY
  // =========================

  toggleCurrentPassword(): void {

    this.showCurrentPassword =
      !this.showCurrentPassword;

  }


  toggleNewPassword(): void {

    this.showNewPassword =
      !this.showNewPassword;

  }


  toggleConfirmPassword(): void {

    this.showConfirmPassword =
      !this.showConfirmPassword;

  }

}