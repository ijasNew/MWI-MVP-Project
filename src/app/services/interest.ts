import { Injectable } from '@angular/core';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class InterestService {

  constructor(private apiService: ApiService) { }

  sendInterest(senderMemberId: string, receiverMemberId: string) {
    if (!senderMemberId || !receiverMemberId || senderMemberId === receiverMemberId) {
      return null;
    }
    return this.apiService.sendInterest(receiverMemberId);
  }

  getSentInterests(_memberId?: string) {
    return this.apiService.getSentInterests();
  }

  getReceivedInterests(_memberId?: string) {
    return this.apiService.getReceivedInterests();
  }

  acceptInterest(interestId: string) {
    return this.apiService.respondInterest(interestId, 'accept');
  }

  declineInterest(interestId: string) {
    return this.apiService.respondInterest(interestId, 'decline');
  }

  cancelInterest(interestId: string) {
    return this.apiService.cancelInterest(interestId);
  }

  respondInterest(
    interestId: string,
    action: 'accept' | 'decline'
  ) {
    return this.apiService.respondInterest(
      interestId,
      action
    );
  }

   
}
