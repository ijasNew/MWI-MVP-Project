import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminMenu } from '../admin-menu/admin-menu';
import { AuthService } from '../../services/auth';

interface StatCard {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  route?: string;
}

interface RecentProfile {
  id: string;
  name: string;
  gender: string;
  place: string;
  registeredDate: string;
  status: string;
  plan: string;
}

interface VerificationRequest {
  id: string;
  name: string;
  place: string;
  requestedDate: string;
  status: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminMenu],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})

export class AdminDashboard {

  adminName = 'Admin';

  stats: StatCard[] = [

    {
      title: 'Total Profiles',
      value: 1500,
      subtitle: 'Registered profiles',
      icon: 'fa-solid fa-users',
      route: '/admin/profiles'
    },

    {
      title: 'Paid Users',
      value: 86,
      subtitle: 'Active paid users',
      icon: 'fa-solid fa-credit-card',
      route: '/admin/plans'
    },

    {
      title: 'Home Verified',
      value: 42,
      subtitle: 'Verified profiles',
      icon: 'fa-solid fa-house-circle-check',
      route: '/admin/verification'
    },

    {
      title: 'Pending Verification',
      value: 18,
      subtitle: 'Need verification',
      icon: 'fa-solid fa-house',
      route: '/admin/verification'
    },

    {
      title: 'Free Users',
      value: 1414,
      subtitle: 'Free plan users',
      icon: 'fa-solid fa-user',
      route: '/admin/plans'
    },

    {
      title: 'Other',
      value: 26,
      subtitle: 'Incomplete / other',
      icon: 'fa-solid fa-layer-group',
      route: '/admin/profiles'
    }

  ];


  recentProfiles: RecentProfile[] = [

    {
      id: 'F1032',
      name: 'Rasiya Fathima',
      gender: 'Female',
      place: 'Malappuram',
      registeredDate: '27 Aug 2026',
      status: 'New',
      plan: 'Free'
    },

    {
      id: 'M1031',
      name: 'Faris Rahman',
      gender: 'Male',
      place: 'Kondotty',
      registeredDate: '26 Aug 2026',
      status: 'Pending',
      plan: 'Free'
    },

    {
      id: 'F1028',
      name: 'Raniya Fathima',
      gender: 'Female',
      place: 'Kannur',
      registeredDate: '25 Aug 2026',
      status: 'Verified',
      plan: 'Basic'
    },

    {
      id: 'M1025',
      name: 'Mohammed Shamil',
      gender: 'Male',
      place: 'Perinthalmanna',
      registeredDate: '26 Aug 2026',
      status: 'Pending',
      plan: 'Free'
    }

  ];


  verificationRequests: VerificationRequest[] = [

    {
      id: 'F1024',
      name: 'Ayesha Fathima',
      place: 'Kozhikode',
      requestedDate: '26 Aug 2026',
      status: 'Pending'
    },

    {
      id: 'M1025',
      name: 'Mohammed Shamil',
      place: 'Perinthalmanna',
      requestedDate: '26 Aug 2026',
      status: 'Pending'
    },

    {
      id: 'F1028',
      name: 'Raniya Fathima',
      place: 'Kannur',
      requestedDate: '25 Aug 2026',
      status: 'Pending'
    }

  ];


  constructor(
    private router: Router,
     private authService: AuthService
  ) {}


  openStat(card: StatCard): void {

    if (!card.route) {
      return;
    }

    this.router.navigate([
      card.route
    ]);

  }


  openProfiles(): void {

    this.router.navigate([
      '/admin/profiles'
    ]);

  }


  openPlans(): void {

    this.router.navigate([
      '/admin/plans'
    ]);

  }


  openVerification(): void {

    this.router.navigate([
      '/admin/verification'
    ]);

  }


  viewProfile(memberId: string): void {

    this.router.navigate([
      '/admin/profile-view',
      memberId
    ]);

  }


  startVerification(memberId: string): void {

    this.router.navigate([
      '/admin/verification/start',
      memberId
    ]);

  }


 logout(): void {
  this.authService.logoutAdmin();
}

  getStatusClass(status: string): string {

    return status
      .toLowerCase()
      .replace(/\s+/g, '-');

  }

}