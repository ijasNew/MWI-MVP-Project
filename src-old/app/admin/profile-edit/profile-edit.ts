import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminMenu } from '../admin-menu/admin-menu';

interface EditableProfile {
  id: string;

  fullName: string;
  gender: string;
  age: number | null;
  maritalStatus: string;
  height: string;

  place: string;
  district: string;
  state: string;
  pincode: string;

  religion: string;
  community: string;

  highestEducation: string;
  specialization: string;
  jobTitle: string;
  jobSector: string;

  companyName: string;
  workLocation: string;
  annualIncome: string;

  weight: string;
  bodyType: string;
  complexion: string;
  physicalStatus: string;

  fatherName: string;
  motherName: string;
  brothers: number | null;
  sisters: number | null;
  familyStatus: string;
  homeType: string;

  secondaryMobile: string;
  whatsappNumber: string;
  email: string;

  expectations: string;

  plan: 'Free' | 'Basic';
  verificationStatus: 'Verified' | 'Pending' | 'Not Verified';
}

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [FormsModule, AdminMenu],
  templateUrl: './profile-edit.html',
  styleUrl: './profile-edit.css'
})
export class ProfileEdit implements OnInit {

  memberId = '';

  profile: EditableProfile = this.createEmptyProfile();

  isSaving = false;
  saveMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.memberId =
      this.route.snapshot.paramMap.get('memberId') || '';

    this.loadProfile();

  }

  private createEmptyProfile(): EditableProfile {

    return {
      id: '',

      fullName: '',
      gender: '',
      age: null,
      maritalStatus: '',
      height: '',

      place: '',
      district: '',
      state: '',
      pincode: '',

      religion: '',
      community: '',

      highestEducation: '',
      specialization: '',
      jobTitle: '',
      jobSector: '',

      companyName: '',
      workLocation: '',
      annualIncome: '',

      weight: '',
      bodyType: '',
      complexion: '',
      physicalStatus: '',

      fatherName: '',
      motherName: '',
      brothers: null,
      sisters: null,
      familyStatus: '',
      homeType: '',

      secondaryMobile: '',
      whatsappNumber: '',
      email: '',

      expectations: '',

      plan: 'Free',
      verificationStatus: 'Not Verified'
    };

  }

  private loadProfile(): void {

    /*
     * TEMPORARY ADMIN DATA
     *
     * Backend/API integration will replace this later.
     */

    this.profile = {

      id: this.memberId || 'F1024',

      fullName: 'Ayesha Fathima',
      gender: 'Female',
      age: 28,
      maritalStatus: 'Never Married',
      height: "5'4\"",

      place: 'Kozhikode',
      district: 'Kozhikode',
      state: 'Kerala',
      pincode: '673001',

      religion: 'Islam',
      community: 'Sunni',

      highestEducation: "Master's Degree",
      specialization: 'Computer Science',
      jobTitle: 'Software Engineer',
      jobSector: 'IT',

      companyName: 'ABC Technologies',
      workLocation: 'Kozhikode, Kerala',
      annualIncome: '₹6,00,000',

      weight: '55 kg',
      bodyType: 'Average',
      complexion: 'Wheatish',
      physicalStatus: 'Normal',

      fatherName: 'Abdul Rahman',
      motherName: 'Fathima',
      brothers: 1,
      sisters: 1,
      familyStatus: 'Middle Class',
      homeType: 'Own House',

      secondaryMobile: '+91 90000 00000',
      whatsappNumber: '+91 97469 00055',
      email: 'ayesha@example.com',

      expectations:
        'Looking for a suitable, educated and family-oriented partner.',

      plan: 'Free',
      verificationStatus: 'Verified'

    };

  }

  saveProfile(): void {

    this.saveMessage = '';
    this.isSaving = true;

    /*
     * TEMPORARY UI SAVE
     *
     * Real API update will be connected later.
     */

    setTimeout(() => {

      this.isSaving = false;

      this.saveMessage =
        'Profile changes saved successfully.';

    }, 500);

  }

  cancel(): void {

    this.router.navigate([
      '/admin/profile-view',
      this.profile.id
    ]);

  }

  goBack(): void {

    this.router.navigate([
      '/admin/profile-view',
      this.profile.id
    ]);

  }

}