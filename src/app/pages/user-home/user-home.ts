import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserMenu } from '../../components/user-menu/user-menu';

import { ProfileService } from '../../services/profile';
import { ProfileCompletionService } from '../../services/profile-completion';

import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [UserMenu],
  templateUrl: './user-home.html',
  styleUrl: './user-home.css'
})
export class UserHome implements OnInit {

  user: Profile | null = null;

  profileCompletion = 0;

  showProfilePopup = false;


  constructor(
    private router: Router,
    private profileService: ProfileService,
    private profileCompletionService: ProfileCompletionService
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    // -----------------------------------------------------
    // Get current user's profile
    // -----------------------------------------------------

    const profile =
      this.profileService.getCurrentProfile();


    if (!profile) {
      return;
    }


    this.user = profile;


    // -----------------------------------------------------
    // Calculate profile completion
    // -----------------------------------------------------

    this.profileCompletion =
      this.profileCompletionService.calculate(
        profile
      );


    // -----------------------------------------------------
    // Show completion popup
    // -----------------------------------------------------

    if (this.profileCompletion < 90) {
      this.showProfilePopup = true;
    }
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