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
  catchError,
  map
} from 'rxjs/operators';

import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard
  implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {

    if (!this.authService.isAdminLoggedIn()) {
      return of(
        this.router.createUrlTree(
          ['/admin/login'],
          {
            queryParams: {
              returnUrl: state.url
            }
          }
        )
      );
    }

    const validation =
      this.authService.validateAdminToken();

    if (!validation) {
      return of(
        this.router.createUrlTree(
          ['/admin/login']
        )
      );
    }

    return validation.pipe(

      map((response: any) => {

        const admin =
          response?.data?.admin;

        if (!admin) {
          this.clearAdminSession();

          return this.router.createUrlTree(
            ['/admin/login']
          );
        }

        return true;
      }),

      catchError(() => {

        this.clearAdminSession();

        return of(
          this.router.createUrlTree(
            ['/admin/login'],
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

  private clearAdminSession(): void {

    localStorage.removeItem(
      'mwi_admin_token'
    );

    sessionStorage.removeItem(
      'mwi_admin_auth'
    );
  }
}