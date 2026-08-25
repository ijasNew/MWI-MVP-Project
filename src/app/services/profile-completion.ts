import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileCompletionService {

  constructor() {}


  calculate(profile: any): number {

    if (!profile) {
      return 0;
    }


    // =========================
    // 01 BASIC DETAILS
    // =========================

    const basicCompleted =
      !!(
        profile.fullName &&
        profile.gender &&
        profile.age &&
        profile.maritalStatus &&
        profile.height
      );


    // =========================
    // 02 LOCATION
    // =========================

    const locationCompleted =
      !!(
        profile.houseName &&
        profile.place &&
        profile.district &&
        profile.pincode
      );


    // =========================
    // 03 RELIGION & COMMUNITY
    // =========================

    const religionCompleted =
      !!(
        profile.religion &&
        profile.preferredReligion
      );


    // =========================
    // 04 EDUCATION & CAREER
    // =========================

    const educationCompleted =
      !!(
        profile.highestEducation &&
        profile.specialization &&
        profile.jobTitle &&
        profile.jobSector
      );


    // =========================
    // 05 PARTNER PREFERENCE
    // =========================

    const preferenceCompleted =
      !!(
        profile.preferredAgeMin != null &&
        profile.preferredAgeMax != null &&
        profile.preferredHeightMin != null &&
        profile.preferredHeightMax != null &&
        profile.preferredMaritalStatus?.length &&
        profile.preferredReligion &&
        profile.preferredLocations?.length
      );


    // =========================
    // 06 PHYSICAL DETAILS
    // =========================

    const physicalCompleted =
      !!(
        profile.weight &&
        profile.bodyType &&
        profile.complexion &&
        profile.physicalStatus
      );


    // =========================
    // 07 CONTACT INFORMATION
    // =========================

    const contactCompleted =
      !!(
        profile.secondaryMobile ||
        profile.whatsappNumber ||
        profile.email
      );


    // =========================
    // 08 WORK & EDUCATION
    // =========================

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

    const workCompleted =
      !!(
        profile.collegeUniversity ||
        profile.companyName ||
        hasWorkLocation ||
        profile.annualIncome != null
      );


    // =========================
    // 09 FAMILY DETAILS
    // =========================

    const familyCompleted =
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


    // =========================
    // 10 ADDITIONAL PREFERENCES
    // =========================

    const additionalPreferencesCompleted =
      !!(
        profile.preferredFamilyStatus?.length ||
        profile.preferredPhysicalStatus?.length ||
        profile.preferredIncome?.length ||
        profile.preferredLocationRadius?.length ||
        profile.preferredComplexion?.length ||
        profile.horoscopeRequired ||
        profile.preferredStar?.length
      );


    // =========================
    // 11 EXPECTATIONS
    // =========================

    const expectationsCompleted =
      !!(
        profile.expectations &&
        profile.expectations.trim().length > 0
      );


    // =========================
    // 12 PROFILE PHOTOS
    // =========================

    const photosCompleted =
      !!(
        profile.photoCount &&
        profile.photoCount > 0
      );


    const sections = [

      basicCompleted,
      locationCompleted,
      religionCompleted,
      educationCompleted,
      preferenceCompleted,
      physicalCompleted,
      contactCompleted,
      workCompleted,
      familyCompleted,
      additionalPreferencesCompleted,
      expectationsCompleted,
      photosCompleted

    ];


    const completedSections =
      sections.filter(Boolean).length;


    return Math.round(
      (
        completedSections /
        sections.length
      ) * 100
    );

  }

}
