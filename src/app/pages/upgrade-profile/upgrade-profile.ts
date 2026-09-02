import {
  Component,
  OnInit,
   ChangeDetectorRef
} from '@angular/core';

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


interface VerificationStatus {

  payment_status:
    | 'unpaid'
    | 'pending'
    | 'paid'
    | 'failed'
    | 'refunded';

  verification_status:
    | 'not_requested'
    | 'pending'
    | 'in_progress'
    | 'verified'
    | 'rejected'
    | 'cancelled';

  payment_received_under_review:
    boolean;

  verification_completed:
    boolean;
  current_plan: 'Free' | 'Basic';
  payment: {

    id: number | null;

    amount: number | null;

    paid_at: string | null;

  };

  verification: {

    id: number | null;

    requested_at: string | null;

    started_at: string | null;

    completed_at: string | null;

  };

  profile: {

    district: string;

    state: string;

    registration_completed: number;

    profile_status: string;

    home_verified: number;

  };

}


@Component({

  selector: 'app-upgrade-profile',

  standalone: true,

  imports: [
    UserMenu
  ],

  templateUrl: './upgrade-profile.html',

  styleUrl: './upgrade-profile.css'

})


export class UpgradeProfile
  implements OnInit {


  showServiceUnavailable =
    false;


  isCheckingLocation =
    false;


  isLoadingStatus =
    true;


  statusError =
    false;


  verificationStatus:
    VerificationStatus | null =
    null;


  /*
   * This is the main condition.
   *
   * TRUE:
   * Payment is received AND verification pending.
   */

  get isPaymentUnderReview(): boolean {

    return (
      //  this.verificationStatus?.current_plan === 'Basic' &&
    this.verificationStatus?.payment_status === 'paid' 
    // && this.verificationStatus?.verification_status === 'pending'
    );

  }


  /*
   * Already verified.
   */

  get isVerificationCompleted(): boolean {

    return (
      this.verificationStatus
        ?.verification_completed
      === true
    );

  }


  constructor(

    private router: Router,

    private profileService:
      ProfileService,

    private apiService:
      ApiService,

     private cdr: ChangeDetectorRef

  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadVerificationStatus();

  }


  // =========================================================
  // LOAD PAYMENT + VERIFICATION STATUS
  // =========================================================
  loadVerificationStatus(): void {
  this.isLoadingStatus = true;
  this.statusError = false;

  this.apiService.getVerificationStatus().subscribe({
    next: (response: any) => {
      console.log('Verification status response:', response);

      if (response?.success) {
        this.verificationStatus = response.data;
      } else {
        this.verificationStatus = null;
        this.statusError = true;
      }

      this.isLoadingStatus = false;

      this.cdr.detectChanges();
    },

    error: (error: any) => {
      console.error(
        'Failed to load verification status:',
        error
      );

      this.verificationStatus = null;
      this.statusError = true;
      this.isLoadingStatus = false;

      this.cdr.detectChanges();
    }
  });
}
 
  // =========================================================
  // CONTINUE VERIFICATION
  // =========================================================

  continueVerification(): void {

    /*
     * Safety check:
     *
     * Even if someone somehow clicks the button
     * before UI changes, do not continue if
     * payment is already received and review is pending.
     */

    if (
      this.isPaymentUnderReview
      ||
      this.isVerificationCompleted
    ) {

      return;

    }


    if (this.isCheckingLocation) {

      return;

    }


    this.showServiceUnavailable =
      false;


    this.isCheckingLocation =
      true;


    this.profileService
      .getCurrentProfileFromApi()
      .subscribe({

        next: (profile) => {

          console.log(
            'PROFILE:',
            profile
          );

          console.log(
            'DISTRICT:',
            profile?.district
          );


          this.isCheckingLocation =
            false;


          const district =
            String(
              profile?.district || ''
            )
              .trim()
              .toLowerCase();


          const allowedDistricts = [

            'malappuram',

            'kozhikode'

          ];


          if (
            allowedDistricts
              .includes(district)
          ) {

            console.log(
              'Home Verification available:',
              district
            );


            /*
             * Payment gateway will be connected
             * to this flow later.
             */

            alert(
              'Your district is eligible for verification. Proceeding to payment.'
            ); 
            return;

          }


          /*
           * Service not available
           */

          this.showServiceUnavailable =
            true;
             this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to check user location:',
            error
          );


          this.isCheckingLocation =
            false;


          this.showServiceUnavailable =
            true;

        }

      });

  }


  // =========================================================
  // CLOSE SERVICE UNAVAILABLE
  // =========================================================

  closeServiceUnavailable(): void {

    this.showServiceUnavailable =
      false;

  }


  // =========================================================
  // WHATSAPP SUPPORT
  // =========================================================

  openWhatsAppSupport(): void {

    /*
     * Replace this number with the actual
     * MatchWithIjas WhatsApp support number.
     *
     * IMPORTANT:
     * Use country code without + or spaces.
     *
     * Example:
     * 919876543210
     */

    const supportNumber =
      'YOUR_WHATSAPP_NUMBER';


    const message =
      'Hello MatchWithIjas, I have completed the Home Verification payment and my verification is still under review.';


    const whatsappUrl =
      `https://wa.me/${supportNumber}?text=${encodeURIComponent(message)}`;


    window.open(
      whatsappUrl,
      '_blank',
      'noopener,noreferrer'
    );

  }

}