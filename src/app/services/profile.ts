import { Injectable } from '@angular/core';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly PROFILE_KEY = 'mwi_registration';

  constructor() {}

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
        'Failed to read profile data',
        error
      );

      return null;
    }
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
  // UPDATE PROFILE
  // =====================================================

  updateProfile(
    changes: Partial<Profile>
  ): Profile | null {

    const currentProfile =
      this.getCurrentProfile();

    if (!currentProfile) {
      return null;
    }

    const updatedProfile: Profile = {
      ...currentProfile,
      ...changes
    };

    this.saveProfile(updatedProfile);

    return updatedProfile;
  }


  // =====================================================
  // GET PROFILE BY MEMBER ID
  // =====================================================

  getProfileByMemberId(
    memberId: string
  ): Profile | null {

    const profile =
      this.getCurrentProfile();

    if (!profile) {
      return null;
    }

    if (profile.memberId !== memberId) {
      return null;
    }

    return profile;
  }


  // =====================================================
  // CHECK PROFILE EXISTS
  // =====================================================

  hasProfile(): boolean {

    return this.getCurrentProfile() !== null;

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