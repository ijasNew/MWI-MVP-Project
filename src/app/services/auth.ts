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

  loginAdmin(admin: any = null): void {

    sessionStorage.setItem(
      this.ADMIN_AUTH_KEY,
      JSON.stringify({
        isLoggedIn: true,
        admin: admin
      })
    );
  }

  isAdminLoggedIn(): boolean {

    const auth =
      sessionStorage.getItem(this.ADMIN_AUTH_KEY);

    if (!auth) {
      return false;
    }

    try {

      const data = JSON.parse(auth);

      return data?.isLoggedIn === true;

    } catch {

      sessionStorage.removeItem(
        this.ADMIN_AUTH_KEY
      );

      return false;
    }
  }

  getCurrentAdmin(): any | null {

    const auth =
      sessionStorage.getItem(this.ADMIN_AUTH_KEY);

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

      return null;
    }
  }

  logoutAdmin(): void {

    sessionStorage.removeItem(
      this.ADMIN_AUTH_KEY
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