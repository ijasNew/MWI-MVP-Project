import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminMenu } from '../admin-menu/admin-menu';

interface ProfilePreference {
  ageMin: number;
  ageMax: number;

  locations: string[];

  maritalStatuses: string[];

  education: string[];

  heightMin: number;
  heightMax: number;
}

interface MatchProfile {
  id: string;
  name: string;

  gender: 'Male' | 'Female';

  age: number;

  place: string;
  district: string;

  height: number;

  maritalStatus: string;

  highestEducation: string;

  photo?: string;

  preferences: ProfilePreference;
}

interface MatchResult {
  profile: MatchProfile;

  score: number;

  ageMatch: boolean;
  placeMatch: boolean;
  maritalStatusMatch: boolean;
  educationMatch: boolean;
  heightMatch: boolean;

  matchedCount: number;
  totalCriteria: number;
}


@Component({
  selector: 'app-admin-find-match',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    AdminMenu
  ],

  templateUrl: './admin-find-match.html',

  styleUrl: './admin-find-match.css'
})
export class AdminFindMatch {


  /* =========================
     SEARCH
  ========================= */

  memberId = '';

  searched = false;

  searchMessage = '';


  /* =========================
     SOURCE PROFILE
  ========================= */

  selectedProfile: MatchProfile | null = null;


  /* =========================
     RESULTS
  ========================= */

  matchResults: MatchResult[] = [];


  /* =========================
     SAMPLE DATA
  ========================= */

  profiles: MatchProfile[] = [

    {
      id: 'M1025',

      name: 'Mohammed Shamil',

      gender: 'Male',

      age: 29,

      place: 'Malappuram',

      district: 'Malappuram',

      height: 175,

      maritalStatus: 'Never Married',

      highestEducation: 'B.Tech',

      preferences: {

        ageMin: 23,

        ageMax: 29,

        locations: [
          'Malappuram',
          'Kozhikode'
        ],

        maritalStatuses: [
          'Never Married'
        ],

        education: [
          'B.Com',
          'B.Sc',
          'B.Tech',
          'M.A'
        ],

        heightMin: 150,

        heightMax: 170

      }

    },


    {
      id: 'F1024',

      name: 'Ayesha Fathima',

      gender: 'Female',

      age: 27,

      place: 'Kozhikode',

      district: 'Kozhikode',

      height: 160,

      maritalStatus: 'Never Married',

      highestEducation: 'B.Com',

      preferences: {

        ageMin: 27,

        ageMax: 34,

        locations: [
          'Malappuram',
          'Kozhikode'
        ],

        maritalStatuses: [
          'Never Married'
        ],

        education: [
          'B.Tech',
          'MBA'
        ],

        heightMin: 165,

        heightMax: 185

      }

    },


    {
      id: 'F1026',

      name: 'Hiba Nazeera',

      gender: 'Female',

      age: 25,

      place: 'Malappuram',

      district: 'Malappuram',

      height: 158,

      maritalStatus: 'Never Married',

      highestEducation: 'M.A',

      preferences: {

        ageMin: 27,

        ageMax: 33,

        locations: [
          'Malappuram'
        ],

        maritalStatuses: [
          'Never Married'
        ],

        education: [
          'B.Tech',
          'B.Sc',
          'M.Tech'
        ],

        heightMin: 165,

        heightMax: 180

      }

    },


    {
      id: 'F1028',

      name: 'Raniya Fathima',

      gender: 'Female',

      age: 26,

      place: 'Kannur',

      district: 'Kannur',

      height: 162,

      maritalStatus: 'Never Married',

      highestEducation: 'B.Sc',

      preferences: {

        ageMin: 27,

        ageMax: 32,

        locations: [
          'Kannur',
          'Kozhikode',
          'Malappuram'
        ],

        maritalStatuses: [
          'Never Married'
        ],

        education: [
          'B.Tech',
          'B.Sc'
        ],

        heightMin: 165,

        heightMax: 185

      }

    },


    {
      id: 'F1030',

      name: 'Safa Mariyam',

      gender: 'Female',

      age: 30,

      place: 'Palakkad',

      district: 'Palakkad',

      height: 155,

      maritalStatus: 'Divorced',

      highestEducation: 'MBA',

      preferences: {

        ageMin: 28,

        ageMax: 36,

        locations: [
          'Palakkad',
          'Malappuram'
        ],

        maritalStatuses: [
          'Never Married',
          'Divorced'
        ],

        education: [
          'B.Tech',
          'MBA'
        ],

        heightMin: 165,

        heightMax: 185

      }

    }

  ];


  constructor(
    private router: Router
  ) {}


  /* =========================
     FIND MATCH
  ========================= */

  findMatches(): void {

    this.searched = true;

    this.selectedProfile = null;

    this.matchResults = [];

    this.searchMessage = '';


    const id =
      this.memberId
        .trim()
        .toLowerCase();


    if (!id) {

      this.searchMessage =
        'Enter a Member ID to find matches.';

      return;

    }


    const profile =
      this.profiles.find(
        item =>
          item.id.toLowerCase() === id
      );


    if (!profile) {

      this.searchMessage =
        'No profile found with this Member ID.';

      return;

    }


    this.selectedProfile = profile;


    const candidates =
      this.profiles
        .filter(
          item =>
            item.id !== profile.id &&
            item.gender !== profile.gender
        );


    this.matchResults =
      candidates
        .map(candidate =>
          this.calculateMatch(
            profile,
            candidate
          )
        )
        .sort(
          (a, b) =>
            b.score - a.score
        );


    if (this.matchResults.length === 0) {

      this.searchMessage =
        'No suitable profiles found.';

    }

  }


  /* =========================
     MATCH CALCULATION
  ========================= */

  private calculateMatch(
    source: MatchProfile,
    candidate: MatchProfile
  ): MatchResult {


    /*
     * A match is considered from BOTH sides:
     *
     * 1. Source profile preference
     * 2. Candidate profile preference
     *
     * This prevents showing a profile that
     * matches only one person's preference.
     */


    const sourceAgeMatch =
      this.isAgeMatch(
        candidate.age,
        source.preferences
      );


    const candidateAgeMatch =
      this.isAgeMatch(
        source.age,
        candidate.preferences
      );


    const ageMatch =
      sourceAgeMatch &&
      candidateAgeMatch;


    const sourcePlaceMatch =
      this.isLocationMatch(
        candidate,
        source.preferences
      );


    const candidatePlaceMatch =
      this.isLocationMatch(
        source,
        candidate.preferences
      );


    const placeMatch =
      sourcePlaceMatch &&
      candidatePlaceMatch;


    const sourceMaritalMatch =
      this.isIncluded(
        candidate.maritalStatus,
        source.preferences.maritalStatuses
      );


    const candidateMaritalMatch =
      this.isIncluded(
        source.maritalStatus,
        candidate.preferences.maritalStatuses
      );


    const maritalStatusMatch =
      sourceMaritalMatch &&
      candidateMaritalMatch;


    const sourceEducationMatch =
      this.isEducationMatch(
        candidate.highestEducation,
        source.preferences.education
      );


    const candidateEducationMatch =
      this.isEducationMatch(
        source.highestEducation,
        candidate.preferences.education
      );


    const educationMatch =
      sourceEducationMatch &&
      candidateEducationMatch;


    const sourceHeightMatch =
      this.isHeightMatch(
        candidate.height,
        source.preferences
      );


    const candidateHeightMatch =
      this.isHeightMatch(
        source.height,
        candidate.preferences
      );


    const heightMatch =
      sourceHeightMatch &&
      candidateHeightMatch;


    const criteria = [

      ageMatch,

      placeMatch,

      maritalStatusMatch,

      educationMatch,

      heightMatch

    ];


    const matchedCount =
      criteria.filter(Boolean).length;


    const totalCriteria =
      criteria.length;


    const score =
      Math.round(
        (
          matchedCount /
          totalCriteria
        ) * 100
      );


    return {

      profile: candidate,

      score,

      ageMatch,

      placeMatch,

      maritalStatusMatch,

      educationMatch,

      heightMatch,

      matchedCount,

      totalCriteria

    };

  }


  /* =========================
     AGE
  ========================= */

  private isAgeMatch(
    age: number,
    preference: ProfilePreference
  ): boolean {

    return (

      age >= preference.ageMin &&

      age <= preference.ageMax

    );

  }


  /* =========================
     LOCATION
  ========================= */

  private isLocationMatch(
    profile: MatchProfile,
    preference: ProfilePreference
  ): boolean {

    if (
      !preference.locations ||
      preference.locations.length === 0
    ) {

      return false;

    }


    return preference.locations.some(
      location =>

        location.toLowerCase() ===
        profile.place.toLowerCase()

        ||

        location.toLowerCase() ===
        profile.district.toLowerCase()
    );

  }


  /* =========================
     EDUCATION
  ========================= */

  private isEducationMatch(
    education: string,
    preferredEducation: string[]
  ): boolean {

    if (
      !preferredEducation ||
      preferredEducation.length === 0
    ) {

      return false;

    }


    return preferredEducation.some(
      item =>
        item.toLowerCase() ===
        education.toLowerCase()
    );

  }


  /* =========================
     HEIGHT
  ========================= */

  private isHeightMatch(
    height: number,
    preference: ProfilePreference
  ): boolean {

    return (

      height >= preference.heightMin &&

      height <= preference.heightMax

    );

  }


  /* =========================
     ARRAY VALUE
  ========================= */

  private isIncluded(
    value: string,
    values: string[]
  ): boolean {

    if (
      !values ||
      values.length === 0
    ) {

      return false;

    }


    return values.some(
      item =>
        item.toLowerCase() ===
        value.toLowerCase()
    );

  }


  /* =========================
     VIEW PROFILE
  ========================= */

  viewProfile(
    memberId: string
  ): void {

    this.router.navigate([
      '/admin/profile-view',
      memberId
    ]);

  }


  /* =========================
     CLEAR
  ========================= */

  clearSearch(): void {

    this.memberId = '';

    this.searched = false;

    this.selectedProfile = null;

    this.matchResults = [];

    this.searchMessage = '';

  }


  /* =========================
     DASHBOARD
  ========================= */

  openDashboard(): void {

    this.router.navigate([
      '/admin/dashboard'
    ]);

  }


  /* =========================
     SCORE LABEL
  ========================= */

  getScoreLabel(
    score: number
  ): string {

    if (score >= 80) {

      return 'Strong Match';

    }

    if (score >= 60) {

      return 'Good Match';

    }

    if (score >= 40) {

      return 'Partial Match';

    }

    return 'Low Match';

  }


  /* =========================
     SCORE CLASS
  ========================= */

  getScoreClass(
    score: number
  ): string {

    if (score >= 80) {

      return 'strong';

    }

    if (score >= 60) {

      return 'good';

    }

    if (score >= 40) {

      return 'partial';

    }

    return 'low';

  }

}