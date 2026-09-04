import { Injectable } from '@angular/core';
import { Profile } from '../models/profile.model';
import { ApiService } from './api'; 
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly PROFILE_KEY = 'mwi_registration';

  constructor(
    private apiService: ApiService
  ) { }


  // =====================================================
  // GET CURRENT USER PROFILE
  // =====================================================

getCurrentProfile(): Profile | null {

  const data = sessionStorage.getItem(
    this.PROFILE_KEY
  );

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data) as Profile;
  } catch (error) {
    console.error(
      'Failed to read saved profile:',
      error
    );

    return null;
  }
}

  getCurrentProfileFromApi(): Observable<Profile | null> {

    return forkJoin({

      profileResponse: this.apiService.getMyProfile(),
      photoResponse: this.apiService.getProfilePhotos()
    }).pipe(

      map(({ profileResponse, photoResponse }: any) => {

        const response = profileResponse;
        console.log(  
          'PROFILE SERVICE API RESPONSE:',
          response
        );

        if (!response?.success) {
          return null;
        }

        
        const data = response?.data || {};

        const users =
          data?.user || {};

        const dbProfile =
          data?.profile || {};

        const preferences =
          data?.preferences || {};

        const preferenceValues =
          Array.isArray(data?.preference_values)
            ? data.preference_values
            : [];

        // =================================================
        // DATE OF BIRTH
        // =================================================

        let dobDay = '';
        let dobMonth = '';
        let dobYear = '';
        let age: number | null = null;

        const dob =
          dbProfile?.date_of_birth;

        if (dob) {

          const parts =
            String(dob).split('-');

          if (parts.length === 3) {

            dobYear = parts[0];
            dobMonth = parts[1];
            dobDay = parts[2];

            const birthDate =
              new Date(
                Number(dobYear),
                Number(dobMonth) - 1,
                Number(dobDay)
              );

            const today =
              new Date();

            age =
              today.getFullYear() -
              birthDate.getFullYear();

            const monthDifference =
              today.getMonth() -
              birthDate.getMonth();

            if (
              monthDifference < 0 ||
              (
                monthDifference === 0 &&
                today.getDate() <
                birthDate.getDate()
              )
            ) {
              age--;
            }
          }
        }


        // =================================================
        // PREFERENCE VALUES
        // =================================================

        const valuesByType =
          (type: string): string[] => {

            return preferenceValues
              .filter(
                (item: any) =>
                  item?.preference_type === type
              )
              .map(
                (item: any) =>
                  String(item?.value ?? '')
              )
              .filter(
                (value: string) =>
                  value !== ''
              );
          };


        // =================================================
        // FINAL ANGULAR PROFILE OBJECT
        // =================================================

        const profile: Profile = {

          // =========================
          // ACCOUNT
          // =========================

          memberId:
            users?.member_id || '',

          phone:
            users?.phone || '',


          // =========================
          // BASIC
          // =========================

          profileFor:
            dbProfile?.profile_for || '',

          gender:
            dbProfile?.gender || '',

          fullName:
            dbProfile?.full_name || '',

          maritalStatus:
            dbProfile?.marital_status || '',

          hasKids:
            dbProfile?.has_kids || '',

          numberOfKids:
            dbProfile?.number_of_kids != null
              ? String(dbProfile.number_of_kids)
              : '',

          kidsLivingStatus:
            dbProfile?.kids_living_status || '',

          dobDay,
          dobMonth,
          dobYear,

          age,

          height:
            Number(dbProfile?.height || 0),


          // =========================
          // LOCATION
          // =========================

          district:
            dbProfile?.district || '',

          state:
            dbProfile?.state || '',

          pincode:
            dbProfile?.pincode || '',

          houseName:
            dbProfile?.house_name || '',

          place:
            dbProfile?.place || '',

          latitude:
            dbProfile?.latitude != null
              ? Number(dbProfile.latitude)
              : undefined,

          longitude:
            dbProfile?.longitude != null
              ? Number(dbProfile.longitude)
              : undefined,

          locationSource:
            dbProfile?.location_source || undefined,


          // =========================
          // RELIGION
          // =========================

          religion:
            dbProfile?.religion || '',

          sect:
            dbProfile?.sect || '',

          muslimGroup:
            dbProfile?.muslim_group || '',

          salafiGroup:
            dbProfile?.salafi_group || '',

          caste:
            dbProfile?.caste || '',

          subCaste:
            dbProfile?.sub_caste || '',

          nakshatra:
            dbProfile?.nakshatra || '',

          rashi:
            dbProfile?.rashi || '',

          dosham:
            dbProfile?.dosham || '',

          denomination:
            dbProfile?.denomination || '',

          christianSubGroup:
            dbProfile?.christian_sub_group || '',

          parishName:
            dbProfile?.parish_name || '',


          // =========================
          // EDUCATION
          // =========================

          highestEducation:
            dbProfile?.highest_education || '',

          specialization:
            dbProfile?.specialization || '',

          jobTitle:
            dbProfile?.job_title || '',

          jobSector:
            dbProfile?.job_sector || '',


          // =========================
          // PHYSICAL
          // =========================

          weight:
            dbProfile?.weight != null
              ? Number(dbProfile.weight)
              : undefined,

          bodyType:
            dbProfile?.body_type || '',

          complexion:
            dbProfile?.complexion || '',

          physicalStatus:
            dbProfile?.physical_status || '',


          // =========================
          // CONTACT
          // =========================

          secondaryMobile:
            dbProfile?.secondary_mobile || '',

          whatsappCountryCode:
            dbProfile?.whatsapp_country_code || '',

          whatsappNumber:
            dbProfile?.whatsapp_number || '',

          email:
            dbProfile?.email ||
            users?.email ||
            '',


          // =========================
          // WORK
          // =========================

          collegeUniversity:
            dbProfile?.college_university || '',

          companyName:
            dbProfile?.company_name || '',

          annualIncome:
            dbProfile?.annual_income || '',

          workLocation:
            dbProfile?.work_location || '',

          workLocationType:
            dbProfile?.work_location_type || '',

          workState:
            dbProfile?.work_state || '',

          workDistrict:
            dbProfile?.work_district || '',

          workCountry:
            dbProfile?.work_country || '',

          workCity:
            dbProfile?.work_city || '',


          // =========================
          // FAMILY
          // =========================

          fatherName:
            dbProfile?.father_name || '',

          fatherOccupation:
            dbProfile?.father_occupation || '',

          fatherStatus:
            dbProfile?.father_status || '',

          motherName:
            dbProfile?.mother_name || '',

          motherOccupation:
            dbProfile?.mother_occupation || '',

          motherStatus:
            dbProfile?.mother_status || '',

          brothers:
            dbProfile?.brothers != null
              ? Number(dbProfile.brothers)
              : null,

          sisters:
            dbProfile?.sisters != null
              ? Number(dbProfile.sisters)
              : null,

          marriedBrothers:
            dbProfile?.married_brothers != null
              ? Number(dbProfile.married_brothers)
              : null,

          marriedSisters:
            dbProfile?.married_sisters != null
              ? Number(dbProfile.married_sisters)
              : null,

          familyStatus:
            dbProfile?.family_status || '',

          homeType:
            dbProfile?.home_type || '',


          // =========================
          // PARTNER PREFERENCES
          // =========================

          preferredAgeMin:
            Number(
              preferences?.age_min || 0
            ),

          preferredAgeMax:
            Number(
              preferences?.age_max || 0
            ),

          preferredHeightMin:
            Number(
              preferences?.height_min || 0
            ),

          preferredHeightMax:
            Number(
              preferences?.height_max || 0
            ),

          preferredReligion:
            preferences?.preferred_religion || '',

          acceptanceOfKids:
            preferences?.acceptance_of_kids || '',

          preferredMaritalStatus:
            valuesByType(
              'marital_status'
            ),

          preferredSects:
            valuesByType('sect'),

          preferredSunniGroups:
            valuesByType('sunni_group'),

          preferredSalafiGroups:
            valuesByType('salafi_group'),

          preferredCaste:
            valuesByType('caste'),

          preferredSubCaste:
            valuesByType('sub_caste'),

          preferredEducation:
            valuesByType('education'),

          preferredEducationSpecific:
            valuesByType(
              'education_specific'
            ),

          preferredCareerSector:
            valuesByType(
              'career_sector'
            ),

          preferredLocations:
            valuesByType(
              'location'
            ),

          preferredFamilyStatus:
            valuesByType(
              'family_status'
            ),

          preferredPhysicalStatus:
            valuesByType(
              'physical_status'
            ),

          preferredIncome:
            valuesByType(
              'income'
            ),

          preferredComplexion:
            valuesByType(
              'complexion'
            ),

          preferredStar:
            valuesByType(
              'star'
            ),


          // =========================
          // OTHER
          // =========================

          preferredLocationRadius:
            preferences?.location_radius || '',

          horoscopeRequired:
            preferences?.horoscope_required || '',

          expectations:
            dbProfile?.expectations || '',

          photos: this.normalizeProfilePhotoUrls(
            photoResponse?.data?.photos ??
            photoResponse?.photos ??
            []
          ),


          // =========================
          // COMPLETION
          // =========================

          completionPercentage:
            dbProfile?.completion_percentage != null
              ? Number(
                dbProfile.completion_percentage
              )
              : undefined,

          physicalDetailsCompleted:
            !!dbProfile?.physical_details_completed,

          contactDetailsCompleted:
            !!dbProfile?.contact_details_completed,

          workDetailsCompleted:
            !!dbProfile?.work_details_completed,

          familyDetailsCompleted:
            !!dbProfile?.family_details_completed,

          additionalPreferencesCompleted:
            !!dbProfile?.additional_preferences_completed,

          expectationsCompleted:
            !!dbProfile?.expectations_completed,

          profilePhotosCompleted:
            !!dbProfile?.profile_photos_completed,
          registrationCompleted:
            !!dbProfile?.registration_completed,

          homeVerified:
            !!dbProfile?.home_verified,

          profileCreatedAt:
            dbProfile?.created_at || undefined,

        };


        console.log(
          'PROFILE SERVICE FINAL PROFILE:',
          profile
        );


        return profile;
      })
    );
  }

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  saveProfile(profile: Profile): void {

    sessionStorage.setItem(
      this.PROFILE_KEY,
      JSON.stringify(profile)
    );
  }


  // =====================================================
  // TEMPORARY UPDATE PROFILE
  // Work Details API is NOT implemented yet.
  // =====================================================

  updateProfile(
    changes: Partial<Profile>
  ): Profile | null {

    const data =
      sessionStorage.getItem(
        this.PROFILE_KEY
      );

    if (!data) {
      return null;
    }

    try {

      const currentProfile =
        JSON.parse(data) as Profile;

      const updatedProfile: Profile = {
        ...currentProfile,
        ...changes
      };

      this.saveProfile(
        updatedProfile
      );

      return updatedProfile;

    } catch (error) {

      console.error(
        'Failed to update temporary profile:',
        error
      );

      return null;
    }
  }


  private normalizeProfilePhotoUrls(photos: any[]): string[] {

    if (!Array.isArray(photos)) {
      return [];
    }

    const apiRoot = this.apiService.getApiRoot();
    
    return photos
      .map((photo: any) => {
        const rawUrl = String(photo?.url ?? '').trim();

        if (!rawUrl) {
          return '';
        }

        if (/^https?:\/\//i.test(rawUrl)) {
          return rawUrl;
        }

        return `${apiRoot}/${rawUrl.replace(/^\/+/, '')}`;
      })
      .filter((url: string) => url !== '')
      .slice(0, 4);
  }


  // =====================================================
  // GET PROFILE FROM SESSION
  // Temporary / registration draft only
  // =====================================================

  getSavedProfile(): Profile | null {

    const data =
      sessionStorage.getItem(
        this.PROFILE_KEY
      );

    if (!data) {
      return null;
    }

    try {

      return JSON.parse(data) as Profile;

    } catch (error) {

      console.error(
        'Failed to read saved profile:',
        error
      );

      return null;
    }
  }


  // =====================================================
  // CLEAR PROFILE
  // =====================================================

  clearProfile(): void {

    sessionStorage.removeItem(
      this.PROFILE_KEY
    );
  }

}