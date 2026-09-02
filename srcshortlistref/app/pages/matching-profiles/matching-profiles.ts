import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { UserMenu } from '../../components/user-menu/user-menu';
import { AuthService } from '../../services/auth';
import { InterestService } from '../../services/interest';
import { ShortlistService } from '../../services/shortlist';
import { ApiService } from '../../services/api';


export interface MatchingProfile {
  memberId: string;
  name: string;
  age: number | null;
  maritalStatus: string;
  district: string;
  religion: string;
  education: string;
  photoUrl: string | null;
  verified: boolean;
}


@Component({
  selector: 'app-matching-profiles',

  imports: [
    CommonModule,
    UserMenu
  ],

  templateUrl: './matching-profiles.html',
  styleUrl: './matching-profiles.css'
})
export class MatchingProfiles {

  profiles: MatchingProfile[] = [];

  loading = true;

  errorMessage = '';

  // memberIds currently shortlisted by the logged-in user
  shortlistedIds = new Set<string>();

  // memberIds currently being shortlisted/unshortlisted (disables the star while in-flight)
  shortlistBusyIds = new Set<string>();

  // memberIds an interest has already been sent to (disables the button)
  interestSentIds = new Set<string>();


  constructor(
    private router: Router,
    private authService: AuthService,
    private interestService: InterestService,
    private shortlistService: ShortlistService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadMatchingProfiles();
    this.loadShortlistState();

  }


  // =====================================================
  // LOAD MATCHING PROFILES
  // =====================================================
  loadMatchingProfiles(): void {

    this.loading = true;
    this.errorMessage = '';
    this.profiles = [];

    this.cdr.detectChanges();


    this.apiService.getMatchingProfiles().subscribe({

      next: (response: any) => {

        if (!response?.success) {

          this.errorMessage =
            response?.message ||
            'We could not find matching profiles right now.';

          this.profiles = [];

          this.loading = false;

          this.cdr.detectChanges();

          return;
        }


        this.profiles =
          Array.isArray(response?.data?.profiles)
            ? response.data.profiles
            : [];


        this.loading = false;

        this.cdr.detectChanges();

      },


      error: (error) => {

        this.profiles = [];

        this.errorMessage =
          error?.error?.message ||
          'Something went wrong while finding profiles. Please try again.';

        this.loading = false;

        this.cdr.detectChanges();

      }

    });

  }


  // =====================================================
  // LOAD SHORTLIST STATE (so stars show correctly)
  // =====================================================

  loadShortlistState(): void {

    this.shortlistService.getShortlist().subscribe({

      next: (result) => {

        this.shortlistedIds = new Set(result.memberIds);

        this.cdr.detectChanges();

      }

    });

  }


  // =====================================================
  // OPEN PROFILE
  // =====================================================

  openProfile(memberId: string): void {

    if (!memberId) {
      return;
    }

    this.router.navigate(
      [
        '/profile-view',
        memberId
      ],
      {
        state: {
          returnUrl: '/matching-profiles'
        }
      }
    );

  }


  // =====================================================
  // SEND INTEREST
  // =====================================================

  sendInterest(
    event: Event,
    memberId: string
  ): void {

    event.stopPropagation();

    if (!memberId) {
      alert('Invalid profile.');
      return;
    }

    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      alert('Please login to send interest.');
      this.router.navigate(['/login']);
      return;
    }

    if (this.interestSentIds.has(memberId)) {
      return;
    }

    this.interestService.sendInterest(memberId).subscribe((result) => {

      if (!result.success) {
        alert(result.message);
        return;
      }

      this.interestSentIds.add(memberId);

      alert(result.message);

      this.cdr.detectChanges();

    });

  }


  // =====================================================
  // SHORTLIST
  // =====================================================

  toggleShortlist(
    event: Event,
    memberId: string
  ): void {

    event.stopPropagation();

    if (!memberId) {
      return;
    }

    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      alert('Please login first.');
      this.router.navigate(['/login']);
      return;
    }

    if (this.shortlistBusyIds.has(memberId)) {
      return;
    }

    this.shortlistBusyIds.add(memberId);

    const alreadyShortlisted = this.shortlistedIds.has(memberId);

    const action$ = alreadyShortlisted
      ? this.shortlistService.removeShortlist(memberId)
      : this.shortlistService.addShortlist(memberId);

    action$.subscribe((result) => {

      this.shortlistBusyIds.delete(memberId);

      if (!result.success) {
        alert(result.message);
        this.cdr.detectChanges();
        return;
      }

      if (alreadyShortlisted) {
        this.shortlistedIds.delete(memberId);
      } else {
        this.shortlistedIds.add(memberId);
      }

      this.cdr.detectChanges();

    });

  }


  isShortlisted(memberId: string): boolean {
    return this.shortlistedIds.has(memberId);
  }

}
