import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminMenu } from '../admin-menu/admin-menu';
import { ApiService } from '../../services/api';

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
   imports: [AdminMenu],
  templateUrl: './profile-view.html',
  styleUrl: './profile-view.css'
})
export class ProfileView implements OnInit {

  memberId = '';

  profile: AdminProfile | null = null;

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

  loadProfile(): void {
    if (!this.memberId) return;

    this.apiService.getAdminProfile(this.memberId).subscribe({
      next: (response: any) => {
        this.profile = response?.data?.profile ?? null;
      },
      error: (error: any) => {
        this.profile = null;
        alert(error?.error?.message || 'Unable to load profile.');
      }
    });
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