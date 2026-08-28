import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './admin-menu.html',
  styleUrl: './admin-menu.css'
})
export class AdminMenu {

  menuItems = [
    {
      label: 'Dashboard',
      icon: 'fa-solid fa-chart-pie',
      route: '/admin/dashboard'
    },
    {
      label: 'Profiles',
      icon: 'fa-solid fa-users',
      route: '/admin/profiles'
    },
    {
      label: 'Plan Upgrades',
      icon: 'fa-solid fa-arrow-up-right-dots',
      route: '/admin/plans'
    },
    {
      label: 'Home Verification',
      icon: 'fa-solid fa-house-circle-check',
      route: '/admin/verification'
    },
    {
      label: 'Search Profiles',
      icon: 'fa-solid fa-magnifying-glass',
     route: '/admin/profile-search'
    },
    {
      label: 'Find Match',
      icon: 'fa-solid fa-heart',
      route: '/admin/find-match'
    }
  ];

  constructor(
    private router: Router
  ) {}

  logout(): void {

    this.router.navigate([
      '/admin/login'
    ]);

  }

}