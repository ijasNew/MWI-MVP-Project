import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserMenu } from '../../components/user-menu/user-menu';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, UserMenu],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  user: any = null;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  message = '';
  errorMessage = '';

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


  changePassword(): void {

    this.message = '';
    this.errorMessage = '';

    if (!this.currentPassword) {
      this.errorMessage =
        'Please enter your current password.';
      return;
    }

    if (!this.newPassword) {
      this.errorMessage =
        'Please enter your new password.';
      return;
    }

    if (this.newPassword.length < 8) {
      this.errorMessage =
        'New password must be at least 8 characters.';
      return;
    }

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
     * Actual password verification and
     * database update will be done through
     * secure backend API.
     */

    this.message =
      'Password change request submitted successfully.';

    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';

  }


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