import { Injectable } from '@angular/core';
import { Profile } from '../models/profile.model';


export interface ProfileCompletionRequired {

  physical_status: boolean;

  work_location: boolean;

  preferred_family_status: boolean;

  preferred_physical_status: boolean;

  preferred_location_radius: boolean;

  family_background: boolean;

  photo: boolean;

  whatsapp_number: boolean;

}


export interface ProfileCompletionStatus {

  percentage: number;

  profileComplete: boolean;

  completedCount: number;

  requiredCount: number;

  required: ProfileCompletionRequired;

  photoCount: number;

}


@Injectable({
  providedIn: 'root'
})
export class ProfileCompletionService {


  constructor() { }


  /*
  |--------------------------------------------------------------------------
  | REAL API RESPONSE → FRONTEND STATUS
  |--------------------------------------------------------------------------
  */

  fromApiResponse(
    response: any
  ): ProfileCompletionStatus {

    const data =
      response?.data ?? {};

    const required =
      data?.required ?? {};


    return {

      percentage:
        Number(
          data?.percentage ?? 0
        ),

      profileComplete:
        data?.profile_complete === true,

      completedCount:
        Number(
          data?.completed_count ?? 0
        ),

      requiredCount:
        Number(
          data?.required_count ?? 7
        ),

      required: {

        physical_status:
          required?.physical_status === true,

        work_location:
          required?.work_location === true,

        preferred_family_status:
          required?.preferred_family_status === true,

        preferred_physical_status:
          required?.preferred_physical_status === true,

        preferred_location_radius:
          required?.preferred_location_radius === true,

        family_background:
          required?.family_background === true,

        photo:
          required?.photo === true,

        whatsapp_number:
          required?.whatsapp_number === true,

      },

      photoCount:
        Number(
          data?.photo_count ?? 0
        )

    };

  }


  /*
  |--------------------------------------------------------------------------
  | LOCAL STATUS
  |--------------------------------------------------------------------------
  |
  | Used only for section display if a Profile object is already available.
  | Final Home popup decision uses the REAL API.
  |
  */

  getStatus(
    profile: Profile | null
  ): ProfileCompletionStatus {


    if (!profile) {

      return this.emptyStatus();

    }


    const physicalStatus =
      !!profile.physicalStatus;


    const workLocation =
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


    const preferredFamilyStatus =
      Array.isArray(
        profile.preferredFamilyStatus
      ) &&
      profile.preferredFamilyStatus.length > 0;


    const preferredPhysicalStatus =
      Array.isArray(
        profile.preferredPhysicalStatus
      ) &&
      profile.preferredPhysicalStatus.length > 0;


    const preferredLocationRadius =
      Array.isArray(
        profile.preferredLocationRadius
      ) &&
      profile.preferredLocationRadius.length > 0;


    const familyBackground =
      !!profile.familyStatus;


    const photo =
      Number(
        profile.photoCount ?? 0
      ) > 0;

    const whatsappNumber =
      !!profile.whatsappNumber;


    const required = {

      physical_status:
        physicalStatus,

      work_location:
        workLocation,

      preferred_family_status:
        preferredFamilyStatus,

      preferred_physical_status:
        preferredPhysicalStatus,

      preferred_location_radius:
        preferredLocationRadius,

      family_background:
        familyBackground,

      photo:
        photo,

      whatsapp_number:
        whatsappNumber
    };


    const completedCount =
      Object.values(required)
        .filter(Boolean)
        .length;


    return {

      percentage:
        Math.round(
          (
            completedCount /
            7
          ) * 100
        ),

      profileComplete:
        completedCount === 7,

      completedCount,

      requiredCount: 7,

      required,

      photoCount:
        Number(
          profile.photoCount ?? 0
        )

    };

  }


  calculate(
    profile: Profile | null
  ): number {

    return this.getStatus(
      profile
    ).percentage;

  }


  private emptyStatus():
    ProfileCompletionStatus {

    return {

      percentage: 0,

      profileComplete: false,

      completedCount: 0,

      requiredCount: 8,

      required: {

        physical_status: false,

        work_location: false,

        preferred_family_status: false,

        preferred_physical_status: false,

        preferred_location_radius: false,

        family_background: false,

        photo: false,

        whatsapp_number: false,

      },

      photoCount: 0

    };

  }

}