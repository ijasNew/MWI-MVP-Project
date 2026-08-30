import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserMenu } from '../../components/user-menu/user-menu';
import { AuthService } from '../../services/auth';
import { InterestService } from '../../services/interest';
import { ApiService } from '../../services/api'; 
import { ChangeDetectorRef } from '@angular/core';


export interface MatchingProfile {
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
  selector: 'app-matching-profiles',

  imports: [
    CommonModule,
    UserMenu
  ],

  templateUrl: './matching-profiles.html',
  styleUrl: './matching-profiles.css'
})
export class MatchingProfiles {

  profiles: MatchingProfile[] = [];

  loading = true;

  errorMessage = '';


  constructor(
    private router: Router,
    private authService: AuthService,
    private interestService: InterestService,
    private apiService: ApiService,
     private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadMatchingProfiles();

  }


  // =====================================================
  // LOAD MATCHING PROFILES
  // =====================================================
  loadMatchingProfiles(): void {

  this.loading = true;
  this.errorMessage = '';
  this.profiles = [];

  this.cdr.detectChanges();


  this.apiService.getMatchingProfiles().subscribe({

    next: (response: any) => {

      console.log(
        'MATCHING PROFILES API RESPONSE:',
        response
      );


      if (!response?.success) {

        this.errorMessage =
          response?.message ||
          'We could not find matching profiles right now.';

        this.profiles = [];

        this.loading = false;

        this.cdr.detectChanges();

        return;
      }


      this.profiles =
        Array.isArray(response?.data?.profiles)
          ? response.data.profiles
          : [];


      console.log(
        'MATCHING PROFILES:',
        this.profiles
      );


      // IMPORTANT
      // API response received.
      // Stop loading and refresh Angular UI.

      this.loading = false;

      this.cdr.detectChanges();

    },


    error: (error) => {

      console.error(
        'MATCHING PROFILES API ERROR:',
        error
      );


      this.profiles = [];


      this.errorMessage =
        error?.error?.message ||
        'Something went wrong while finding profiles. Please try again.';


      this.loading = false;

      this.cdr.detectChanges();

    }

  });

}
  

  // =====================================================
  // OPEN PROFILE
  // =====================================================

  openProfile(memberId: string): void {

    if (!memberId) {
      return;
    }


    this.router.navigate(
      [
        '/profile-view',
        memberId
      ],
      {
        state: {
          returnUrl:
            '/matching-profiles'
        }
      }
    );

  }


  // =====================================================
  // SEND INTEREST
  // =====================================================

  sendInterest(
    event: Event,
    memberId: string
  ): void {

    event.stopPropagation();


    if (!memberId) {

      alert(
        'Invalid profile.'
      );

      return;
    }


    const currentUser =
      this.authService.getCurrentUser();


    if (!currentUser) {

      alert(
        'Please login to send interest.'
      );

      this.router.navigate([
        '/login'
      ]);

      return;
    }


    const senderMemberId =
      currentUser.memberId;


    if (!senderMemberId) {

      alert(
        'Unable to identify your profile.'
      );

      return;
    }


    if (
      senderMemberId === memberId
    ) {

      alert(
        'You cannot send interest to your own profile.'
      );

      return;
    }


    const success =
      this.interestService.sendInterest(
        senderMemberId,
        memberId
      );


    if (!success) {

      alert(
        'Unable to send interest.'
      );

      return;
    }


    alert(
      'Interest sent successfully.'
    );

  }


  // =====================================================
  // SHORTLIST
  // =====================================================

  toggleShortlist(
    event: Event,
    memberId: string
  ): void {

    event.stopPropagation();


    if (!memberId) {
      return;
    }


    const currentUser =
      this.authService.getCurrentUser();


    if (!currentUser) {

      alert(
        'Please login first.'
      );

      this.router.navigate([
        '/login'
      ]);

      return;
    }


    const senderMemberId =
      currentUser.memberId;


    if (!senderMemberId) {

      alert(
        'Unable to identify your profile.'
      );

      return;
    }


    if (
      senderMemberId === memberId
    ) {

      alert(
        'You cannot shortlist your own profile.'
      );

      return;
    }


    console.log(
      'Shortlist:',
      senderMemberId,
      '→',
      memberId
    );

  }

}