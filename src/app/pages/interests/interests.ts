import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserMenu } from '../../components/user-menu/user-menu';

@Component({
  selector: 'app-interests',
  imports: [UserMenu],
  templateUrl: './interests.html',
  styleUrl: './interests.css'
})
export class Interests implements OnInit {

  constructor(
    private router: Router
  ) {}

  user: any = null;

  menuOpen = false;

  activeTab = 'received';


  ngOnInit(): void {

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


  toggleMenu(): void {

    this.menuOpen =
      !this.menuOpen;

  }


  selectTab(tab: string): void {

    this.activeTab = tab;

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

    window.location.href = '/';

  }

}