import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminMenu } from '../admin-menu/admin-menu';
import { ApiService } from '../../services/api';

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
    private router: Router,
    private apiService: ApiService
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
    if (!this.memberId) return;

    this.apiService.getAdminProfile(this.memberId).subscribe({
      next: (response: any) => {
        const p = response?.data?.profile;
        if (!p) return;
        this.profile = {
          id: p.id ?? this.memberId,
          fullName: p.fullName ?? p.name ?? '', gender: p.gender ?? '', age: p.age ?? null,
          maritalStatus: p.maritalStatus ?? '', height: p.height ? String(p.height) : '',
          place: p.place ?? '', district: p.district ?? '', state: p.state ?? '', pincode: p.pincode ?? '',
          religion: p.religion ?? '', community: p.community ?? '', highestEducation: p.highestEducation ?? p.education ?? '',
          specialization: p.specialization ?? '', jobTitle: p.jobTitle ?? '', jobSector: p.jobSector ?? '',
          companyName: p.companyName ?? p.company ?? '', workLocation: p.workLocation ?? '', annualIncome: p.annualIncome ?? '',
          weight: p.weight ? String(p.weight) : '', bodyType: p.bodyType ?? '', complexion: p.complexion ?? '', physicalStatus: p.physicalStatus ?? '',
          fatherName: p.fatherName ?? '', motherName: p.motherName ?? '', brothers: p.brothers ?? null, sisters: p.sisters ?? null,
          familyStatus: p.familyStatus ?? '', homeType: p.homeType ?? '', secondaryMobile: p.secondaryMobile ?? '',
          whatsappNumber: p.whatsappNumber ?? '', email: p.email ?? '', expectations: p.expectations ?? '',
          plan: p.plan === 'Basic' ? 'Basic' : 'Free', verificationStatus: p.verificationStatus ?? 'Not Verified'
        };
      },
      error: (error: any) => { alert(error?.error?.message || 'Unable to load profile.'); }
    });
  }

  saveProfile(): void {
    if (!this.memberId || this.isSaving) return;

    this.saveMessage = '';
    this.isSaving = true;

    const payload: Record<string, unknown> = {
      fullName: this.profile.fullName.trim(),
      gender: this.profile.gender,
      maritalStatus: this.profile.maritalStatus,
      height: this.profile.height ? Number(this.profile.height) : null,
      place: this.profile.place.trim(), district: this.profile.district.trim(), state: this.profile.state.trim(), pincode: this.profile.pincode.trim(),
      religion: this.profile.religion, community: this.profile.community, highestEducation: this.profile.highestEducation,
      specialization: this.profile.specialization, jobTitle: this.profile.jobTitle, jobSector: this.profile.jobSector,
      companyName: this.profile.companyName, workLocation: this.profile.workLocation, annualIncome: this.profile.annualIncome,
      weight: this.profile.weight ? Number(this.profile.weight) : null, bodyType: this.profile.bodyType, complexion: this.profile.complexion,
      physicalStatus: this.profile.physicalStatus, fatherName: this.profile.fatherName, motherName: this.profile.motherName,
      brothers: this.profile.brothers, sisters: this.profile.sisters, familyStatus: this.profile.familyStatus, homeType: this.profile.homeType,
      secondaryMobile: this.profile.secondaryMobile, whatsappNumber: this.profile.whatsappNumber, email: this.profile.email, expectations: this.profile.expectations
    };

    this.apiService.updateAdminProfile(this.memberId, payload).subscribe({
      next: (response: any) => {
        this.isSaving = false;
        this.saveMessage = response?.message || 'Profile updated successfully.';
      },
      error: (error: any) => {
        this.isSaving = false;
        this.saveMessage = error?.error?.message || 'Unable to update profile.';
      }
    });
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