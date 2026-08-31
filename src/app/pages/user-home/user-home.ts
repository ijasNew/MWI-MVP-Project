import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { Router } from '@angular/router'; 
import { UserMenu } from '../../components/user-menu/user-menu';

import { ProfileService } from '../../services/profile';
import { ProfileCompletionService } from '../../services/profile-completion';
import { ApiService } from '../../services/api';
import { Profile } from '../../models/profile.model'; 
import { CommonModule } from '@angular/common';
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
  imports: [UserMenu,CommonModule],
  templateUrl: './user-home.html',
  styleUrl: './user-home.css'
})
export class UserHome implements OnInit {

  user: Profile | null = null;

  profileCompletion = 0;

  showProfilePopup = false;
  matchingProfiles: MatchingProfile[] = [];

matchingProfilesLoading = true;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private profileCompletionService: ProfileCompletionService, 
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
  ) { }


  // =====================================================
  // INIT
  // =====================================================
  ngOnInit(): void {

  console.log('🔥 USER HOME → load profile');

  this.profileService.getCurrentProfileFromApi().subscribe({

    next: (profile: Profile | null) => {

      console.log(
        'USER HOME PROFILE API:',
        profile
      );

      if (!profile) {
        this.user = null;
        return;
      }

      this.user = profile;

      this.profileCompletion =
        this.profileCompletionService.calculate(
          profile
        );

      console.log(
        'USER HOME USER:',
        this.user
      );

      console.log(
        'PROFILE COMPLETION:',
        this.profileCompletion
      );

      if (this.profileCompletion < 90) {
        this.showProfilePopup = true;
      }
       this.cdr.detectChanges();

    },

    error: (error: any) => {

      console.error(
        'USER HOME PROFILE API ERROR:',
        error
      );

      this.user = null;

    }

  });
  this.loadMatchingProfiles();

}
 
  loadMatchingProfiles(): void {

  this.matchingProfilesLoading = true;

  this.apiService.getMatchingProfiles().subscribe({

    next: (response: any) => {

      console.log(
        'USER HOME MATCHING PROFILES:',
        response
      );

      if (!response?.success) {

        this.matchingProfiles = [];

        this.matchingProfilesLoading = false;

        this.cdr.detectChanges();

        return;
      }

      const profiles =
        Array.isArray(response?.data?.profiles)
          ? response.data.profiles
          : [];

      // Home page → maximum 3 profiles
      this.matchingProfiles =
        profiles.slice(0, 3);

      this.matchingProfilesLoading = false;

      this.cdr.detectChanges();

    },

    error: (error: any) => {

      console.error(
        'USER HOME MATCHING API ERROR:',
        error
      );

      this.matchingProfiles = [];

      this.matchingProfilesLoading = false;

      this.cdr.detectChanges();

    }

  });

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

    this.router.navigate([
      '/profile-view',
      memberId
    ], {
      state: {
        returnUrl: '/user-home'
      }
    });
  }


  // =====================================================
  // OPEN ALL PROFILES
  // =====================================================

  openAllProfiles(): void {

    this.router.navigate([
      '/matching-profiles'
    ]);
  }


  // =====================================================
  // OPEN VERIFICATION
  // =====================================================

  openVerification(): void {

    this.router.navigate([
      '/upgrade-profile'
    ]);
  }


  // =====================================================
  // CLOSE PROFILE POPUP
  // =====================================================

  closeProfilePopup(): void {

    this.showProfilePopup = false;
  }


  // =====================================================
  // COMPLETE PROFILE
  // =====================================================

  completeProfile(): void {

    this.showProfilePopup = false;

    this.router.navigate([
      '/complete-profile'
    ]);
  }

}