import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../services/api';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    const token = localStorage.getItem('mwi_token');

    // =====================================================
    // GUEST ONLY ROUTE
    // Used for: / and /login
    // =====================================================

    if (route.data?.['guestOnly'] === true) {

      // No token → normal guest can enter
      if (!token) {
        return of(true);
      }

      // Token exists → validate it
      return this.apiService.validateToken().pipe(

        map((response: any) => {

          // Valid logged-in user
          if (response?.success === true) {

            this.router.navigate([
              '/user-home'
            ]);

            return false;
          }

          // Invalid token
          localStorage.removeItem('mwi_token');
          sessionStorage.removeItem('mwi_user_auth');

          return true;
        }),

        catchError(() => {

          // Invalid / expired token
          localStorage.removeItem('mwi_token');
          sessionStorage.removeItem('mwi_user_auth');

          return of(true);
        })

      );
    }


    // =====================================================
    // PROTECTED ROUTES
    // =====================================================

    if (!token) {

      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: state.url
        }
      });

      return of(false);
    }


    // =====================================================
    // VALIDATE TOKEN
    // =====================================================

    return this.apiService.validateToken().pipe(

      map((response: any) => {

        return response?.success === true;

      }),

      catchError(() => {

        localStorage.removeItem('mwi_token');
        sessionStorage.removeItem('mwi_user_auth');

        this.router.navigate(['/login'], {
          queryParams: {
            returnUrl: state.url
          }
        });

        return of(false);

      })

    );

  }

}