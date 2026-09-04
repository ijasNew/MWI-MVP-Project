import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminMenu } from '../admin-menu/admin-menu';
import { ApiService } from '../../services/api';

interface SearchProfile {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  age: number;
  place: string;
  district: string;
  phone: string;

  religion: string;
  community: string;

  maritalStatus: string;

  highestEducation: string;
  specialization: string;

  jobTitle: string;
  jobSector: string;
  companyName: string;

  annualIncome: string;

  physicalStatus: string;
  familyStatus: string;

  homeVerified: boolean;

  status: 'New' | 'Pending' | 'Verified';
  plan: 'Free' | 'Basic';
}


@Component({
  selector: 'app-admin-profile-search',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    AdminMenu
  ],

  templateUrl: './admin-profile-search.html',
  styleUrl: './admin-profile-search.css'
})
export class AdminProfileSearch implements OnInit {


  /* =========================
     SEARCH
  ========================= */

  searchTerm = '';

  showAdvancedFilters = true;


  /* =========================
     FILTERS
  ========================= */

  gender = 'All';

  ageMin: number | null = null;

  ageMax: number | null = null;

  district = 'All';

  religion = 'All';

  maritalStatus = 'All';

  education = 'All';

  jobSector = 'All';

  verification = 'All';

  profileStatus = 'All';

  plan = 'All';


  /* =========================
     LIVE PROFILES
  ========================= */

  profiles: SearchProfile[] = [];

  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.apiService.getAdminProfiles().subscribe({
      next: (response: any) => {
        this.profiles = (response?.data?.profiles ?? []).map((p: any) => ({
          id: p.id, name: p.name, gender: p.gender === 'female' ? 'Female' : 'Male', age: 0,
          place: p.place ?? '', district: p.district ?? '', phone: p.phone ?? '', religion: '', community: '',
          maritalStatus: '', highestEducation: '', specialization: '', jobTitle: '', jobSector: '', companyName: '', annualIncome: '',
          physicalStatus: '', familyStatus: '', homeVerified: p.status === 'Verified', status: p.status === 'Rejected' || p.status === 'Blocked' ? 'Pending' : p.status,
          plan: p.plan === 'Basic' ? 'Basic' : 'Free'
        }));
        this.isLoading = false;
      },
      error: (error: any) => {
        this.profiles = [];
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Unable to load profiles.';
      }
    });
  }


  /* =========================
     FILTERED RESULTS
  ========================= */

  get filteredProfiles(): SearchProfile[] {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    return this.profiles.filter(profile => {


      /* =========================
         GENERAL SEARCH
      ========================= */

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
          .includes(search) ||

        profile.place
          .toLowerCase()
          .includes(search) ||

        profile.district
          .toLowerCase()
          .includes(search) ||

        profile.religion
          .toLowerCase()
          .includes(search) ||

        profile.community
          .toLowerCase()
          .includes(search) ||

        profile.highestEducation
          .toLowerCase()
          .includes(search) ||

        profile.specialization
          .toLowerCase()
          .includes(search) ||

        profile.jobTitle
          .toLowerCase()
          .includes(search) ||

        profile.jobSector
          .toLowerCase()
          .includes(search) ||

        profile.companyName
          .toLowerCase()
          .includes(search);


      /* =========================
         GENDER
      ========================= */

      const matchesGender =
        this.gender === 'All' ||
        profile.gender === this.gender;


      /* =========================
         AGE
      ========================= */

      const matchesAgeMin =
        this.ageMin === null ||
        profile.age >= this.ageMin;


      const matchesAgeMax =
        this.ageMax === null ||
        profile.age <= this.ageMax;


      /* =========================
         DISTRICT
      ========================= */

      const matchesDistrict =
        this.district === 'All' ||
        profile.district === this.district;


      /* =========================
         RELIGION
      ========================= */

      const matchesReligion =
        this.religion === 'All' ||
        profile.religion === this.religion;


      /* =========================
         MARITAL STATUS
      ========================= */

      const matchesMaritalStatus =
        this.maritalStatus === 'All' ||
        profile.maritalStatus === this.maritalStatus;


      /* =========================
         EDUCATION
      ========================= */

      const matchesEducation =
        this.education === 'All' ||
        profile.highestEducation === this.education;


      /* =========================
         JOB SECTOR
      ========================= */

      const matchesJobSector =
        this.jobSector === 'All' ||
        profile.jobSector === this.jobSector;


      /* =========================
         HOME VERIFICATION
      ========================= */

      const matchesVerification =
        this.verification === 'All' ||

        (
          this.verification === 'Verified' &&
          profile.homeVerified
        ) ||

        (
          this.verification === 'Pending' &&
          !profile.homeVerified
        );


      /* =========================
         PROFILE STATUS
      ========================= */

      const matchesStatus =
        this.profileStatus === 'All' ||
        profile.status === this.profileStatus;


      /* =========================
         PLAN
      ========================= */

      const matchesPlan =
        this.plan === 'All' ||
        profile.plan === this.plan;


      return (

        matchesSearch &&

        matchesGender &&

        matchesAgeMin &&
        matchesAgeMax &&

        matchesDistrict &&

        matchesReligion &&

        matchesMaritalStatus &&

        matchesEducation &&

        matchesJobSector &&

        matchesVerification &&

        matchesStatus &&

        matchesPlan

      );

    });

  }


  /* =========================
     CLEAR FILTERS
  ========================= */

  clearFilters(): void {

    this.searchTerm = '';

    this.gender = 'All';

    this.ageMin = null;

    this.ageMax = null;

    this.district = 'All';

    this.religion = 'All';

    this.maritalStatus = 'All';

    this.education = 'All';

    this.jobSector = 'All';

    this.verification = 'All';

    this.profileStatus = 'All';

    this.plan = 'All';

  }


  /* =========================
     VIEW PROFILE
  ========================= */

  viewProfile(
    memberId: string
  ): void {

    this.router.navigate([
      '/admin/profile-view',
      memberId
    ]);

  }


  /* =========================
     EDIT PROFILE
  ========================= */

  editProfile(
    memberId: string
  ): void {

    this.router.navigate([
      '/admin/profile-edit',
      memberId
    ]);

  }


  /* =========================
     TOGGLE ADVANCED FILTER
  ========================= */

  toggleAdvancedFilters(): void {

    this.showAdvancedFilters =
      !this.showAdvancedFilters;

  }


  /* =========================
     STATUS CLASS
  ========================= */

  getStatusClass(
    status: string
  ): string {

    return status
      .toLowerCase()
      .replace(/\s+/g, '-');

  }


  /* =========================
     PLAN CLASS
  ========================= */

  getPlanClass(
    plan: string
  ): string {

    return plan
      .toLowerCase();

  }

}