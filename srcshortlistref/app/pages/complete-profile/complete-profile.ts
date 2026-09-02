import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserMenu } from '../../components/user-menu/user-menu';

import {
  ProfileCompletionService,
  ProfileCompletionStatus
} from '../../services/profile-completion';

import { ProfileService } from '../../services/profile';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [UserMenu],
  templateUrl: './complete-profile.html',
  styleUrl: './complete-profile.css'
})
export class CompleteProfile implements OnInit {

  physicalCompleted = false;
  contactCompleted = false;
  workCompleted = false;
  familyCompleted = false;
  additionalPreferencesCompleted = false;
  expectationsCompleted = false;
  photosCompleted = false;

  completionPercentage = 0;


  constructor(
    private router: Router,
    private profileService: ProfileService,
    private profileCompletionService: ProfileCompletionService
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    // Clear edit-source flag when entering
    // Complete Profile normally.
    sessionStorage.removeItem(
      'mwi_edit_source'
    );

    this.calculateProfileCompletion();
  }


  // =====================================================
  // CALCULATE PROFILE COMPLETION
  // =====================================================

  calculateProfileCompletion(): void {

    const profile =
      this.profileService.getCurrentProfile();


    if (!profile) {

      this.resetCompletion();

      return;
    }


    const status: ProfileCompletionStatus =
      this.profileCompletionService.getStatus(
        profile
      );


    // -----------------------------------------------------
    // Percentage
    // -----------------------------------------------------

    this.completionPercentage =
      status.percentage;


    // -----------------------------------------------------
    // Section status
    // -----------------------------------------------------

    this.physicalCompleted =
      status.physical;

    this.contactCompleted =
      status.contact;

    this.workCompleted =
      status.work;

    this.familyCompleted =
      status.family;

    this.additionalPreferencesCompleted =
      status.additionalPreferences;

    this.expectationsCompleted =
      status.expectations;

    this.photosCompleted =
      status.photos;
  }


  // =====================================================
  // RESET
  // =====================================================

  private resetCompletion(): void {

    this.completionPercentage = 0;

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