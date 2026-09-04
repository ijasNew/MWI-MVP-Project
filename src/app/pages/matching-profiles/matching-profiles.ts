import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserMenu } from '../../components/user-menu/user-menu';
import { AuthService } from '../../services/auth';
import { InterestService } from '../../services/interest';
import { ApiService } from '../../services/api'; 
import { ChangeDetectorRef } from '@angular/core';


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
  interest_status?: string;
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

  // Interest state for each matching profile.
  // Values: none | outgoing_pending | incoming_pending |
  //         accepted | declined | sending
  interestStates = new Map<string, string>();
  interestIds = new Map<string, string>();
  interestActionLoadingIds = new Set<string>();

  // Shortlist state
shortlistedIds = new Set<string>();
shortlistLoadingIds = new Set<string>();

  loading = true;

  errorMessage = '';
// HOME VERIFICATION
isHomeVerified = false;
isVerificationLoading = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private interestService: InterestService,
    private apiService: ApiService,
     private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadMatchingProfiles();
     this.loadShortlist();
     this.loadVerificationStatus();

  }
  // =====================================================
// HOME VERIFICATION STATUS
// =====================================================

private loadVerificationStatus(): void {

  this.isVerificationLoading = true;

  this.apiService.getVerificationStatus().subscribe({

    next: (response: any) => {

      if (response?.success) {

        this.isHomeVerified =
          response?.data?.verification_completed === true ||
          Number(
            response?.data?.profile?.home_verified
          ) === 1;

      } else {

        this.isHomeVerified = false;

      }

      this.isVerificationLoading = false;

      this.cdr.detectChanges();

    },

    error: (error: any) => {

      console.error(
        'VERIFICATION STATUS ERROR:',
        error
      );

      // Fail closed:
      // If verification status cannot be confirmed,
      // photos remain blurred.

      this.isHomeVerified = false;

      this.isVerificationLoading = false;

      this.cdr.detectChanges();

    }

  });

}
  private loadShortlist(): void {

  this.apiService.getShortlist().subscribe({

    next: (response: any) => {

      const profiles =
        response?.data?.profiles ??
        response?.profiles ??
        [];

      if (!Array.isArray(profiles)) {
        return;
      }

      this.shortlistedIds.clear();

      for (const profile of profiles) {

        const memberId = String(
          profile?.memberId ??
          profile?.member_id ??
          ''
        ).trim();

        if (memberId) {
          this.shortlistedIds.add(memberId);
        }
      }

      this.cdr.detectChanges();

    },

    error: (error: any) => {

      console.error(
        'SHORTLIST API ERROR:',
        error
      );

    }

  });

}

  // =====================================================
  // LOAD MATCHING PROFILES
  // =====================================================
  loadMatchingProfiles(): void {

    this.loading = true;
    this.errorMessage = '';
    this.profiles = [];
    this.interestStates.clear();
    this.interestIds.clear();
    this.interestActionLoadingIds.clear();

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

        // Use the dedicated sent/received interest APIs so the button
        // state is based on the real relationship between both users.
        this.loadInterestStates();

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'MATCHING PROFILES API ERROR:',
          error
        );

        this.profiles = [];

        this.errorMessage =
          error?.error?.message ||
          'Something went wrong while finding profiles. Please try again.';

        this.loading = false;
        this.cdr.detectChanges();
      }
    });

  }

  private loadInterestStates(): void {

    const requests: any[] = [];

    requests.push(
      this.interestService.getSentInterests()
    );

    requests.push(
      this.interestService.getReceivedInterests()
    );

    let completed = 0;
    let sentItems: any[] = [];
    let receivedItems: any[] = [];

    const finish = (): void => {

      completed++;

      if (completed < requests.length) {
        return;
      }

      this.applyInterestStates(
        sentItems,
        receivedItems
      );

      this.cdr.detectChanges();
    };

    requests[0].subscribe({
      next: (response: any) => {
        sentItems = this.extractInterestItems(response);
        finish();
      },
      error: (error: any) => {
        console.error('SENT INTERESTS API ERROR:', error);
        finish();
      }
    });

    requests[1].subscribe({
      next: (response: any) => {
        receivedItems = this.extractInterestItems(response);
        finish();
      },
      error: (error: any) => {
        console.error('RECEIVED INTERESTS API ERROR:', error);
        finish();
      }
    });

  }

  private extractInterestItems(response: any): any[] {

    const items =
      response?.data?.interests ??
      response?.data?.items ??
      response?.interests ??
      response?.items ??
      [];

    return Array.isArray(items) ? items : [];
  }

  private getInterestMemberId(
    item: any,
    direction: 'sent' | 'received'
  ): string {

    if (direction === 'sent') {
      return String(
        item?.receiver_member_id ??
        item?.receiverMemberId ??
        item?.to_member_id ??
        item?.toMemberId ??
        item?.target_member_id ??
        item?.targetMemberId ??
        item?.memberId ??
        item?.member_id ??
        ''
      );
    }

    return String(
      item?.sender_member_id ??
      item?.senderMemberId ??
      item?.from_member_id ??
      item?.fromMemberId ??
      item?.memberId ??
      item?.member_id ??
      ''
    );
  }

  private applyInterestStates(
    sentItems: any[],
    receivedItems: any[]
  ): void {

    this.interestStates.clear();
    this.interestIds.clear();

    /*
     * Precedence:
     *
     * 1. Incoming pending → Accept / Decline
     * 2. Accepted → Accepted
     * 3. Declined → Declined
     * 4. Outgoing pending → Interest Sent
     * 5. Otherwise → Send Interest
     *
     * Incoming pending has priority because the user must be able
     * to respond to a request that is waiting for them.
     */

    for (const item of receivedItems) {

      const memberId =
        this.getInterestMemberId(item, 'received');

      const status =
        String(item?.status || '').trim().toLowerCase();

      if (!memberId) {
        continue;
      }

      // Cancelled interests are inactive and must never create a UI state.
      if (status === 'cancelled') {
        continue;
      }

      const interestId =
        item?.id ??
        item?.interest_id ??
        item?.interestId;

      if (status === 'pending') {
        this.interestStates.set(
          memberId,
          'incoming_pending'
        );

        // Keep the incoming interest ID because Accept/Decline
        // must operate on the request received by this user.
        if (interestId !== undefined && interestId !== null) {
          this.interestIds.set(
            memberId,
            String(interestId)
          );
        }

      } else if (status === 'accepted') {

        if (
          this.interestStates.get(memberId) !==
          'incoming_pending'
        ) {
          this.interestStates.set(
            memberId,
            'accepted'
          );

          if (
            interestId !== undefined &&
            interestId !== null &&
            !this.interestIds.has(memberId)
          ) {
            this.interestIds.set(
              memberId,
              String(interestId)
            );
          }
        }

      } else if (status === 'declined') {

        if (
          !this.interestStates.has(memberId)
        ) {
          this.interestStates.set(
            memberId,
            'declined'
          );

          if (
            interestId !== undefined &&
            interestId !== null
          ) {
            this.interestIds.set(
              memberId,
              String(interestId)
            );
          }
        }

      }

    }

    for (const item of sentItems) {

      const memberId =
        this.getInterestMemberId(item, 'sent');

      const status =
        String(item?.status || '').trim().toLowerCase();

      if (!memberId) {
        continue;
      }

      // Cancelled interests are inactive and must never create a UI state.
      if (status === 'cancelled') {
        continue;
      }

      const interestId =
        item?.id ??
        item?.interest_id ??
        item?.interestId;

      /*
       * Incoming pending/accepted/declined is authoritative for
       * a request received by the current user. Do not replace it
       * with the reverse-direction record.
       */
      const existingState =
        this.interestStates.get(memberId);

      if (
        existingState === 'incoming_pending' ||
        existingState === 'accepted' ||
        existingState === 'declined'
      ) {
        continue;
      }

      if (interestId !== undefined && interestId !== null) {
        this.interestIds.set(
          memberId,
          String(interestId)
        );
      }

      if (status === 'cancelled') {
        continue;
      }

      if (status === 'accepted') {
        this.interestStates.set(
          memberId,
          'accepted'
        );
      } else if (status === 'declined') {
        this.interestStates.set(
          memberId,
          'declined'
        );
      } else if (status === 'pending') {
        this.interestStates.set(
          memberId,
          'outgoing_pending'
        );
      }

    }

    /*
     * If matching API already supplies a relationship state,
     * use it only when the dedicated interest APIs did not give us
     * a state for that profile.
     */
    for (const profile of this.profiles as any[]) {

      if (this.interestStates.has(profile.memberId)) {
        continue;
      }

      const status =
        String(profile?.interest_status || '')
          .trim()
          .toLowerCase();

      if (status === 'accepted') {
        this.interestStates.set(
          profile.memberId,
          'accepted'
        );
      } else if (status === 'declined') {
        this.interestStates.set(
          profile.memberId,
          'declined'
        );
      } else if (
        status === 'pending' ||
        status === 'sent'
      ) {
        this.interestStates.set(
          profile.memberId,
          'outgoing_pending'
        );
      }

    }

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
          returnUrl:
            '/matching-profiles'
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

    const currentState =
      this.interestStates.get(memberId);

    if (
      currentState === 'outgoing_pending' ||
      currentState === 'accepted' ||
      currentState === 'declined' ||
      currentState === 'incoming_pending'
    ) {
      return;
    }

    const currentUser =
      this.authService.getCurrentUser();

    if (!currentUser) {
      alert('Please login to send interest.');
      this.router.navigate(['/login']);
      return;
    }

    const senderMemberId =
      currentUser.member_id;

    if (!senderMemberId) {
      alert('Unable to identify your profile.');
      return;
    }

    if (senderMemberId === memberId) {
      alert('You cannot send interest to your own profile.');
      return;
    }

    if (
      this.interestActionLoadingIds.has(memberId)
    ) {
      return;
    }

    this.interestActionLoadingIds.add(memberId);
    this.interestStates.set(memberId, 'sending');
    this.cdr.detectChanges();

    const request =
      this.interestService.sendInterest(
        senderMemberId,
        memberId
      );

    if (!request) {
      this.interestActionLoadingIds.delete(memberId);
      this.interestStates.delete(memberId);
      alert('Unable to send interest.');
      this.cdr.detectChanges();
      return;
    }

    request.subscribe({
      next: (_response: any) => {

        this.interestActionLoadingIds.delete(memberId);
        this.interestStates.set(
          memberId,
          'outgoing_pending'
        );

        this.cdr.detectChanges();
      },

      error: (error: any) => {

        this.interestActionLoadingIds.delete(memberId);
        this.interestStates.delete(memberId);

        alert(
          error?.error?.message ||
          'Unable to send interest.'
        );

        this.cdr.detectChanges();
      }
    });

  }
 
  respondToInterest(
    event: Event,
    memberId: string,
    action: 'accept' | 'decline'
  ): void {

    event.stopPropagation();

    const interestId =
      this.interestIds.get(memberId);

    if (!interestId) {
      alert('Unable to identify this interest.');
      return;
    }

    if (
      this.interestActionLoadingIds.has(memberId)
    ) {
      return;
    }

    this.interestActionLoadingIds.add(memberId);
    this.cdr.detectChanges();

    this.interestService
      .respondInterest(
        interestId,
        action
      )
      .subscribe({
        next: (_response: any) => {

          this.interestActionLoadingIds.delete(
            memberId
          );

          this.interestStates.set(
            memberId,
            action === 'accept'
              ? 'accepted'
              : 'declined'
          );

          this.cdr.detectChanges();
        },

        error: (error: any) => {

          this.interestActionLoadingIds.delete(
            memberId
          );

          alert(
            error?.error?.message ||
            'Unable to update interest.'
          );

          this.cdr.detectChanges();
        }
      });

  }

  getInterestState(memberId: string): string {
    return this.interestStates.get(memberId) || 'none';
  }

  isInterestSent(memberId: string): boolean {
    return this.getInterestState(memberId) ===
      'outgoing_pending';
  }

  isInterestSending(memberId: string): boolean {
    return this.getInterestState(memberId) ===
      'sending';
  }

  isIncomingInterest(memberId: string): boolean {
    return this.getInterestState(memberId) ===
      'incoming_pending';
  }

  isInterestAccepted(memberId: string): boolean {
    return this.getInterestState(memberId) ===
      'accepted';
  }

  isInterestDeclined(memberId: string): boolean {
    return this.getInterestState(memberId) ===
      'declined';
  }

  isInterestActionLoading(memberId: string): boolean {
    return this.interestActionLoadingIds.has(memberId);
  }

  // =====================================================
  // SHORTLIST
  // =====================================================

  isShortlisted(memberId: string): boolean {

  return this.shortlistedIds.has(
    memberId
  );

}

isShortlistLoading(memberId: string): boolean {

  return this.shortlistLoadingIds.has(
    memberId
  );

}


  toggleShortlist(
  event: Event,
  memberId: string
): void {

  event.stopPropagation();

  if (!memberId) {
    return;
  }

  const currentUser =
    this.authService.getCurrentUser();

  if (!currentUser) {

    this.router.navigate([
      '/login'
    ]);

    return;
  }

  const senderMemberId =
    currentUser.member_id;

  if (!senderMemberId) {
    return;
  }

  if (senderMemberId === memberId) {
    return;
  }

  if (
    this.shortlistLoadingIds.has(memberId)
  ) {
    return;
  }

  const isCurrentlyShortlisted =
    this.shortlistedIds.has(memberId);

  this.shortlistLoadingIds.add(memberId);

  this.cdr.detectChanges();

  const request =
    isCurrentlyShortlisted
      ? this.apiService.removeShortlist(memberId)
      : this.apiService.addShortlist(memberId);

  request.subscribe({

    next: (_response: any) => {

      this.shortlistLoadingIds.delete(
        memberId
      );

      if (isCurrentlyShortlisted) {

        // Remove from shortlist
        this.shortlistedIds.delete(
          memberId
        );

      } else {

        // Add to shortlist
        this.shortlistedIds.add(
          memberId
        );

      }

      this.cdr.detectChanges();

    },

    error: (error: any) => {

      this.shortlistLoadingIds.delete(
        memberId
      );

      console.error(
        'SHORTLIST ACTION ERROR:',
        error
      );

      this.cdr.detectChanges();

    }

  });

}
   
}