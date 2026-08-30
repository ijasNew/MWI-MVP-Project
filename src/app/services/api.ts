import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /*
   * Authenticated profile requests need the token because
   * there is no HTTP interceptor in the current project.
   */
  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('mwi_token');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set(
        'Authorization',
        `Bearer ${token}`
      );
    }

    return headers;
  }

  sendOtp(data: { phone: string; purpose: string }) {
    return this.http.post<any>(
      `${this.apiUrl}/auth/send-otp`,
      data
    );
  }

  verifyOtp(data: { phone: string; otp: string; purpose: string }) {
    return this.http.post<any>(
      `${this.apiUrl}/auth/verify-otp`,
      data
    );
  }

  register(data: {
    phone: string;
    password: string;
    otp: string;
  }) {
    return this.http.post<any>(
      `${this.apiUrl}/auth/register`,
      data
    );
  }

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

changePassword(data: {
  current_password: string;
  new_password: string;
}) {
  return this.http.post<any>(
    `${this.apiUrl}/auth/change-password`,
    data,
    {
      headers: this.authHeaders()
    }
  );
}
submitFeedback(data: {
  feedback_type: string;
  message: string;
}) {
  return this.http.post<any>(
    `${this.apiUrl}/feedback/submit`,
    data,
    {
      headers: this.authHeaders()
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
  resetPassword(data: {
  phone: string;
  otp: string;
  password: string;
}) {
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


  // delete when work finish getprofiel()
  getProfile() {
  return this.http.get<any>(
    `${this.apiUrl}/profile`,
    {
      headers: this.authHeaders()
    }
  );
}
}
