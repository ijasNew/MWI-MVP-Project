import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminMenu } from '../admin-menu/admin-menu';
import { ApiService } from '../../services/api';

interface AdminProfile {
  id: string;
  name: string;
  gender: string;
  place: string;
  district: string;
  phone: string;
  status: string;
  plan: string;
  created_at: string;
}

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminMenu
  ],
  templateUrl: './profiles.html',
  styleUrl: './profiles.css'
})
export class Profiles implements OnInit {

  searchTerm = '';

  selectedStatus = 'All';

  selectedPlan = 'All';

  selectedGender = 'All';

  selectedDistrict = 'All';


  profiles: AdminProfile[] = [];


  isLoading = false;

  errorMessage = '';


  constructor(
    private router: Router,
    private apiService: ApiService,
     private cdr: ChangeDetectorRef
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadProfiles();

  }


  // =========================================================
  // LOAD PROFILES
  // =========================================================
  loadProfiles(): void {
  this.isLoading = true;
  this.errorMessage = '';

  this.apiService.getAdminProfiles().subscribe({
    next: (response: any) => {
      this.profiles = response?.data?.profiles ?? [];

      // IMPORTANT: API response received
      this.isLoading = false;
      this.cdr.detectChanges();
    },

    error: (error: any) => {
      console.error('Failed to load admin profiles:', error);

      this.profiles = [];

      this.errorMessage =
        error?.error?.message ||
        'Unable to load profiles. Please try again.';

      // IMPORTANT: stop loading even when API fails
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  });
}
  


  // =========================================================
  // FILTERED PROFILES
  // =========================================================

  get filteredProfiles(): AdminProfile[] {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    return this.profiles.filter(
      profile => {

        const matchesSearch =
          !search ||
          profile.id
            .toLowerCase()
            .includes(search) ||
          profile.name
            .toLowerCase()
            .includes(search) ||
          profile.phone
            .toLowerCase()
            .includes(search);


        const matchesStatus =
          this.selectedStatus === 'All' ||
          profile.status ===
            this.selectedStatus;


        const matchesPlan =
          this.selectedPlan === 'All' ||
          profile.plan ===
            this.selectedPlan;


        const matchesGender =
          this.selectedGender === 'All' ||
          profile.gender ===
            this.selectedGender;


        const matchesDistrict =
          this.selectedDistrict === 'All' ||
          profile.district ===
            this.selectedDistrict;


        return (
          matchesSearch &&
          matchesStatus &&
          matchesPlan &&
          matchesGender &&
          matchesDistrict
        );

      }
    );

  }


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  clearFilters(): void {

    this.searchTerm = '';

    this.selectedStatus = 'All';

    this.selectedPlan = 'All';

    this.selectedGender = 'All';

    this.selectedDistrict = 'All';

  }


  // =========================================================
  // VIEW PROFILE
  // =========================================================

  viewProfile(
    profile: AdminProfile
  ): void {

    this.router.navigate([
      '/admin/profile-view',
      profile.id
    ]);

  }


  // =========================================================
  // EDIT PROFILE
  // =========================================================

  editProfile(
    profile: AdminProfile
  ): void {

    console.log(
      'Admin edit profile:',
      profile.id
    );

  }


  // =========================================================
  // STATUS CLASS
  // =========================================================

  getStatusClass(
    status: string
  ): string {

    return status
      .toLowerCase()
      .replace(/\s+/g, '-');

  }


  // =========================================================
  // PLAN CLASS
  // =========================================================

  getPlanClass(
    plan: string
  ): string {

    return plan
      .toLowerCase()
      .replace(/\s+/g, '-');

  }


  // =========================================================
  // RETRY
  // =========================================================

  retryLoad(): void {

    this.loadProfiles();

  }

}