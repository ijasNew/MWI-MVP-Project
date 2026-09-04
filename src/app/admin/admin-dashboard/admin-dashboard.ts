import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminMenu } from '../admin-menu/admin-menu';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';

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

export class AdminDashboard implements OnInit {

  adminName = 'Admin';

  stats: StatCard[] = [
    { title: 'Total Profiles', value: 0, subtitle: 'Registered profiles', icon: 'fa-solid fa-users', route: '/admin/profiles' },
    { title: 'Paid Users', value: 0, subtitle: 'Active paid users', icon: 'fa-solid fa-credit-card', route: '/admin/plans' },
    { title: 'Home Verified', value: 0, subtitle: 'Verified profiles', icon: 'fa-solid fa-house-circle-check', route: '/admin/verification' },
    { title: 'Pending Verification', value: 0, subtitle: 'Need verification', icon: 'fa-solid fa-house', route: '/admin/verification' },
    { title: 'Free Users', value: 0, subtitle: 'Free plan users', icon: 'fa-solid fa-user', route: '/admin/plans' },
    { title: 'Other', value: 0, subtitle: 'Incomplete / other', icon: 'fa-solid fa-layer-group', route: '/admin/profiles' }
  ];

  recentProfiles: RecentProfile[] = [];
  verificationRequests: VerificationRequest[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.apiService.getAdminDashboard().subscribe({
      next: (response: any) => {
        const data = response?.data ?? {};
        const s = data.stats ?? {};
        const values = [s.totalProfiles, s.paidUsers, s.homeVerified, s.pendingVerification, s.freeUsers, s.other];
        this.stats = this.stats.map((card, index) => ({ ...card, value: Number(values[index] ?? 0) }));
        this.recentProfiles = Array.isArray(data.recentProfiles) ? data.recentProfiles : [];
        this.verificationRequests = Array.isArray(data.verificationRequests) ? data.verificationRequests : [];
      },
      error: (error: any) => {
        console.error('Failed to load admin dashboard:', error);
      }
    });
  }


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