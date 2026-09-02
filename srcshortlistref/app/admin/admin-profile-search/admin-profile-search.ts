import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminMenu } from '../admin-menu/admin-menu';

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
export class AdminProfileSearch {


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
     SAMPLE PROFILES
  ========================= */

  profiles: SearchProfile[] = [

    {
      id: 'F1024',
      name: 'Ayesha Fathima',
      gender: 'Female',
      age: 27,
      place: 'Kozhikode',
      district: 'Kozhikode',
      phone: '98XXXXXX21',

      religion: 'Islam',
      community: 'Sunni',

      maritalStatus: 'Never Married',

      highestEducation: 'B.Com',
      specialization: 'Commerce',

      jobTitle: 'Accountant',
      jobSector: 'Private',

      companyName: 'Private Company',

      annualIncome: '3–5 Lakh',

      physicalStatus: 'Normal',
      familyStatus: 'Middle Class',

      homeVerified: true,

      status: 'Verified',
      plan: 'Free'
    },


    {
      id: 'M1025',
      name: 'Mohammed Shamil',
      gender: 'Male',
      age: 29,
      place: 'Malappuram',
      district: 'Malappuram',
      phone: '97XXXXXX45',

      religion: 'Islam',
      community: 'Sunni',

      maritalStatus: 'Never Married',

      highestEducation: 'B.Tech',
      specialization: 'Computer Science',

      jobTitle: 'Software Engineer',
      jobSector: 'Private',

      companyName: 'IT Company',

      annualIncome: '5–10 Lakh',

      physicalStatus: 'Normal',
      familyStatus: 'Middle Class',

      homeVerified: false,

      status: 'Pending',
      plan: 'Basic'
    },


    {
      id: 'F1026',
      name: 'Hiba Nazeera',
      gender: 'Female',
      age: 25,
      place: 'Manjeri',
      district: 'Malappuram',
      phone: '96XXXXXX78',

      religion: 'Islam',
      community: 'Sunni',

      maritalStatus: 'Never Married',

      highestEducation: 'M.A',
      specialization: 'English',

      jobTitle: 'Teacher',
      jobSector: 'Education',

      companyName: 'Private School',

      annualIncome: '3–5 Lakh',

      physicalStatus: 'Normal',
      familyStatus: 'Middle Class',

      homeVerified: false,

      status: 'New',
      plan: 'Free'
    },


    {
      id: 'M1027',
      name: 'Faris Rahman',
      gender: 'Male',
      age: 31,
      place: 'Kozhikode',
      district: 'Kozhikode',
      phone: '95XXXXXX34',

      religion: 'Islam',
      community: 'Sunni',

      maritalStatus: 'Divorced',

      highestEducation: 'MBA',
      specialization: 'Finance',

      jobTitle: 'Manager',
      jobSector: 'Private',

      companyName: 'Business Group',

      annualIncome: '10–15 Lakh',

      physicalStatus: 'Normal',
      familyStatus: 'Upper Middle Class',

      homeVerified: true,

      status: 'Verified',
      plan: 'Basic'
    },


    {
      id: 'F1028',
      name: 'Raniya Fathima',
      gender: 'Female',
      age: 26,
      place: 'Kannur',
      district: 'Kannur',
      phone: '94XXXXXX89',

      religion: 'Islam',
      community: 'Sunni',

      maritalStatus: 'Never Married',

      highestEducation: 'B.Sc',
      specialization: 'Computer Science',

      jobTitle: 'Developer',
      jobSector: 'IT',

      companyName: 'Software Company',

      annualIncome: '5–10 Lakh',

      physicalStatus: 'Normal',
      familyStatus: 'Middle Class',

      homeVerified: false,

      status: 'Pending',
      plan: 'Free'
    }

  ];


  constructor(
    private router: Router
  ) {}


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