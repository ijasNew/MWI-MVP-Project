import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly USER_AUTH_KEY = 'mwi_user_auth';
  private readonly ADMIN_AUTH_KEY = 'mwi_admin_auth';

  constructor(private router: Router) {}

  // =========================
  // USER AUTH
  // =========================

  loginUser(user: any): void {
    sessionStorage.setItem(
      this.USER_AUTH_KEY,
      JSON.stringify({
        isLoggedIn: true,
        user: user
      })
    );
  }

  isUserLoggedIn(): boolean {
    const auth = sessionStorage.getItem(this.USER_AUTH_KEY);

    if (!auth) {
      return false;
    }

    try {
      const data = JSON.parse(auth);
      return data?.isLoggedIn === true;
    } catch {
      sessionStorage.removeItem(this.USER_AUTH_KEY);
      return false;
    }
  }

  getCurrentUser(): any | null {
    const auth = sessionStorage.getItem(this.USER_AUTH_KEY);

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
      return null;
    }
  }

  logoutUser(): void {
    sessionStorage.removeItem(this.USER_AUTH_KEY);
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
    const auth = sessionStorage.getItem(this.ADMIN_AUTH_KEY);

    if (!auth) {
      return false;
    }

    try {
      const data = JSON.parse(auth);
      return data?.isLoggedIn === true;
    } catch {
      sessionStorage.removeItem(this.ADMIN_AUTH_KEY);
      return false;
    }
  }

  getCurrentAdmin(): any | null {
    const auth = sessionStorage.getItem(this.ADMIN_AUTH_KEY);

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
    sessionStorage.removeItem(this.ADMIN_AUTH_KEY);
    this.router.navigate(['/admin/login']);
  }


  // =========================
  // CLEAR ALL AUTH
  // =========================

  logoutAll(): void {
    sessionStorage.removeItem(this.USER_AUTH_KEY);
    sessionStorage.removeItem(this.ADMIN_AUTH_KEY);
  }
}