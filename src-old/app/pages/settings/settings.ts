import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  UserMenu
} from '../../components/user-menu/user-menu';

import {
  ProfileService
} from '../../services/profile';

import {
  ApiService
} from '../../services/api';


@Component({
  selector: 'app-settings',

  imports: [
    FormsModule,
    UserMenu
  ],

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

  loading = false;


  constructor(
    private router: Router,
    private profileService: ProfileService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.profileService
      .getCurrentProfileFromApi()
      .subscribe({

        next: (profile: any) => {

          this.user = profile;

          this.cdr.detectChanges();

        },

        error: (error: any) => {

          console.error(
            'Failed to load profile:',
            error
          );

          this.user = null;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // CHANGE PASSWORD
  // =========================

  changePassword(): void {

    this.message = '';

    this.errorMessage = '';


    // =========================
    // CURRENT PASSWORD
    // =========================

    if (!this.currentPassword.trim()) {

      this.errorMessage =
        'Please enter your current password.';

      this.cdr.detectChanges();

      return;

    }


    // =========================
    // NEW PASSWORD
    // =========================

    if (!this.newPassword) {

      this.errorMessage =
        'Please enter your new password.';

      this.cdr.detectChanges();

      return;

    }


    // =========================
    // PASSWORD LENGTH
    // =========================

    if (this.newPassword.length < 8) {

      this.errorMessage =
        'New password must be at least 8 characters.';

      this.cdr.detectChanges();

      return;

    }


    // =========================
    // UPPERCASE
    // =========================

    if (!/[A-Z]/.test(this.newPassword)) {

      this.errorMessage =
        'Password must contain at least one uppercase letter.';

      this.cdr.detectChanges();

      return;

    }


    // =========================
    // LOWERCASE
    // =========================

    if (!/[a-z]/.test(this.newPassword)) {

      this.errorMessage =
        'Password must contain at least one lowercase letter.';

      this.cdr.detectChanges();

      return;

    }


    // =========================
    // NUMBER
    // =========================

    if (!/[0-9]/.test(this.newPassword)) {

      this.errorMessage =
        'Password must contain at least one number.';

      this.cdr.detectChanges();

      return;

    }


    // =========================
    // CONFIRM PASSWORD
    // =========================

    if (!this.confirmPassword) {

      this.errorMessage =
        'Please confirm your new password.';

      this.cdr.detectChanges();

      return;

    }


    // =========================
    // MATCH
    // =========================

    if (
      this.newPassword !==
      this.confirmPassword
    ) {

      this.errorMessage =
        'New passwords do not match.';

      this.cdr.detectChanges();

      return;

    }


    // =========================
    // START API
    // =========================

    this.loading = true;

    this.cdr.detectChanges();


    this.apiService
      .changePassword({

        current_password:
          this.currentPassword,

        new_password:
          this.newPassword

      })

      .subscribe({

        // =========================
        // SUCCESS
        // =========================

        next: (response: any) => {

          this.loading = false;


          if (
            response?.success === true
          ) {

            this.message =
              response?.message ||
              'Password changed successfully.';


            // Clear password fields

            this.currentPassword = '';

            this.newPassword = '';

            this.confirmPassword = '';


            this.showCurrentPassword = false;

            this.showNewPassword = false;

            this.showConfirmPassword = false;


            this.cdr.detectChanges();

            return;

          }


          this.errorMessage =
            response?.message ||
            'Password change failed.';


          this.cdr.detectChanges();

        },


        // =========================
        // ERROR
        // =========================

        error: (error: any) => {

          console.error(
            'Change Password API Error:',
            error
          );


          this.loading = false;


          this.errorMessage =
            error?.error?.message ||
            'Unable to change password.';


          this.cdr.detectChanges();

        }

      });

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