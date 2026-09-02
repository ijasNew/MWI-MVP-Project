import { Injectable } from '@angular/core';
import { Profile } from '../models/profile.model';

export interface ProfileCompletionStatus {
  percentage: number;

  basic: boolean;
  location: boolean;
  religion: boolean;
  education: boolean;
  preference: boolean;
  physical: boolean;
  contact: boolean;
  work: boolean;
  family: boolean;
  additionalPreferences: boolean;
  expectations: boolean;
  photos: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileCompletionService {

  constructor() {}


  // =====================================================
  // PUBLIC
  // =====================================================

  calculate(profile: Profile | null): number {

    return this.getStatus(profile).percentage;
  }


  // =====================================================
  // COMPLETE STATUS
  // =====================================================

  getStatus(
    profile: Profile | null
  ): ProfileCompletionStatus {

    if (!profile) {

      return {
        percentage: 0,

        basic: false,
        location: false,
        religion: false,
        education: false,
        preference: false,
        physical: false,
        contact: false,
        work: false,
        family: false,
        additionalPreferences: false,
        expectations: false,
        photos: false
      };
    }


    // ===================================================
    // 01 BASIC DETAILS
    // ===================================================

    const basic =
      !!(
        profile.fullName?.trim() &&
        profile.gender &&
        profile.age &&
        profile.maritalStatus &&
        profile.height
      );


    // ===================================================
    // 02 LOCATION
    // ===================================================

    const location =
      !!(
        profile.houseName?.trim() &&
        profile.place?.trim() &&
        profile.district &&
        profile.pincode
      );


    // ===================================================
    // 03 RELIGION & COMMUNITY
    // ===================================================

    const religion =
      !!(
        profile.religion &&
        profile.preferredReligion
      );


    // ===================================================
    // 04 EDUCATION & CAREER
    // ===================================================

    const education =
      !!(
        profile.highestEducation &&
        profile.specialization &&
        profile.jobTitle &&
        profile.jobSector
      );


    // ===================================================
    // 05 PARTNER PREFERENCE
    // ===================================================

    const preference =
      !!(
        profile.preferredAgeMin != null &&
        profile.preferredAgeMax != null &&
        profile.preferredHeightMin != null &&
        profile.preferredHeightMax != null &&
        profile.preferredMaritalStatus?.length &&
        profile.preferredReligion &&
        profile.preferredLocations?.length
      );


    // ===================================================
    // 06 PHYSICAL DETAILS
    // ===================================================

    const physical =
      !!(
        profile.weight &&
        profile.bodyType &&
        profile.complexion &&
        profile.physicalStatus
      );


    // ===================================================
    // 07 CONTACT INFORMATION
    // ===================================================

    const contact =
      !!(
        profile.phone ||
        profile.whatsappNumber ||
        profile.secondaryMobile ||
        profile.email
      );


    // ===================================================
    // 08 WORK DETAILS
    // ===================================================

    const hasWorkLocation =
      !!(
        profile.workLocation ||
        (
          profile.workLocationType &&
          (
            (
              (
                profile.workLocationType ===
                  'india_same_state' ||
                profile.workLocationType ===
                  'india_other_state'
              ) &&
              profile.workState &&
              profile.workDistrict
            ) ||
            (
              profile.workLocationType ===
                'outside_india' &&
              profile.workCountry &&
              profile.workCity
            )
          )
        )
      );


    const work =
      !!(
        profile.collegeUniversity?.trim() ||
        profile.companyName?.trim() ||
        hasWorkLocation ||
        profile.annualIncome
      );


    // ===================================================
    // 09 FAMILY DETAILS
    // ===================================================

    const family =
      !!(
        profile.fatherName?.trim() ||
        profile.motherName?.trim() ||
        profile.brothers != null ||
        profile.sisters != null ||
        profile.marriedBrothers != null ||
        profile.marriedSisters != null ||
        profile.familyStatus ||
        profile.homeType
      );


    // ===================================================
    // 10 ADDITIONAL PREFERENCES
    // ===================================================

    const additionalPreferences =
      !!(
        profile.preferredFamilyStatus?.length ||
        profile.preferredPhysicalStatus?.length ||
        profile.preferredIncome?.length ||
        profile.preferredLocationRadius?.length ||
        profile.preferredComplexion?.length ||
        profile.horoscopeRequired ||
        profile.preferredStar?.length
      );


    // ===================================================
    // 11 EXPECTATIONS
    // ===================================================

    const expectations =
      !!(
        profile.expectations &&
        profile.expectations.trim().length > 0
      );


    // ===================================================
    // 12 PROFILE PHOTOS
    // ===================================================

    const photos =
      !!(
        profile.photoCount &&
        profile.photoCount > 0
      );


    // ===================================================
    // ALL SECTIONS
    // ===================================================

    const sections = [
      basic,
      location,
      religion,
      education,
      preference,
      physical,
      contact,
      work,
      family,
      additionalPreferences,
      expectations,
      photos
    ];


    const completedSections =
      sections.filter(Boolean).length;


    const percentage =
      Math.round(
        (
          completedSections /
          sections.length
        ) * 100
      );


    // ===================================================
    // RETURN
    // ===================================================

    return {

      percentage,

      basic,

      location,

      religion,

      education,

      preference,

      physical,

      contact,

      work,

      family,

      additionalPreferences,

      expectations,

      photos
    };
  }

}