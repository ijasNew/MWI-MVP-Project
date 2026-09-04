import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  loading = true;
  errorMessage = '';

  stats: StatCard[] = [];

  recentProfiles: RecentProfile[] = [];

  verificationRequests: VerificationRequest[] = [];


  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    const admin = this.authService.getCurrentAdmin();

    if (admin?.admin_role) {
      this.adminName = admin.admin_role;
    }

    this.loadDashboardStats();

  }


  // =====================================================
  // LOAD DASHBOARD STATS
  // =====================================================

  loadDashboardStats(): void {

    this.loading = true;
    this.errorMessage = '';

    this.apiService.getAdminDashboardStats().subscribe({

      next: (response: any) => {

        if (!response?.success) {

          this.errorMessage =
            response?.message ||
            'Unable to load dashboard stats.';

          this.loading = false;

          this.cdr.detectChanges();

          return;
        }

        const data = response.data ?? {};

        const s = data.stats ?? {};

        this.stats = [

          {
            title: 'Total Profiles',
            value: s.totalProfiles ?? 0,
            subtitle: 'Registered profiles',
            icon: 'fa-solid fa-users',
            route: '/admin/profiles'
          },

          {
            title: 'Paid Users',
            value: s.paidUsers ?? 0,
            subtitle: 'Active paid users',
            icon: 'fa-solid fa-credit-card',
            route: '/admin/plans'
          },

          {
            title: 'Home Verified',
            value: s.homeVerified ?? 0,
            subtitle: 'Verified profiles',
            icon: 'fa-solid fa-house-circle-check',
            route: '/admin/verification'
          },

          {
            title: 'Pending Verification',
            value: s.pendingVerification ?? 0,
            subtitle: 'Need verification',
            icon: 'fa-solid fa-house',
            route: '/admin/verification'
          },

          {
            title: 'Free Users',
            value: s.freeUsers ?? 0,
            subtitle: 'Free plan users',
            icon: 'fa-solid fa-user',
            route: '/admin/plans'
          },

          {
            title: 'Other',
            value: s.other ?? 0,
            subtitle: 'Rejected / blocked',
            icon: 'fa-solid fa-layer-group',
            route: '/admin/profiles'
          }

        ];

        this.recentProfiles = Array.isArray(data.recentProfiles)
          ? data.recentProfiles
          : [];

        this.verificationRequests = Array.isArray(data.verificationRequests)
          ? data.verificationRequests
          : [];

        this.loading = false;

        this.cdr.detectChanges();

      },

      error: (error) => {

        this.errorMessage =
          error?.error?.message ||
          'Something went wrong while loading the dashboard.';

        this.loading = false;

        this.cdr.detectChanges();

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
