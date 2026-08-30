import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import {
  NavigationEnd,
  Router
} from '@angular/router';
import { filter } from 'rxjs';

import { AuthService } from '../../services/auth';
import { ProfileService } from '../../services/profile';

@Component({
  selector: 'app-user-menu',
  imports: [],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css'
})
export class UserMenu implements OnInit {

  user: any = null;

  activeMenu = '';

  menuOpen = false;


  constructor(
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }


  ngOnInit(): void {

    this.loadUser();

    this.setActiveMenu(
      this.router.url
    );

    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationEnd
        )
      )
      .subscribe(
        (event: NavigationEnd) => {

          this.setActiveMenu(
            event.urlAfterRedirects
          );

          this.menuOpen = false;

        }
      );

  }


  // =========================
  // LOAD USER
  // =========================
  loadUser(): void {
    console.log('🔥 USER MENU → loadUser()');
    this.profileService.getCurrentProfileFromApi().subscribe({

      next: (profile: any) => {

        console.log(
          'USER MENU PROFILE:',
          profile
        );

        if (profile) {

          this.ngZone.run(() => {

            this.user = {
              fullName:
                profile.fullName || 'User',

              memberId:
                profile.memberId || ''
            };

            console.log(
              'USER MENU DISPLAY DATA:',
              this.user
            );

            this.cdr.detectChanges();

          });

        } else {

          this.ngZone.run(() => {

            this.user = null;

            this.cdr.detectChanges();

          });

        }
      },

      error: (error: any) => {

        console.error(
          'USER MENU PROFILE API ERROR:',
          error
        );

        this.ngZone.run(() => {

          this.user = null;

          this.cdr.detectChanges();

        });

      }

    });

  }



  // =========================
  // ACTIVE MENU
  // =========================

  setActiveMenu(url: string): void {

    if (url.includes('/user-home')) {

      this.activeMenu = 'home';

    }

    else if (url.includes('/interests')) {

      this.activeMenu = 'interests';

    }

    else if (url.includes('/shortlisted')) {

      this.activeMenu = 'shortlisted';

    }

    else if (url.includes('/my-details')) {

      this.activeMenu = 'details';

    }

    else if (url.includes('/help-us-improve')) {

      this.activeMenu = 'help';

    }

    else if (url.includes('/upgrade-profile')) {

      this.activeMenu = 'upgrade';

    }

    else if (url.includes('/settings')) {

      this.activeMenu = 'settings';

    }

    else {

      this.activeMenu = '';

    }

  }


  // =========================
  // MENU NAVIGATION
  // =========================

  selectMenu(menu: string): void {

    this.menuOpen = false;

    switch (menu) {

      case 'home':

        this.router.navigate([
          '/user-home'
        ]);

        break;


      case 'interests':

        this.router.navigate([
          '/interests'
        ]);

        break;


      case 'shortlisted':

        this.router.navigate([
          '/shortlisted'
        ]);

        break;


      case 'details':

        this.router.navigate([
          '/my-details'
        ]);

        break;


      case 'help':

        this.router.navigate([
          '/help-us-improve'
        ]);

        break;


      case 'upgrade':

        this.router.navigate([
          '/upgrade-profile'
        ]);

        break;


      case 'settings':

        this.router.navigate([
          '/settings'
        ]);

        break;

    }

  }


  // =========================
  // TOGGLE MENU
  // =========================

  toggleMenu(): void {

    this.menuOpen =
      !this.menuOpen;

  }


  // =========================
  // GET INITIALS
  // =========================

  getInitials(
    name: string | undefined
  ): string {

    if (!name) {
      return 'U';
    }

    const parts =
      name.trim().split(/\s+/);

    if (parts.length === 1) {

      return parts[0][0]
        .toUpperCase();

    }

    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();

  }


  // =========================
  // LOGOUT
  // =========================

  logout(): void {

    /*
     * AuthService is now responsible
     * for clearing authentication.
     */
    this.authService.logoutUser();

  }

}