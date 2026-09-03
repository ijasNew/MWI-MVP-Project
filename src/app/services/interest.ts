import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { ApiService } from './api';

export interface InterestProfile {
  interestId: string;
  memberId: string;
  name: string;
  age: number | null;
  maritalStatus: string;
  district: string;
  religion: string;
  education: string;
  photoUrl: string | null;
  verified: boolean;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class InterestService {

  constructor(private apiService: ApiService) {}

  // =====================================================
  // SEND INTEREST
  // =====================================================

  sendInterest(memberId: string): Observable<{ success: boolean; message: string }> {

    if (!memberId) {
      return of({ success: false, message: 'Invalid profile.' });
    }

    return this.apiService.sendInterest(memberId).pipe(

      map((response: any) => ({
        success: !!response?.success,
        message: response?.message || 'Interest sent successfully.'
      })),

      catchError((error) => of({
        success: false,
        message: error?.error?.message || 'Unable to send interest. Please try again.'
      }))
    );
  }


  // =====================================================
  // GET RECEIVED INTERESTS
  // =====================================================

  getReceivedInterests(): Observable<InterestProfile[]> {

    return this.apiService.getReceivedInterests().pipe(

      map((response: any) => {

        if (!response?.success) {
          return [];
        }

        return Array.isArray(response?.data?.interests)
          ? response.data.interests
          : [];
      }),

      catchError(() => of([]))
    );
  }


  // =====================================================
  // GET SENT INTERESTS
  // =====================================================

  getSentInterests(): Observable<InterestProfile[]> {

    return this.apiService.getSentInterests().pipe(

      map((response: any) => {

        if (!response?.success) {
          return [];
        }

        return Array.isArray(response?.data?.interests)
          ? response.data.interests
          : [];
      }),

      catchError(() => of([]))
    );
  }


  // =====================================================
  // ACCEPT INTEREST
  // =====================================================

  acceptInterest(interestId: string): Observable<{ success: boolean; message: string }> {

    if (!interestId) {
      return of({ success: false, message: 'Invalid interest.' });
    }

    return this.apiService.respondInterest(interestId, 'accept').pipe(

      map((response: any) => ({
        success: !!response?.success,
        message: response?.message || 'Interest accepted successfully.'
      })),

      catchError((error) => of({
        success: false,
        message: error?.error?.message || 'Unable to accept interest.'
      }))
    );
  }


  // =====================================================
  // DECLINE INTEREST
  // =====================================================

  declineInterest(interestId: string): Observable<{ success: boolean; message: string }> {

    if (!interestId) {
      return of({ success: false, message: 'Invalid interest.' });
    }

    return this.apiService.respondInterest(interestId, 'decline').pipe(

      map((response: any) => ({
        success: !!response?.success,
        message: response?.message || 'Interest declined.'
      })),

      catchError((error) => of({
        success: false,
        message: error?.error?.message || 'Unable to decline interest.'
      }))
    );
  }


  // =====================================================
  // CANCEL INTEREST
  // =====================================================

  cancelInterest(interestId: string): Observable<{ success: boolean; message: string }> {

    if (!interestId) {
      return of({ success: false, message: 'Invalid interest.' });
    }

    return this.apiService.cancelInterest(interestId).pipe(

      map((response: any) => ({
        success: !!response?.success,
        message: response?.message || 'Interest cancelled.'
      })),

      catchError((error) => of({
        success: false,
        message: error?.error?.message || 'Unable to cancel interest.'
      }))
    );
  }

}
