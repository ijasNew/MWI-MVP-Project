import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly apiUrl = environment.apiUrl;

  private readonly ADMIN_TOKEN_KEY = 'mwi_admin_token';

  constructor(private http: HttpClient) { }


  // =========================================================
  // USER AUTH HEADERS
  // =========================================================

  /*
   * Authenticated user requests use mwi_token.
   *
   * There is no HTTP interceptor in the current project.
   */

  private authHeaders(): HttpHeaders {

    const token =
      localStorage.getItem('mwi_token');

    let headers =
      new HttpHeaders({
        'Content-Type': 'application/json'
      });

    if (token) {

      headers =
        headers.set(
          'Authorization',
          `Bearer ${token}`
        );
    }

    return headers;
  }


  // =========================================================
  // ADMIN AUTH HEADERS
  // =========================================================

  /*
   * Admin requests MUST use the admin token.
   *
   * Admin token is stored separately from user token.
   */

  private adminAuthHeaders(): HttpHeaders {

    const token =
      localStorage.getItem(
        this.ADMIN_TOKEN_KEY
      );

    let headers =
      new HttpHeaders({
        'Content-Type': 'application/json'
      });

    if (token) {

      headers =
        headers.set(
          'Authorization',
          `Bearer ${token}`
        );
    }

    return headers;
  }


  // =========================================================
  // ADMIN MULTIPART HEADERS
  // =========================================================

  private adminMultipartHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.ADMIN_TOKEN_KEY);

    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set(
        'Authorization',
        `Bearer ${token}`
      );
    }

    return headers;
  }


  // =========================================================
  // USER AUTH
  // =========================================================

  sendOtp(
    data: {
      phone: string;
      purpose: string;
    }
  ) {

    return this.http.post<any>(
      `${this.apiUrl}/auth/send-otp`,
      data
    );
  }


  verifyOtp(
    data: {
      phone: string;
      otp: string;
      purpose: string;
    }
  ) {

    return this.http.post<any>(
      `${this.apiUrl}/auth/verify-otp`,
      data
    );
  }


  register(
    data: {
      phone: string;
      password: string;
      otp: string;
    }
  ) {

    return this.http.post<any>(
      `${this.apiUrl}/auth/register`,
      data
    );
  }


  private multipartUserHeaders(): HttpHeaders {
    const token = localStorage.getItem('mwi_token');

    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set(
        'Authorization',
        `Bearer ${token}`
      );
    }

    return headers;
  }

  // =========================================================
  // USER PROFILE
  // =========================================================

  saveBasic(data: any) {

    return this.http.post<any>(
      `${this.apiUrl}/profile/basic`,
      data,
      {
        headers: this.authHeaders()
      }
    );
  }


  saveLocation(data: any) {

    return this.http.post<any>(
      `${this.apiUrl}/profile/location`,
      data,
      {
        headers: this.authHeaders()
      }
    );
  }


  saveReligion(data: any) {

    return this.http.post<any>(
      `${this.apiUrl}/profile/religion`,
      data,
      {
        headers: this.authHeaders()
      }
    );
  }


  saveEducation(data: any) {

    return this.http.post<any>(
      `${this.apiUrl}/profile/education`,
      data,
      {
        headers: this.authHeaders()
      }
    );
  }


  savePreferences(data: any) {

    return this.http.post<any>(
      `${this.apiUrl}/profile/preferences`,
      data,
      {
        headers: this.authHeaders()
      }
    );
  }


  validateToken() {

    return this.http.get<any>(
      `${this.apiUrl}/auth/me`,
      {
        headers: this.authHeaders()
      }
    );
  }


  changePassword(
    data: {
      current_password: string;
      new_password: string;
    }
  ) {

    return this.http.post<any>(
      `${this.apiUrl}/auth/change-password`,
      data,
      {
        headers: this.authHeaders()
      }
    );
  }


  submitFeedback(
    data: {
      feedback_type: string;
      message: string;
    }
  ) {

    return this.http.post<any>(
      `${this.apiUrl}/feedback/submit`,
      data,
      {
        headers: this.authHeaders()
      }
    );
  }


  // =========================================================
  // USER PROFILE SECTION EDITING
  // =========================================================

  updateProfileSection(section: string, data: Record<string, unknown>) {
    return this.http.post<any>(
      `${this.apiUrl}/profile/update-section`,
      {
        section,
        ...data
      },
      {
        headers: this.authHeaders()
      }
    );
  }


  // =========================================================
  // USER PROFILE PHOTOS
  // =========================================================

  getProfilePhotos() {
    return this.http.get<any>(
      `${this.apiUrl}/profile/photos`,
      {
        headers: this.authHeaders()
      }
    );
  }

  saveProfilePhotos(
    retainedIds: number[],
    files: File[]
  ) {
    const formData = new FormData();

    retainedIds.forEach(id => {
      formData.append('retained_ids[]', String(id));
    });

    files.forEach(file => {
      formData.append('photos[]', file, file.name);
    });

    return this.http.post<any>(
      `${this.apiUrl}/profile/photos`,
      formData,
      {
        headers: this.multipartUserHeaders()
      }
    );
  }

  completeRegistration() {

    return this.http.post<any>(
      `${this.apiUrl}/profile/complete`,
      {},
      {
        headers: this.authHeaders()
      }
    );
  }


  getMyProfile() {

    return this.http.get<any>(
      `${this.apiUrl}/profile-details`,
      {
        headers: this.authHeaders()
      }
    );
  }

  // =========================================================
// HOME VERIFICATION STATUS
// =========================================================

getVerificationStatus() {

  return this.http.get<any>(
    `${this.apiUrl}/verification/status`,
    {
      headers: this.authHeaders()
    }
  );

}


  resetPassword(
    data: {
      phone: string;
      otp: string;
      password: string;
    }
  ) {

    return this.http.post<any>(
      `${this.apiUrl}/auth/reset-password`,
      data
    );
  }


  getMatchingProfiles() {

    return this.http.get<any>(
      `${this.apiUrl}/matching-profiles`,
      {
        headers: this.authHeaders()
      }
    );
  }


  // =========================================================
  // OLD PROFILE API
  // =========================================================

  // Delete when old getProfile() work is finished.

  getProfile() {

    return this.http.get<any>(
      `${this.apiUrl}/profile`,
      {
        headers: this.authHeaders()
      }
    );
  }


  // =========================================================
  // ADMIN PROFILES
  // =========================================================

  /*
   * Fetch only registration_completed = 1 profiles.
   *
   * Backend handles:
   * - Admin authentication
   * - registration_completed filtering
   * - Latest first ordering
   */

  getAdminProfiles() {

    return this.http.get<any>(
      `${this.apiUrl}/admin/profiles`,
      {
        headers: this.adminAuthHeaders()
      }
    );
  }

  // =========================================================
  // ADMIN PLANS
  // =========================================================

  getAdminPlanUsers() {
    return this.http.get<any>(
      `${this.apiUrl}/admin/plans`,
      {
        headers: this.adminAuthHeaders()
      }
    );
  }


  changeAdminUserPlan(data: {
    member_id: string;
    plan: 'Free' | 'Basic';
    payment_status:
    | 'pending'
    | 'success'
    | 'failed'
    | 'refunded';
  }) {
    return this.http.post<any>(
      `${this.apiUrl}/admin/plans/change`,
      data,
      {
        headers: this.adminAuthHeaders()
      }
    );
  }

  // =========================================================
  // ADMIN HOME VERIFICATION
  // =========================================================

  getAdminVerificationRequests() {
    return this.http.get<any>(
      `${this.apiUrl}/admin/verification`,
      {
        headers: this.adminAuthHeaders()
      }
    );
  }


  startAdminVerification(verificationId: number | null, paymentId: number) {
    return this.http.post<any>(
      `${this.apiUrl}/admin/verification/start`,
      {
        verification_id: verificationId,
        payment_id: paymentId
      },
      {
        headers: this.adminAuthHeaders()
      }
    );
  }


  completeAdminVerification(formData: FormData) {
    return this.http.post<any>(
      `${this.apiUrl}/admin/verification/complete`,
      formData,
      {
        headers: this.adminMultipartHeaders()
      }
    );
  }
  
  getApiRoot(): string {
  return String(this.apiUrl || '').replace(/\/$/, '');
}

}