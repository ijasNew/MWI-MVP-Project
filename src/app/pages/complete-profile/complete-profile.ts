import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { Router } from '@angular/router';

import { UserMenu }
  from '../../components/user-menu/user-menu';

import {
  ProfileCompletionService,
  ProfileCompletionStatus
} from '../../services/profile-completion';

import { ProfileService }
  from '../../services/profile';

import { ApiService }
  from '../../services/api';


@Component({

  selector: 'app-complete-profile',

  standalone: true,

  imports: [UserMenu],

  templateUrl: './complete-profile.html',

  styleUrl: './complete-profile.css'

})


export class CompleteProfile
  implements OnInit {


  physicalCompleted = false;

  contactCompleted = false;

  workCompleted = false;

  familyCompleted = false;

  additionalPreferencesCompleted = false;

  expectationsCompleted = false;

  photosCompleted = false;


  profileComplete = false;

  completionPercentage = 0;


  constructor(

    private router: Router,

    private profileService:
      ProfileService,

    private profileCompletionService:
      ProfileCompletionService,

    private apiService:
      ApiService,

    private cdr:
      ChangeDetectorRef

  ) { }


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {


    sessionStorage.removeItem(
      'mwi_edit_source'
    );


    this.loadCompletionStatus();

  }


  // =====================================================
  // REAL API
  // =====================================================

  private loadCompletionStatus(): void {


    this.apiService
      .getProfileCompletionStatus()
      .subscribe({

        next:
          (response: any) => {


            console.log(
              '🔥 COMPLETE PROFILE → REAL API:',
              response
            );


            if (!response?.success) {

              this.resetCompletion();

              this.cdr.detectChanges();

              return;

            }


            const status:
              ProfileCompletionStatus =
              this.profileCompletionService
                .fromApiResponse(
                  response
                );


            this.completionPercentage =
              status.requiredPercentage;


            this.profileComplete =
              status.profileComplete;


            /*
             * REQUIRED:
             *
             * Physical Status
             */

            this.physicalCompleted =
              status.required
                .physical_status;


            /*
             * REQUIRED:
             *
             * Work Location
             */

            this.workCompleted =
              status.required
                .work_location;


            /*
             * REQUIRED:
             *
             * All 3 Additional Preference
             * fields must be completed.
             */

            this.additionalPreferencesCompleted =

              status.required
                .preferred_family_status

              &&

              status.required
                .preferred_physical_status

              &&

              status.required
                .preferred_location_radius;


            /*
             * REQUIRED:
             *
             * Family Background
             */

            this.familyCompleted =
              status.required
                .family_background;


            /*
             * REQUIRED:
             *
             * Photo
             */

            this.photosCompleted =
              status.required
                .photo;



            this.contactCompleted =
              status.required.whatsapp_number === true;

            this.expectationsCompleted = false;


            console.log(
              'FINAL PROFILE STATUS:',
              status
            );


            this.cdr.detectChanges();

          },


        error:
          (error: any) => {


            console.error(
              'COMPLETE PROFILE API ERROR:',
              error
            );


            this.resetCompletion();

            this.cdr.detectChanges();

          }

      });

  }


  // =====================================================
  // RESET
  // =====================================================

  private resetCompletion(): void {


    this.completionPercentage = 0;

    this.profileComplete = false;


    this.physicalCompleted = false;

    this.contactCompleted = false;

    this.workCompleted = false;

    this.familyCompleted = false;

    this.additionalPreferencesCompleted = false;

    this.expectationsCompleted = false;

    this.photosCompleted = false;

  }


  // =====================================================
  // NAVIGATION
  // =====================================================

  openPhysicalDetails(): void {

    this.router.navigate([
      '/physical-details'
    ]);

  }


  openContactDetails(): void {

    this.router.navigate([
      '/contact-details'
    ]);

  }


  openWorkDetails(): void {

    this.router.navigate([
      '/work-details'
    ]);

  }


  openFamilyDetails(): void {

    this.router.navigate([
      '/family-details'
    ]);

  }


  openAdditionalPreferences(): void {

    this.router.navigate([
      '/additional-preferences'
    ]);

  }


  openExpectations(): void {

    this.router.navigate([
      '/expectations'
    ]);

  }


  openProfilePhotos(): void {

    this.router.navigate([
      '/profile-photos'
    ]);

  }

}