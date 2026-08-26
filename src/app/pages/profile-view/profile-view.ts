import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-profile-view',
  imports: [],
  templateUrl: './profile-view.html',
  styleUrl: './profile-view.css'
})
export class ProfileView implements OnInit {

  profile: Profile | null = null;

  isLoading = true;

  selectedPhoto: string | null = null;
  selectedPhotoIndex = 0;

  isPhotoViewerOpen = false;

  private returnUrl = '/user-home';

  touchStartX = 0;
  touchEndX = 0;


  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }


  ngOnInit(): void {

    if (history.state?.returnUrl === '/matching-profiles') {
      this.returnUrl = '/matching-profiles';
    }

    const memberId =
      this.route.snapshot.paramMap.get('memberId');

    if (!memberId) {

      this.isLoading = false;

      return;

    }

    this.loadProfile(memberId);

  }


   loadProfile(memberId: string): void {

  const dummyProfile: Profile = {

    // =========================
    // ACCOUNT
    // =========================

    memberId: memberId,

    phone: '9876543210',


    // =========================
    // BASIC DETAILS
    // =========================

    profileFor: 'self',

    gender: 'Female',

    fullName: 'Ayesha Fathima',

    maritalStatus: 'Never Married',

    hasKids: 'no',

    numberOfKids: '0',

    kidsLivingStatus: '',

    dobDay: '15',

    dobMonth: '06',

    dobYear: '1998',

    age: 28,

    height: 64,


    // =========================
    // LOCATION
    // =========================

    district: 'Kozhikode',

    state: 'Kerala',

    pincode: '673001',

    houseName: 'Sample House',

    place: 'Kozhikode',


    // =========================
    // RELIGION
    // =========================

    religion: 'Muslim',

    sect: 'Sunni',

    muslimGroup: 'AP-Sunni',

    salafiGroup: '',


    // =========================
    // EDUCATION & CAREER
    // =========================

    highestEducation: "Master's Degree",

    specialization: 'MSc Computer Science',

    jobTitle: 'Software Engineer',

    jobSector: 'IT',


    // =========================
    // PARTNER PREFERENCE
    // =========================

    preferredAgeMin: 28,

    preferredAgeMax: 35,

    preferredHeightMin: 60,

    preferredHeightMax: 70,

    preferredMaritalStatus: [
      'Never Married'
    ],

    acceptanceOfKids: 'no',

    preferredReligion: 'Muslim',

    preferredSects: [
      'Sunni'
    ],

    preferredSunniGroups: [
      'AP-Sunni',
      'EK-Sunni'
    ],

    preferredSalafiGroups: [],

    preferredCaste: [],

    preferredSubCaste: [],

    preferredEducation: [
      "Bachelor's Degree",
      "Master's Degree"
    ],
    preferredEducationSpecific: [],

    preferredCareerSector: [
      'IT',
      'Engineering'
    ],

    preferredLocations: [
      'Malappuram',
      'Kozhikode'
    ],


    // =========================
    // PHYSICAL DETAILS
    // =========================

    weight: 55,

    bodyType: 'Slim',

    complexion: 'Medium',

    physicalStatus: 'Normal',


    // =========================
    // CONTACT
    // =========================

    secondaryMobile: '',

    whatsappNumber: '',

    email: '',


    // =========================
    // WORK / EDUCATION
    // =========================

    collegeUniversity:
      'University of Calicut',

    annualIncome:
      '₹5 - ₹10 Lakh',

    workLocation:
      'Kozhikode',

    companyName:
      'Private IT Company',


    // =========================
    // FAMILY
    // =========================

    fatherName:
      'Abdul Rahman',

    fatherOccupation:
      'Business',

    fatherStatus:
      'Alive',

    motherName:
      'Amina',

    motherOccupation:
      'Teacher',

    motherStatus:
      'Alive',
 

     

    familyStatus:
      'Upper Middle Class',

    homeType:
      'Own House',


    // =========================
    // ADDITIONAL PREFERENCES
    // =========================

    preferredFamilyStatus: [
      'Upper Middle Class'
    ],

    preferredPhysicalStatus: [
      'Normal'
    ],



    // HINDU SPECIFIC

    horoscopeRequired:
      'no',

    
    // =========================
    // EXPECTATIONS
    // =========================

    expectations:
      'Looking for a well educated, responsible and family-oriented partner. Good character, mutual respect and understanding are important.',


    // =========================
    // PHOTOS
    // =========================

    photos: [],

    primaryPhoto: '',


    // =========================
    // PROFILE COMPLETION
    // =========================

    registrationCompleted: true,

    completionPercentage: 100,


    // =========================
    // STATUS
    // =========================

    homeVerified: true, 
    profileCreatedAt:
      '2026-08-19'
      

  };


  this.profile = dummyProfile;

  this.isLoading = false;

}

  goBack(): void {

    this.router.navigate([
      this.returnUrl
    ]);

  }


  formatHeight(
    totalInches: number
  ): string {

    if (!totalInches) {
      return '-';
    }

    const feet =
      Math.floor(totalInches / 12);

    const inches =
      totalInches % 12;

    return `${feet}'${inches}"`;

  }


  formatValue(
    value: string | undefined
  ): string {

    if (!value) {
      return '-';
    }

    const labels: Record<string, string> = {

      yes: 'Yes',
      no: 'No',

      dont_know: "Don't Know",

      with_me: 'Living with me',
      not_with_me: 'Not living with me',

      never_married: 'Never Married',
      divorced: 'Divorced',
      widowed: 'Widowed',
      separated: 'Separated',
      awaiting_divorce: 'Awaiting Divorce',

      self: 'Self',
      sister: 'Sister',
      brother: 'Brother',
      son: 'Son',
      daughter: 'Daughter',
      friend: 'Friend',
      relative: 'Relative'

    };

    return labels[value] || value;

  }
formatWorkLocation(profile: Profile): string {

  // Legacy saved value
  if (profile.workLocation) {
    return profile.workLocation;
  }

  // India
  if (
    profile.workLocationType === 'india_same_state' ||
    profile.workLocationType === 'india_other_state'
  ) {

    const parts = [
      profile.workDistrict,
      profile.workState
    ].filter(Boolean);

    return parts.length
      ? parts.join(', ')
      : '-';
  }

  // Outside India
  if (
    profile.workLocationType === 'outside_india'
  ) {

    const parts = [
      profile.workCity,
      profile.workCountry
    ].filter(Boolean);

    return parts.length
      ? parts.join(', ')
      : '-';
  }

  return '-';
}
canShowKidsDetails(): boolean {

  if (!this.profile?.maritalStatus) {
    return false;
  }

  const status = this.profile.maritalStatus
    .toString()
    .trim()
    .toLowerCase();

  return ![
    'never married',
    'never_married',
    'divorced'
  ].includes(status);
}
  formatList(
    values?: string[]
  ): string {

    if (!values?.length) {
      return '-';
    }

    return values.join(', ');

  }


  openPhotoViewer(
    photo: string,
    index: number
  ): void {

    this.selectedPhoto = photo;

    this.selectedPhotoIndex = index;

    this.isPhotoViewerOpen = true;

  }


  closePhotoViewer(): void {

    this.selectedPhoto = null;

    this.isPhotoViewerOpen = false;

  }


  nextPhoto(): void {

    if (
      !this.profile?.photos?.length
    ) {
      return;
    }

    if (
      this.selectedPhotoIndex <
      this.profile.photos.length - 1
    ) {

      this.selectedPhotoIndex++;

      this.selectedPhoto =
        this.profile.photos[
        this.selectedPhotoIndex
        ];

    }

  }


  previousPhoto(): void {

    if (
      !this.profile?.photos?.length
    ) {
      return;
    }

    if (
      this.selectedPhotoIndex > 0
    ) {

      this.selectedPhotoIndex--;

      this.selectedPhoto =
        this.profile.photos[
        this.selectedPhotoIndex
        ];

    }

  }


  handlePhotoTouchStart(
    event: TouchEvent
  ): void {

    this.touchStartX =
      event.changedTouches[0].screenX;

  }


  handlePhotoTouchEnd(
    event: TouchEvent
  ): void {

    this.touchEndX =
      event.changedTouches[0].screenX;

    const distance =
      this.touchStartX -
      this.touchEndX;

    if (
      Math.abs(distance) < 50
    ) {
      return;
    }

    if (distance > 0) {

      this.nextPhoto();

    } else {

      this.previousPhoto();

    }

  }


  sendInterest(): void {

    if (!this.profile) {
      return;
    }

    console.log(
      'Send interest:',
      this.profile.memberId
    );

  }


  toggleShortlist(): void {

    if (!this.profile) {
      return;
    }

    console.log(
      'Shortlist:',
      this.profile.memberId
    );

  }

}
