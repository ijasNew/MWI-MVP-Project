import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminMenu } from '../admin-menu/admin-menu';

interface AdminProfile {
  id: string;
  name: string;
  gender: string;
  place: string;
  phone: string;
  status: 'Verified' | 'Pending' | 'New';
  plan: 'Free' | 'Basic';
}

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [CommonModule,FormsModule, AdminMenu],
  templateUrl: './profiles.html',
  styleUrl: './profiles.css'
})
export class Profiles {

  searchTerm = '';
  selectedStatus = 'All';
  selectedPlan = 'All';
  selectedGender = 'All';
  selectedDistrict = 'All';

  profiles: AdminProfile[] = [
    {
      id: 'F1024',
      name: 'Ayesha Fathima',
      gender: 'Female',
      place: 'Kozhikode',
      phone: '98XXXXXX21',
      status: 'Verified',
      plan: 'Free'
    },
    {
      id: 'M1025',
      name: 'Mohammed Shamil',
      gender: 'Male',
      place: 'Malappuram',
      phone: '97XXXXXX45',
      status: 'Pending',
      plan: 'Basic'
    },
    {
      id: 'F1026',
      name: 'Hiba Nazeera',
      gender: 'Female',
      place: 'Malappuram',
      phone: '96XXXXXX78',
      status: 'New',
      plan: 'Free'
    },
    {
      id: 'M1027',
      name: 'Faris Rahman',
      gender: 'Male',
      place: 'Kozhikode',
      phone: '95XXXXXX34',
      status: 'Verified',
      plan: 'Basic'
    },
    {
      id: 'F1028',
      name: 'Raniya Fathima',
      gender: 'Female',
      place: 'Kannur',
      phone: '94XXXXXX89',
      status: 'Pending',
      plan: 'Free'
    }
  ];

  constructor(private router: Router) {}

  get filteredProfiles(): AdminProfile[] {

    const search = this.searchTerm.trim().toLowerCase();

    return this.profiles.filter(profile => {

      const matchesSearch =
        !search ||
        profile.id.toLowerCase().includes(search) ||
        profile.name.toLowerCase().includes(search) ||
        profile.phone.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        profile.status === this.selectedStatus;

      const matchesPlan =
        this.selectedPlan === 'All' ||
        profile.plan === this.selectedPlan;

      const matchesGender =
        this.selectedGender === 'All' ||
        profile.gender === this.selectedGender;

      const matchesDistrict =
        this.selectedDistrict === 'All' ||
        profile.place === this.selectedDistrict;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPlan &&
        matchesGender &&
        matchesDistrict
      );
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'All';
    this.selectedPlan = 'All';
    this.selectedGender = 'All';
    this.selectedDistrict = 'All';
  }

  viewProfile(profile: AdminProfile): void {
  this.router.navigate([
    '/admin/profile-view',
    profile.id
  ]);
}
  editProfile(profile: AdminProfile): void {
    console.log('Admin edit profile:', profile.id);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getPlanClass(plan: string): string {
    return plan.toLowerCase();
  }

}