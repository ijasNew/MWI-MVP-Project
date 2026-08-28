import { Injectable } from '@angular/core';
import { Profile } from '../models/profile.model';

export interface MatchResult {

  percentage: number;

  age: boolean;

  height: boolean;

  religion: boolean;

  maritalStatus: boolean;

  location: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MatchingService {

  constructor() {}


  // =====================================================
  // CALCULATE MATCH
  // =====================================================

  calculateMatch(
    currentUser: Profile,
    candidate: Profile
  ): MatchResult {

    const ageMatch =
      this.checkAge(
        currentUser,
        candidate
      );

    const heightMatch =
      this.checkHeight(
        currentUser,
        candidate
      );

    const religionMatch =
      this.checkReligion(
        currentUser,
        candidate
      );

    const maritalStatusMatch =
      this.checkMaritalStatus(
        currentUser,
        candidate
      );

    const locationMatch =
      this.checkLocation(
        currentUser,
        candidate
      );


    // =====================================================
    // WEIGHTS
    // =====================================================

    const weights = {
      age: 20,
      height: 10,
      religion: 20,
      maritalStatus: 15,
      location: 15
    };


    let score = 0;


    if (ageMatch) {
      score += weights.age;
    }

    if (heightMatch) {
      score += weights.height;
    }

    if (religionMatch) {
      score += weights.religion;
    }

    if (maritalStatusMatch) {
      score += weights.maritalStatus;
    }

    if (locationMatch) {
      score += weights.location;
    }


    return {

      percentage: score,

      age: ageMatch,

      height: heightMatch,

      religion: religionMatch,

      maritalStatus:
        maritalStatusMatch,

      location:
        locationMatch
    };
  }


  // =====================================================
  // AGE
  // =====================================================

  private checkAge(
    currentUser: Profile,
    candidate: Profile
  ): boolean {

    if (
      candidate.age === null ||
      candidate.age === undefined
    ) {
      return false;
    }


    const min =
      Number(
        currentUser.preferredAgeMin
      );

    const max =
      Number(
        currentUser.preferredAgeMax
      );


    if (
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      min <= 0 ||
      max <= 0
    ) {
      return false;
    }


    return (
      candidate.age >= min &&
      candidate.age <= max
    );
  }


  // =====================================================
  // HEIGHT
  // =====================================================

  private checkHeight(
    currentUser: Profile,
    candidate: Profile
  ): boolean {

    const min =
      Number(
        currentUser.preferredHeightMin
      );

    const max =
      Number(
        currentUser.preferredHeightMax
      );

    const candidateHeight =
      Number(candidate.height);


    if (
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      !Number.isFinite(candidateHeight)
    ) {
      return false;
    }


    if (
      min <= 0 ||
      max <= 0 ||
      candidateHeight <= 0
    ) {
      return false;
    }


    return (
      candidateHeight >= min &&
      candidateHeight <= max
    );
  }


  // =====================================================
  // RELIGION
  // =====================================================

  private checkReligion(
    currentUser: Profile,
    candidate: Profile
  ): boolean {

    if (
      !currentUser.preferredReligion ||
      !candidate.religion
    ) {
      return false;
    }


    return (
      currentUser.preferredReligion
        .trim()
        .toLowerCase() ===
      candidate.religion
        .trim()
        .toLowerCase()
    );
  }


  // =====================================================
  // MARITAL STATUS
  // =====================================================

  private checkMaritalStatus(
    currentUser: Profile,
    candidate: Profile
  ): boolean {

    const preferred =
      currentUser.preferredMaritalStatus;


    if (
      !Array.isArray(preferred) ||
      preferred.length === 0
    ) {
      return false;
    }


    return preferred.some(
      status =>
        status
          .trim()
          .toLowerCase() ===
        candidate.maritalStatus
          .trim()
          .toLowerCase()
    );
  }


  // =====================================================
  // LOCATION
  // =====================================================

  private checkLocation(
    currentUser: Profile,
    candidate: Profile
  ): boolean {

    const preferredLocations =
      currentUser.preferredLocations;


    if (
      !Array.isArray(
        preferredLocations
      ) ||
      preferredLocations.length === 0
    ) {
      return false;
    }


    if (!candidate.district) {
      return false;
    }


    const candidateDistrict =
      candidate.district
        .trim()
        .toLowerCase();


    return preferredLocations.some(
      location =>
        location
          .trim()
          .toLowerCase() ===
        candidateDistrict
    );
  }

}