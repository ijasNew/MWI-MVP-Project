import { Injectable } from '@angular/core';

import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';

import { Observable, of } from 'rxjs';

import {
  map,
  catchError
} from 'rxjs/operators';

import { ApiService } from '../services/api';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {

    const token = localStorage.getItem('mwi_token');

    const guestOnly =
      route.data?.['guestOnly'] === true;


    // =====================================================
    // GUEST-ONLY ROUTES
    // =====================================================

    if (guestOnly) {

      // No token → allow login/home/register guest page
      if (!token) {
        return of(true);
      }

      // Token exists → check whether it is valid
      return this.apiService
        .validateToken()
        .pipe(

          map((response: any) => {

            // Valid logged-in user
            if (response?.success === true) {

              // Already authenticated → don't allow guest pages
              return this.router.createUrlTree(['/user-home']);
            }

            // Invalid token
            this.clearSession();

            // Allow guest page
            return true;
          }),

          catchError(() => {

            this.clearSession();

            // Important:
            // Do NOT navigate to /login here.
            // Allow the guest route to load.
            return of(true);
          })

        );
    }


    // =====================================================
    // PROTECTED ROUTES
    // =====================================================

    if (!token) {

      return of(
        this.router.createUrlTree(
          ['/login'],
          {
            queryParams: {
              returnUrl: state.url
            }
          }
        )
      );
    }


    // =====================================================
    // CHECK TOKEN + USER STATUS
    // =====================================================

    return this.apiService
      .validateToken()
      .pipe(

        map((response: any) => {

          // -----------------------------------------------
          // INVALID TOKEN
          // -----------------------------------------------

          if (response?.success !== true) {

            this.clearSession();

            return this.router.createUrlTree(
              ['/login'],
              {
                queryParams: {
                  returnUrl: state.url
                }
              }
            );
          }


          const user =
            response?.data;


          // -----------------------------------------------
          // REGISTRATION INCOMPLETE
          // -----------------------------------------------

          if (
            user?.registration_completed !== true
          ) {

            // Already on register
            if (
              state.url.startsWith('/register')
            ) {
              return true;
            }


            return this.router.createUrlTree(
              ['/register'],
              {
                queryParams: {
                  resume: 'true'
                }
              }
            );
          }


          // -----------------------------------------------
          // REGISTRATION COMPLETE
          // -----------------------------------------------

          return true;

        }),


        // =================================================
        // API ERROR
        // =================================================

        catchError(() => {

          this.clearSession();

          return of(
            this.router.createUrlTree(
              ['/login'],
              {
                queryParams: {
                  returnUrl: state.url
                }
              }
            )
          );

        })

      );

  }


  // =====================================================
  // CLEAR SESSION
  // =====================================================

  private clearSession(): void {

    localStorage.removeItem('mwi_token');

    sessionStorage.removeItem('mwi_user_auth');

  }

}