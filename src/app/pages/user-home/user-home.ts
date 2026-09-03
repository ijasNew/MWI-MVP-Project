import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { Router } from '@angular/router';

import { UserMenu }
  from '../../components/user-menu/user-menu';

import { ProfileService }
  from '../../services/profile';

import {
  ProfileCompletionService
} from '../../services/profile-completion';

import { ApiService }
  from '../../services/api';

import { ProfileCompletionPopupService }
  from '../../services/profile-completion-popup';

import { Profile }
  from '../../models/profile.model';

import { CommonModule }
  from '@angular/common';


interface MatchingProfile {

  memberId: string;

  name: string;

  age: number | null;

  maritalStatus: string;

  district: string;

  religion: string;

  education: string;

  photoUrl: string | null;

  verified: boolean;

}


@Component({

  selector: 'app-user-home',

  standalone: true,

  imports: [
    UserMenu,
    CommonModule
  ],

  templateUrl: './user-home.html',

  styleUrl: './user-home.css'

})


export class UserHome
  implements OnInit {


  user: Profile | null = null;


  profileCompletion = 0;

  profileComplete = false;




  matchingProfiles:
    MatchingProfile[] = [];


  matchingProfilesLoading = true;


  constructor(

    private router: Router,

    private profileService:
      ProfileService,

    private profileCompletionService:
      ProfileCompletionService,

    private cdr:
      ChangeDetectorRef,

    private apiService:
      ApiService,

    private profileCompletionPopupService:
      ProfileCompletionPopupService

  ) { }


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {


    console.log(
      '🔥 USER HOME → load profile'
    );


    this.profileService
      .getCurrentProfileFromApi()
      .subscribe({

        next:
          (profile:
            Profile | null) => {


            console.log(
              'USER HOME PROFILE API:',
              profile
            );


            if (!profile) {

              this.user = null;

              this.profileCompletion = 0;

              this.profileComplete = false;

              this.cdr.detectChanges();

              return;

            }


            this.user = profile;


            /*
             * IMPORTANT:
             * Do NOT use 90% here.
             *
             * Completion is checked from
             * the real backend API.
             */

            this.loadRealProfileCompletionStatus();

          },


        error:
          (error: any) => {


            console.error(
              'USER HOME PROFILE API ERROR:',
              error
            );


            this.user = null;

            this.profileCompletion = 0;

            this.profileComplete = false;

            this.cdr.detectChanges();

          }

      });


    this.loadMatchingProfiles();

  }


  // =====================================================
  // REAL PROFILE COMPLETION API
  // =====================================================

  private loadRealProfileCompletionStatus():
    void {


    this.apiService
      .getProfileCompletionStatus()
      .subscribe({

        next:
          (response: any) => {


            console.log(
              '🔥 REAL PROFILE COMPLETION API:',
              response
            );


            if (!response?.success) {

              console.error(
                'PROFILE COMPLETION API FAILED:',
                response
              );


              this.profileCompletion = 0;

              this.profileComplete = false;

              this.cdr.detectChanges();

              return;

            }


            const status =
              this.profileCompletionService
                .fromApiResponse(
                  response
                );


            this.profileCompletion =
              status.requiredPercentage;


            this.profileComplete =
              status.profileComplete;


            /*
             * FINAL POPUP CONDITION
             *
             * ALL 8 required details complete
             *     → NO popup
             *
             * ANY required detail missing
             *     → SHOW popup
             */

            // Popup is now global.
            // User Home only requests it when needed.
            if (!status.profileComplete) {
              this.profileCompletionPopupService.open(
                status.requiredPercentage
              );
            }


            console.log(
              'PROFILE COMPLETION:',
              status
            );


            console.log(
              'PROFILE COMPLETE:',
              status.profileComplete
            );


            this.cdr.detectChanges();

          },


        error:
          (error: any) => {


            console.error(
              'PROFILE COMPLETION API ERROR:',
              error
            );


            /*
             * If API fails, do not show
             * a false completion popup.
             */

            this.profileCompletion = 0;

            this.profileComplete = false;

            this.cdr.detectChanges();

          }

      });

  }


  // =====================================================
  // MATCHING PROFILES
  // =====================================================

  loadMatchingProfiles(): void {


    this.matchingProfilesLoading = true;


    this.apiService
      .getMatchingProfiles()
      .subscribe({

        next:
          (response: any) => {


            console.log(
              'USER HOME MATCHING PROFILES:',
              response
            );


            if (!response?.success) {

              this.matchingProfiles = [];

              this.matchingProfilesLoading =
                false;

              this.cdr.detectChanges();

              return;

            }


            const profiles =
              Array.isArray(
                response?.data?.profiles
              )
                ? response.data.profiles
                : [];


            this.matchingProfiles =
              profiles.slice(0, 3);


            this.matchingProfilesLoading =
              false;


            this.cdr.detectChanges();

          },


        error:
          (error: any) => {


            console.error(
              'USER HOME MATCHING PROFILES ERROR:',
              error
            );


            this.matchingProfiles = [];

            this.matchingProfilesLoading =
              false;


            this.cdr.detectChanges();

          }

      });

  }


  // =====================================================
  // HOME VERIFICATION
  // =====================================================

  get isHomeVerified(): boolean {

    return this.user?.homeVerified === true;

  }


  // =====================================================
  // FORMAT HEIGHT
  // =====================================================

  formatHeight(
    totalInches: number
  ): string {


    if (!totalInches) {

      return '';

    }


    const feet =
      Math.floor(
        totalInches / 12
      );


    const inches =
      totalInches % 12;


    return `${feet}'${inches}"`;

  }


  // =====================================================
  // OPEN PROFILE
  // =====================================================

  openProfile(
    memberId: string
  ): void {


    this.router.navigate(

      [
        '/profile-view',
        memberId
      ],

      {

        state: {

          returnUrl:
            '/user-home'

        }

      }

    );

  }


  // =====================================================
  // OPEN ALL PROFILES
  // =====================================================

  openAllProfiles(): void {

    this.router.navigate([
      '/matching-profiles'
    ]);

  }
  completeProfile(): void {
    this.router.navigate(['/complete-profile']);
  }

  // =====================================================
  // OPEN VERIFICATION
  // =====================================================

  openVerification(): void {

    this.router.navigate([
      '/upgrade-profile'
    ]);

  }


}
