import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    // Admin is logged in
    if (this.authService.isAdminLoggedIn()) {
      return true;
    }

    // Admin is not logged in
    this.router.navigate(['/admin/login'], {
      queryParams: {
        returnUrl: state.url
      }
    });

    return false;
  }
}