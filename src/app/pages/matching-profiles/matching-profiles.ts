import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserMenu } from '../../components/user-menu/user-menu';

import { AuthService } from '../../services/auth';
import { InterestService } from '../../services/interest';

@Component({
  selector: 'app-matching-profiles',
  imports: [
    UserMenu
  ],
  templateUrl: './matching-profiles.html',
  styleUrl: './matching-profiles.css'
})
export class MatchingProfiles {

  constructor(
    private router: Router,
    private authService: AuthService,
    private interestService: InterestService
  ) {}


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


    // ---------------------------------------------------
    // Target profile validation
    // ---------------------------------------------------

    if (!memberId) {

      alert(
        'Invalid profile.'
      );

      return;
    }


    // ---------------------------------------------------
    // Get logged-in user
    // ---------------------------------------------------

    const currentUser =
      this.authService.getCurrentUser();


    if (!currentUser) {

      alert(
        'Please login to send interest.'
      );

      this.router.navigate([
        '/login'
      ]);

      return;
    }


    const senderMemberId =
      currentUser.memberId;


    // ---------------------------------------------------
    // Current user ID validation
    // ---------------------------------------------------

    if (!senderMemberId) {

      alert(
        'Unable to identify your profile.'
      );

      return;
    }


    // ---------------------------------------------------
    // Prevent sending interest to own profile
    // ---------------------------------------------------

    if (
      senderMemberId === memberId
    ) {

      alert(
        'You cannot send interest to your own profile.'
      );

      return;
    }


    // ---------------------------------------------------
    // Send interest through service
    // ---------------------------------------------------

    const success =
      this.interestService.sendInterest(
        senderMemberId,
        memberId
      );


    if (!success) {

      alert(
        'Unable to send interest.'
      );

      return;
    }


    // ---------------------------------------------------
    // Temporary success message
    // ---------------------------------------------------

    alert(
      'Interest sent successfully.'
    );

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


    const currentUser =
      this.authService.getCurrentUser();


    if (!currentUser) {

      alert(
        'Please login first.'
      );

      this.router.navigate([
        '/login'
      ]);

      return;
    }


    const senderMemberId =
      currentUser.memberId;


    if (!senderMemberId) {

      alert(
        'Unable to identify your profile.'
      );

      return;
    }


    if (
      senderMemberId === memberId
    ) {

      alert(
        'You cannot shortlist your own profile.'
      );

      return;
    }


    /*
     * Shortlist API will be connected later.
     *
     * For now we only confirm that:
     *
     * current user + target profile
     *
     * are correctly identified.
     */

    console.log(
      'Shortlist:',
      senderMemberId,
      '→',
      memberId
    );

  }

}