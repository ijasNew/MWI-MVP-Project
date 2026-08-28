import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminMenu } from '../admin-menu/admin-menu';


interface VerificationRequest {
  id: string;
  name: string;
  gender: string;
  place: string;
  district: string;
  phone: string;
  paymentStatus: 'Paid' | 'Pending';
  requestedDate: string;
  status: 'Pending' | 'In Progress' | 'Verified';
}

 @Component({
  selector: 'app-verification',
  standalone: true,
  imports: [FormsModule, AdminMenu],
  templateUrl: './verification.html',
  styleUrl: './verification.css'
})
export class Verification {

  searchTerm = '';

  selectedDistrict = 'All';

  selectedStatus = 'Pending';

  requests: VerificationRequest[] = [

    {
      id: 'F1024',
      name: 'Ayesha Fathima',
      gender: 'Female',
      place: 'Kozhikode',
      district: 'Kozhikode',
      phone: '98XXXXXX21',
      paymentStatus: 'Paid',
      requestedDate: '26 Aug 2026',
      status: 'Pending'
    },

    {
      id: 'M1025',
      name: 'Mohammed Shamil',
      gender: 'Male',
      place: 'Perinthalmanna',
      district: 'Malappuram',
      phone: '97XXXXXX45',
      paymentStatus: 'Paid',
      requestedDate: '26 Aug 2026',
      status: 'Pending'
    },

    {
      id: 'F1028',
      name: 'Raniya Fathima',
      gender: 'Female',
      place: 'Kannur',
      district: 'Kannur',
      phone: '94XXXXXX89',
      paymentStatus: 'Paid',
      requestedDate: '25 Aug 2026',
      status: 'Pending'
    },

    {
      id: 'M1031',
      name: 'Faris Rahman',
      gender: 'Male',
      place: 'Kondotty',
      district: 'Malappuram',
      phone: '95XXXXXX34',
      paymentStatus: 'Paid',
      requestedDate: '24 Aug 2026',
      status: 'In Progress'
    }

  ];

  constructor(
    private router: Router
  ) {}

  get filteredRequests(): VerificationRequest[] {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();

    return this.requests.filter(request => {

      const matchesSearch =
        !search ||
        request.id.toLowerCase().includes(search) ||
        request.name.toLowerCase().includes(search) ||
        request.phone.toLowerCase().includes(search);

      const matchesDistrict =
        this.selectedDistrict === 'All' ||
        request.district === this.selectedDistrict;

      const matchesStatus =
        this.selectedStatus === 'All' ||
        request.status === this.selectedStatus;

      return (
        matchesSearch &&
        matchesDistrict &&
        matchesStatus
      );

    });

  }

  get pendingCount(): number {

    return this.requests.filter(
      request => request.status === 'Pending'
    ).length;

  }

  get inProgressCount(): number {

    return this.requests.filter(
      request => request.status === 'In Progress'
    ).length;

  }

  startVerification(request: VerificationRequest): void {

    this.router.navigate([
      '/admin/verification/start',
      request.id
    ]);

  }

  viewProfile(request: VerificationRequest): void {

    this.router.navigate([
      '/admin/profile-view',
      request.id
    ]);

  }

  clearFilters(): void {

    this.searchTerm = '';
    this.selectedDistrict = 'All';
    this.selectedStatus = 'Pending';

  }

  getStatusClass(status: string): string {

    return status
      .toLowerCase()
      .replace(/\s+/g, '-');

  }

}