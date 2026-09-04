import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Profile } from '../../models/profile.model';
import { ApiService } from '../../services/api';

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

  isInterestSent = false;
  isShortlisted = false;
  isInterestAccepted = true;
  isContactVisible = false;
  private returnUrl = '/user-home';

  touchStartX = 0;
  touchEndX = 0;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
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
    this.isLoading = true;
    this.profile = null;
    this.isInterestSent = false;
    this.isShortlisted = false;
    this.isInterestAccepted = false;
    this.isContactVisible = false;

    this.apiService.getProfileView(memberId).subscribe({
      next: (response: any) => {
        console.log('PROFILE VIEW API RESPONSE:', response);

        if (!response?.success || !response?.data?.profile) {
          this.profile = null;
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }

        this.profile = response.data.profile as Profile;
        this.isInterestAccepted =
          response?.data?.is_interest_accepted === true ||
          response?.data?.is_interest_accepted === 1;

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error: any) => {
        console.error('PROFILE VIEW API ERROR:', error);

        this.profile = null;
        this.isInterestAccepted = false;
        this.isContactVisible = false;
        this.isLoading = false;

        this.cdr.detectChanges();
      }
    });
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

    if (this.isInterestSent) {
      return;
    }

    this.isInterestSent = true;

    console.log(
      'Interest sent to:',
      this.profile.memberId
    );
  }

  toggleShortlist(): void {

    if (!this.profile) {
      return;
    }

    this.isShortlisted =
      !this.isShortlisted;

    console.log(
      this.isShortlisted
        ? 'Shortlisted:'
        : 'Removed from shortlist:',
      this.profile.memberId
    );
  }
  viewContact(): void {

  if (!this.profile) {
    return;
  }

  if (!this.isInterestAccepted) {
    return;
  }

  this.isContactVisible = true;
}
}
