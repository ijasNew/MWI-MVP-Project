import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InterestService {

  constructor() {}

  // =====================================================
  // SEND INTEREST
  // =====================================================

  sendInterest(
    senderMemberId: string,
    receiverMemberId: string
  ): boolean {

    if (!senderMemberId || !receiverMemberId) {
      return false;
    }

    if (senderMemberId === receiverMemberId) {
      return false;
    }

    /*
     * Backend will handle the actual interest creation.
     *
     * Future:
     *
     * Angular
     *   ↓
     * PHP API
     *   ↓
     * MySQL
     */

    console.log(
      'Interest:',
      senderMemberId,
      '→',
      receiverMemberId
    );

    return true;
  }


  // =====================================================
  // GET SENT INTERESTS
  // =====================================================

  getSentInterests(
    memberId: string
  ): any[] {

    if (!memberId) {
      return [];
    }

    /*
     * Temporary empty result.
     *
     * Backend will return actual data later.
     */

    return [];
  }


  // =====================================================
  // GET RECEIVED INTERESTS
  // =====================================================

  getReceivedInterests(
    memberId: string
  ): any[] {

    if (!memberId) {
      return [];
    }

    /*
     * Temporary empty result.
     *
     * Backend will return actual data later.
     */

    return [];
  }


  // =====================================================
  // ACCEPT INTEREST
  // =====================================================

  acceptInterest(
    interestId: string
  ): boolean {

    if (!interestId) {
      return false;
    }

    console.log(
      'Accept interest:',
      interestId
    );

    return true;
  }


  // =====================================================
  // DECLINE INTEREST
  // =====================================================

  declineInterest(
    interestId: string
  ): boolean {

    if (!interestId) {
      return false;
    }

    console.log(
      'Decline interest:',
      interestId
    );

    return true;
  }

  
}