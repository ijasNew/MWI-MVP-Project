import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router
} from '@angular/router';
import { filter } from 'rxjs';

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
    private router: Router
  ) {}


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


  loadUser(): void {

    const savedData =
      sessionStorage.getItem(
        'mwi_registration'
      );

    if (!savedData) {
      return;
    }

    try {

      this.user =
        JSON.parse(savedData);

    } catch (error) {

      console.error(
        'Invalid registration data',
        error
      );

      this.user = null;

    }

  }


  setActiveMenu(url: string): void {

    if (
      url.includes('/user-home')
    ) {

      this.activeMenu = 'home';

    }

    else if (
      url.includes('/interests')
    ) {

      this.activeMenu = 'interests';

    }

    else if (
      url.includes('/shortlisted')
    ) {

      this.activeMenu = 'shortlisted';

    }

    else if (
      url.includes('/my-details')
    ) {

      this.activeMenu = 'details';

    }

    else if (
      url.includes('/help-us-improve')
    ) {

      this.activeMenu = 'help';

    }

    else if (
      url.includes('/upgrade-profile')
    ) {

      this.activeMenu = 'upgrade';

    }

    else if (
      url.includes('/settings')
    ) {

      this.activeMenu = 'settings';

    }

    else {

      this.activeMenu = '';

    }

  }


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


  toggleMenu(): void {

    this.menuOpen =
      !this.menuOpen;

  }


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


  logout(): void {

    sessionStorage.removeItem(
      'mwi_registration'
    );

    this.router.navigate(['/']);

  }

}