import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { ApiService } from './api';

export interface ShortlistedProfile {
  memberId: string;
  name: string;
  age: number | null;
  maritalStatus: string;
  district: string;
  religion: string;
  education: string;
  photoUrl: string | null;
  verified: boolean;
  shortlistedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShortlistService {

  constructor(private apiService: ApiService) {}

  // =====================================================
  // GET SHORTLIST
  // =====================================================

  getShortlist(): Observable<{ profiles: ShortlistedProfile[]; memberIds: string[] }> {

    return this.apiService.getShortlist().pipe(

      map((response: any) => {

        if (!response?.success) {
          return { profiles: [], memberIds: [] };
        }

        return {
          profiles: Array.isArray(response?.data?.profiles) ? response.data.profiles : [],
          memberIds: Array.isArray(response?.data?.memberIds) ? response.data.memberIds : []
        };
      }),

      catchError(() => of({ profiles: [], memberIds: [] }))
    );
  }


  // =====================================================
  // ADD TO SHORTLIST
  // =====================================================

  addShortlist(memberId: string): Observable<{ success: boolean; message: string }> {

    if (!memberId) {
      return of({ success: false, message: 'Invalid profile.' });
    }

    return this.apiService.addShortlist(memberId).pipe(

      map((response: any) => ({
        success: !!response?.success,
        message: response?.message || 'Profile added to shortlist.'
      })),

      catchError((error) => of({
        success: false,
        message: error?.error?.message || 'Unable to shortlist this profile.'
      }))
    );
  }


  // =====================================================
  // REMOVE FROM SHORTLIST
  // =====================================================

  removeShortlist(memberId: string): Observable<{ success: boolean; message: string }> {

    if (!memberId) {
      return of({ success: false, message: 'Invalid profile.' });
    }

    return this.apiService.removeShortlist(memberId).pipe(

      map((response: any) => ({
        success: !!response?.success,
        message: response?.message || 'Profile removed from shortlist.'
      })),

      catchError((error) => of({
        success: false,
        message: error?.error?.message || 'Unable to remove this profile.'
      }))
    );
  }

}
