import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserMenu } from '../../components/user-menu/user-menu';

@Component({
  selector: 'app-help-us-improve',
  imports: [FormsModule,UserMenu],
  templateUrl: './help-us-improve.html',
  styleUrl: './help-us-improve.css'
})
export class HelpUsImprove {

  feedbackType = '';
  feedbackMessage = '';

  feedbackSubmitted = false;


  submitFeedback(): void {

    // Temporary UI submission
    // Backend/API will be connected later.

    if (
      !this.feedbackType ||
      !this.feedbackMessage.trim()
    ) {
      return;
    }

    this.feedbackSubmitted = true;

  }


  closeSuccessPopup(): void {

    this.feedbackSubmitted = false;

    this.feedbackType = '';
    this.feedbackMessage = '';

  }

}