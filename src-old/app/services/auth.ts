import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly USER_AUTH_KEY = 'mwi_user_auth';
  private readonly ADMIN_AUTH_KEY = 'mwi_admin_auth';
  private readonly TOKEN_KEY = 'mwi_token';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  // =========================
  // USER AUTH
  // =========================

  login(phone: string, password: string) {
    return this.http.post<any>(
      `${environment.apiUrl}/auth/login`,
      {
        phone,
        password
      }
    );
  }

  loginUser(response: any): void {

    const token = response?.data?.token;

    if (token) {
      localStorage.setItem(
        this.TOKEN_KEY,
        token
      );
    }

    sessionStorage.setItem(
      this.USER_AUTH_KEY,
      JSON.stringify({
        isLoggedIn: true,
        user: response?.data?.user ?? null
      })
    );
  }

  isUserLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): any | null {

    const auth =
      sessionStorage.getItem(this.USER_AUTH_KEY);

    if (!auth) {
      return null;
    }

    try {

      const data = JSON.parse(auth);

      if (data?.isLoggedIn !== true) {
        return null;
      }

      return data.user ?? null;

    } catch {

      sessionStorage.removeItem(
        this.USER_AUTH_KEY
      );

      return null;
    }
  }

  logoutUser(): void {

    sessionStorage.removeItem(
      this.USER_AUTH_KEY
    );

    localStorage.removeItem(
      this.TOKEN_KEY
    );

    this.router.navigate(['/login']);
  }


  // =========================
  // ADMIN AUTH
  // =========================
  // ADMIN AUTH

private readonly ADMIN_TOKEN_KEY = 'mwi_admin_token';

loginAdmin(username: string, password: string) {
  return this.http.post<any>(
    `${environment.apiUrl}/admin/login`,
    {
      username,
      password
    }
  );
}

saveAdminSession(response: any): void {
  const token = response?.data?.token;
  const admin = response?.data?.admin ?? null;

  if (token) {
    localStorage.setItem(
      this.ADMIN_TOKEN_KEY,
      token
    );
  }

  sessionStorage.setItem(
    this.ADMIN_AUTH_KEY,
    JSON.stringify({
      isLoggedIn: true,
      admin
    })
  );
}

validateAdminToken() {
  const token =
    localStorage.getItem(
      this.ADMIN_TOKEN_KEY
    );

  if (!token) {
    return null;
  }

  return this.http.get<any>(
    `${environment.apiUrl}/admin/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

isAdminLoggedIn(): boolean {
  return !!localStorage.getItem(
    this.ADMIN_TOKEN_KEY
  );
}

getCurrentAdmin(): any | null {
  const auth =
    sessionStorage.getItem(
      this.ADMIN_AUTH_KEY
    );

  if (!auth) {
    return null;
  }

  try {
    const data = JSON.parse(auth);

    if (data?.isLoggedIn !== true) {
      return null;
    }

    return data.admin ?? null;

  } catch {
    sessionStorage.removeItem(
      this.ADMIN_AUTH_KEY
    );

    return null;
  }
}

logoutAdmin(): void {
  const token =
    localStorage.getItem(
      this.ADMIN_TOKEN_KEY
    );

  if (token) {
    this.http.post(
      `${environment.apiUrl}/admin/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: () => this.clearAdminSession(),
      error: () => this.clearAdminSession()
    });

    return;
  }

  this.clearAdminSession();
}

private clearAdminSession(): void {
  sessionStorage.removeItem(
    this.ADMIN_AUTH_KEY
  );

  localStorage.removeItem(
    this.ADMIN_TOKEN_KEY
  );

  this.router.navigate([
    '/admin/login'
  ]);
}
 

   

 
  


  // =========================
  // CLEAR ALL AUTH
  // =========================

  logoutAll(): void {

    sessionStorage.removeItem(
      this.USER_AUTH_KEY
    );

    sessionStorage.removeItem(
      this.ADMIN_AUTH_KEY
    );

    localStorage.removeItem(
      this.TOKEN_KEY
    );
  }
}