import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface AdminProfile {
  id: string;
  name: string;
  gender: string;
  age: number;
  maritalStatus: string;
  height: string;
  place: string;
  district: string;
  state: string;
  religion: string;
  community: string;
  education: string;
  specialization: string;
  jobTitle: string;
  jobSector: string;
  company: string;
  workLocation: string;
  annualIncome: string;
  weight: string;
  bodyType: string;
  complexion: string;
  physicalStatus: string;
  fatherName: string;
  motherName: string;
  familyStatus: string;
  homeType: string;
  brothers: number;
  sisters: number;
  phone: string;
  whatsapp: string;
  email: string;
  plan: 'Free' | 'Basic';
  verificationStatus: 'Verified' | 'Pending' | 'Not Verified';
  photos: string[];
  expectations: string;
}

@Component({
  selector: 'app-admin-profile-view',
  standalone: true,
  templateUrl: './profile-view.html',
  styleUrl: './profile-view.css'
})
export class ProfileView implements OnInit {

  memberId = '';

  profile: AdminProfile | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.memberId =
      this.route.snapshot.paramMap.get('memberId') || '';

    this.loadProfile();

  }

  loadProfile(): void {

    /*
     * TEMPORARY ADMIN PROFILE DATA
     *
     * Backend/API integration will replace this later.
     */

    this.profile = {
      id: this.memberId || 'F1024',

      name: 'Ayesha Fathima',
      gender: 'Female',
      age: 28,
      maritalStatus: 'Never Married',
      height: "5'4\"",

      place: 'Kozhikode',
      district: 'Kozhikode',
      state: 'Kerala',

      religion: 'Islam',
      community: 'Sunni',

      education: "Master's Degree",
      specialization: 'Computer Science',
      jobTitle: 'Software Engineer',
      jobSector: 'IT',

      company: 'ABC Technologies',
      workLocation: 'Kozhikode, Kerala',
      annualIncome: '₹6,00,000',

      weight: '55 kg',
      bodyType: 'Average',
      complexion: 'Wheatish',
      physicalStatus: 'Normal',

      fatherName: 'Abdul Rahman',
      motherName: 'Fathima',
      familyStatus: 'Middle Class',
      homeType: 'Own House',

      brothers: 1,
      sisters: 1,

      phone: '+91 97469 00055',
      whatsapp: '+91 97469 00055',
      email: 'ayesha@example.com',

      plan: 'Free',
      verificationStatus: 'Verified',

      photos: [],

      expectations:
        'Looking for a suitable, educated and family-oriented partner.'
    };

  }

  goBack(): void {
    this.router.navigate(['/admin/profiles']);
  }

  editProfile(): void {

    if (!this.profile) {
      return;
    }

    this.router.navigate([
      '/admin/profile-edit',
      this.profile.id
    ]);

  }

  getStatusClass(): string {

    if (!this.profile) {
      return '';
    }

    return this.profile.verificationStatus
      .toLowerCase()
      .replace(/\s+/g, '-');

  }

  getPlanClass(): string {

    if (!this.profile) {
      return '';
    }

    return this.profile.plan.toLowerCase();

  }

}