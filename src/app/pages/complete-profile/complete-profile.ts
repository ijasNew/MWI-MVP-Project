import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserMenu } from '../../components/user-menu/user-menu';
import { ProfileCompletionService } from '../../services/profile-completion';


@Component({
  selector: 'app-complete-profile',
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
    private profileCompletionService: ProfileCompletionService
  ) { }

  ngOnInit(): void {
    sessionStorage.removeItem('mwi_edit_source');

    this.calculateProfileCompletion();

  }

  calculateProfileCompletion(): void {

    const saved =
      sessionStorage.getItem(
        'mwi_registration'
      );

    if (!saved) {
      return;
    }

    try {

      const profile =
        JSON.parse(saved);


      // Calculate using shared service

      this.completionPercentage =
        this.profileCompletionService.calculate(
          profile
        );



      this.physicalCompleted =
        !!(
          profile.weight &&
          profile.bodyType &&
          profile.complexion &&
          profile.physicalStatus
        );


      this.contactCompleted =
        !!(
          profile.secondaryMobile ||
          profile.whatsappNumber ||
          profile.email
        );


      const hasWorkLocation =
        !!(
          profile.workLocation ||
          (
            profile.workLocationType &&
            (
              (
                (
                  profile.workLocationType === 'india_same_state' ||
                  profile.workLocationType === 'india_other_state'
                ) &&
                profile.workState &&
                profile.workDistrict
              ) ||
              (
                profile.workLocationType === 'outside_india' &&
                profile.workCountry &&
                profile.workCity
              )
            )
          )
        );

      this.workCompleted =
        !!(
          profile.collegeUniversity ||
          profile.companyName ||
          hasWorkLocation ||
          profile.annualIncome != null
        );


      this.familyCompleted =
        !!(
          profile.fatherName ||
          profile.motherName ||
          profile.brothers != null ||
          profile.sisters != null ||
          profile.marriedBrothers != null ||
          profile.marriedSisters != null ||
          profile.familyStatus ||
          profile.homeType
        );


      this.additionalPreferencesCompleted =
        !!(
          profile.preferredFamilyStatus?.length ||
          profile.preferredPhysicalStatus?.length ||
          profile.preferredIncome?.length ||
          profile.preferredLocationRadius?.length ||
          profile.preferredComplexion?.length ||
          profile.horoscopeRequired ||
          profile.preferredStar?.length
        );


      this.expectationsCompleted =
        !!(
          profile.expectations &&
          profile.expectations.trim().length > 0
        );


      this.photosCompleted =
        !!(
          profile.photoCount &&
          profile.photoCount > 0
        );


    } catch (error) {

      console.error(
        'Unable to calculate profile completion',
        error
      );

    }

  }
  openPhysicalDetails(): void {

    this.router.navigate([
      '/physical-details'
    ]);

  }
  openContactDetails(): void {
    this.router.navigate(['/contact-details']);
  }
  openWorkDetails(): void {
    this.router.navigate(['/work-details']);
  }
  openFamilyDetails(): void {
    this.router.navigate(['/family-details']);
  }
  openAdditionalPreferences(): void {
    this.router.navigate(['/additional-preferences']);
  }
  openExpectations(): void {
    this.router.navigate(['/expectations']);
  }
  openProfilePhotos(): void {
    this.router.navigate(['/profile-photos']);
  }
}
