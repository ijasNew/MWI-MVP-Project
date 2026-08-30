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
    private router: Router,private apiService: ApiService
  ) {}

  canActivate(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> {

  const token = localStorage.getItem('mwi_token');

  if (!token) {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return of(false);
  }

  return this.apiService.validateToken().pipe(
    map((response: any) => {
      return response?.success === true;
    }),
    catchError(() => {
      localStorage.removeItem('mwi_token');
      sessionStorage.removeItem('mwi_user_auth');

      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      });

      return of(false);
    })
  );
}
}