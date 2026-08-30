import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  AuthService
} from '../../services/auth';


@Component({
  selector: 'app-login',

  imports: [
    FormsModule,
    RouterLink
  ],

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
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}


  // =========================
  // CHECK EXISTING LOGIN
  // =========================

  ngOnInit(): void {

    if (this.authService.isUserLoggedIn()) {

      this.router.navigate([
        '/user-home'
      ]);

      return;
    }

  }


  // =========================
  // LOGIN
  // =========================

  login(): void {

    // Clear previous error
    this.errorMessage = '';

    const phone =
      this.phone.trim();


    // =========================
    // PHONE VALIDATION
    // =========================

    if (!/^[0-9]{10}$/.test(phone)) {

      this.errorMessage =
        'Please enter a valid 10 digit mobile number.';

      this.cdr.detectChanges();

      return;
    }


    // =========================
    // PASSWORD VALIDATION
    // =========================

    if (!this.password) {

      this.errorMessage =
        'Please enter your password.';

      this.cdr.detectChanges();

      return;
    }


    // =========================
    // START LOADING
    // =========================

    this.loading = true;

    this.cdr.detectChanges();


    // =========================
    // LOGIN API
    // =========================

    this.authService
      .login(phone, this.password)
      .subscribe({

        // =========================
        // API RESPONSE
        // =========================

        next: (response: any) => {

          console.log(
            'Login API Response:',
            response
          );


          // Stop loading immediately
          this.loading = false;

          this.cdr.detectChanges();


          // =========================
          // SUCCESS
          // =========================

          if (response?.success === true) {

            const user =
              response?.data?.user;


            // =========================
            // SAVE LOGIN STATE + TOKEN
            // =========================
            //
            // AuthService.loginUser()
            // already saves:
            //
            // 1. mwi_token
            // 2. mwi_user_auth
            //
            // So DON'T save them again here.
            //

            this.authService.loginUser(
              response
            );


            // =========================
            // PENDING USER
            // =========================

            if (
              user?.account_status ===
              'pending'
            ) {

              this.router.navigate(
                ['/register'],
                {
                  queryParams: {
                    resume: 'true'
                  }
                }
              );

              return;
            }


            // =========================
            // ACTIVE USER
            // =========================

            if (
              user?.account_status ===
              'active'
            ) {

              this.router.navigate([
                '/user-home'
              ]);

              return;
            }


            // =========================
            // INVALID ACCOUNT STATUS
            // =========================

            this.errorMessage =
              'Your account status is not valid.';

            this.cdr.detectChanges();

            return;
          }


          // =========================
          // LOGIN FAILED
          // =========================

          this.errorMessage =
            response?.message ||
            'Login failed.';

          this.cdr.detectChanges();

        },


        // =========================
        // HTTP ERROR
        // =========================

        error: (error: any) => {

          console.error(
            'Login API Error:',
            error
          );


          // VERY IMPORTANT
          // Stop spinner on error

          this.loading = false;


          // Show backend error
          this.errorMessage =
            error?.error?.message ||
            'Invalid mobile number or password.';


          // Force UI update

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // GO TO HOME
  // =========================

  goToHome(): void {

    this.router.navigate([
      '/'
    ]);

  }


  // =========================
  // TOGGLE PASSWORD
  // =========================

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

  }

}