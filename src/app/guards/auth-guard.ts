import { Injectable } from '@angular/core';

import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

import {
  Observable,
  of
} from 'rxjs';

import {
  map,
  catchError
} from 'rxjs/operators';

import {
  ApiService
} from '../services/api';


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
  ): Observable<boolean> {

    const token =
      localStorage.getItem('mwi_token');


    // =====================================================
    // NO TOKEN
    // =====================================================

    if (!token) {

      this.router.navigate(
        ['/login'],
        {
          queryParams: {
            returnUrl: state.url
          }
        }
      );

      return of(false);
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

          if (
            response?.success !== true
          ) {

            this.clearSession();

            this.router.navigate(
              ['/login'],
              {
                queryParams: {
                  returnUrl: state.url
                }
              }
            );

            return false;
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
            // → allow it

            if (
              state.url.startsWith('/register')
            ) {
              return true;
            }


            // Any other protected page
            // → force registration

            this.router.navigate(
              ['/register'],
              {
                queryParams: {
                  resume: 'true'
                }
              }
            );

            return false;
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

          this.router.navigate(
            ['/login'],
            {
              queryParams: {
                returnUrl: state.url
              }
            }
          );

          return of(false);

        })

      );

  }


  // =====================================================
  // CLEAR SESSION
  // =====================================================

  private clearSession(): void {

    localStorage.removeItem(
      'mwi_token'
    );

    sessionStorage.removeItem(
      'mwi_user_auth'
    );

  }

}