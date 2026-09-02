import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  UserMenu
} from '../../components/user-menu/user-menu';

import {
  ApiService
} from '../../services/api';


@Component({
  selector: 'app-help-us-improve',

  imports: [
    FormsModule,
    UserMenu
  ],

  templateUrl: './help-us-improve.html',

  styleUrl: './help-us-improve.css'
})


export class HelpUsImprove {

  feedbackType = '';

  feedbackMessage = '';

  feedbackSubmitted = false;

  loading = false;

  errorMessage = '';


  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // SUBMIT FEEDBACK
  // =====================================================

  submitFeedback(): void {

    this.errorMessage = '';

    // Prevent double submission
    if (this.loading) {
      return;
    }


    // ===================================================
    // VALIDATE FEEDBACK TYPE
    // ===================================================

    if (!this.feedbackType) {

      this.errorMessage =
        'Please select a feedback type.';

      this.cdr.detectChanges();

      return;
    }


    // ===================================================
    // VALIDATE MESSAGE
    // ===================================================

    const message =
      this.feedbackMessage.trim();

    if (!message) {

      this.errorMessage =
        'Please enter your feedback.';

      this.cdr.detectChanges();

      return;
    }


    // ===================================================
    // START API REQUEST
    // ===================================================

    this.loading = true;

    this.cdr.detectChanges();


    this.apiService
      .submitFeedback({

        feedback_type:
          this.feedbackType,

        message:
          message

      })
      .subscribe({

        // =================================================
        // SUCCESS
        // =================================================

        next: (response: any) => {

          console.log(
            'FEEDBACK API RESPONSE:',
            response
          );


          this.loading = false;


          if (
            response?.success === true
          ) {

            this.feedbackSubmitted = true;

            this.cdr.detectChanges();

            return;
          }


          // API returned failure
          this.errorMessage =
            response?.message ||
            'Unable to submit feedback.';

          this.cdr.detectChanges();

        },


        // =================================================
        // ERROR
        // =================================================

        error: (error: any) => {

          console.error(
            'FEEDBACK API ERROR:',
            error
          );


          this.loading = false;


          this.errorMessage =
            error?.error?.message ||
            'Unable to submit feedback. Please try again.';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CLOSE SUCCESS POPUP
  // =====================================================

  closeSuccessPopup(): void {

    this.feedbackSubmitted = false;

    this.feedbackType = '';

    this.feedbackMessage = '';

    this.errorMessage = '';

    this.loading = false;

    this.cdr.detectChanges();

  }

}