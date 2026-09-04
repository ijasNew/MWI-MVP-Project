import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminMenu } from '../admin-menu/admin-menu';
import { ApiService } from '../../services/api';
import { CommonModule, DecimalPipe } from '@angular/common';

interface VerificationRequest {
  id: number | null;
  paymentId: number;
  userId: number;
  memberId: string;
  name: string;
  gender: string;
  place: string;
  district: string;
  state: string;
  phone: string;
  paymentStatus: 'Paid';
  paymentAmount: number;
  paidAt: string | null;
  requestedDate: string | null;
  status: 'Pending' | 'In Progress' | 'Verified' | 'Rejected' | 'Cancelled';
  verificationStatus: string;
  latitude: number | null;
  longitude: number | null;
  locationAccuracy: number | null;
  locationName: string | null;
  locationPlace: string | null;
  locationDistrict: string | null;
  locationState: string | null;
  photoPath: string | null;
  verificationNotes: string | null;
}

@Component({
  selector: 'app-verification',
  standalone: true,
   imports: [FormsModule,
  CommonModule,
  DecimalPipe,
  AdminMenu
],
  templateUrl: './verification.html',
  styleUrl: './verification.css'
})
export class Verification implements OnInit {

  searchTerm = '';
  selectedDistrict = 'All';
  selectedStatus = 'Pending';

  requests: VerificationRequest[] = [];

  isLoading = false;
  loadError = '';

  showVerificationModal = false;
  selectedRequest: VerificationRequest | null = null;

  currentStep: 1 | 2 = 1;
  isGettingLocation = false;
  isSubmitting = false;

  latitude: number | null = null;
  longitude: number | null = null;
  accuracy: number | null = null;
  locationError = '';

  selectedPhoto: File | null = null;
  photoPreviewUrl: string | null = null;
  photoError = '';

  verificationNotes = '';

  successMessage = '';
  modalError = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadVerificationRequests();
  }

  loadVerificationRequests(): void {
    this.isLoading = true;
    this.loadError = '';

    this.apiService.getAdminVerificationRequests().subscribe({
      next: (response: any) => {
        const data = response?.data ?? response;
        this.requests = Array.isArray(data?.requests)
          ? data.requests
          : [];

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Failed to load admin verification requests:', error);
        this.requests = [];
        this.loadError =
          error?.error?.message ||
          'Unable to load verification requests.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredRequests(): VerificationRequest[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.requests.filter(request => {
      const matchesSearch =
        !search ||
        request.memberId.toLowerCase().includes(search) ||
        request.name.toLowerCase().includes(search) ||
        request.phone.toLowerCase().includes(search);

      const matchesDistrict =
        this.selectedDistrict === 'All' ||
        request.district === this.selectedDistrict;

      const matchesStatus =
        this.selectedStatus === 'All' ||
        request.status === this.selectedStatus;

      return matchesSearch && matchesDistrict && matchesStatus;
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

  get paymentRequiredCount(): number {
    return 0;
  }

  get verifiedCount(): number {
    return this.requests.filter(
      request => request.status === 'Verified'
    ).length;
  }

  startVerification(request: VerificationRequest): void {
    if (!request.id) {
      this.modalError = 'Verification request ID is missing.';
      return;
    }

    if (request.status === 'Verified') {
      return;
    }

    this.resetModalState();
    this.selectedRequest = request;
    this.showVerificationModal = true;
    this.modalError = '';

    this.apiService.startAdminVerification(
      request.id,
      request.paymentId
    ).subscribe({
      next: (response: any) => {
        const data = response?.data ?? response;

        if (data?.verification_id) {
          request.id = Number(data.verification_id);
        }

        request.status = 'In Progress';
        request.verificationStatus =
          data?.status === 'in_progress'
            ? 'in_progress'
            : 'in_progress';

        this.getCurrentLocation();
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Failed to start verification:', error);
        this.modalError =
          error?.error?.message ||
          'Unable to start verification.';
        this.showVerificationModal = false;
        this.cdr.detectChanges();
      }
    });
  }

  getCurrentLocation(): void {
    this.locationError = '';
    this.latitude = null;
    this.longitude = null;
    this.accuracy = null;

    if (!navigator.geolocation) {
      this.locationError =
        'GPS location is not supported by this browser.';
      return;
    }

    this.isGettingLocation = true;

    navigator.geolocation.getCurrentPosition(
      position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.accuracy = position.coords.accuracy;
        this.isGettingLocation = false;
        this.cdr.detectChanges();
      },
      error => {
        console.error('GPS error:', error);
        this.isGettingLocation = false;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.locationError =
              'Location permission was denied. Please allow location access and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            this.locationError =
              'Current location is unavailable. Please check GPS/location services.';
            break;
          case error.TIMEOUT:
            this.locationError =
              'Location request timed out. Please try again.';
            break;
          default:
            this.locationError =
              'Unable to get the current location.';
        }

        this.cdr.detectChanges();
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      }
    );
  }

  proceedToPhoto(): void {
    this.locationError = '';

    if (this.latitude === null || this.longitude === null) {
      this.locationError =
        'Please capture the current live location before continuing.';
      return;
    }

    this.currentStep = 2;
  }

  onPhotoSelected(event: Event): void {
    this.photoError = '';

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.selectedPhoto = null;
      this.clearPhotoPreview();
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      this.photoError =
        'Only JPG, PNG or WebP images are allowed.';
      input.value = '';
      this.selectedPhoto = null;
      this.clearPhotoPreview();
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.photoError =
        'House photo must be 5 MB or smaller.';
      input.value = '';
      this.selectedPhoto = null;
      this.clearPhotoPreview();
      return;
    }

    this.selectedPhoto = file;

    this.clearPhotoPreview();
    this.photoPreviewUrl = URL.createObjectURL(file);
  }

  clearPhotoPreview(): void {
    if (this.photoPreviewUrl) {
      URL.revokeObjectURL(this.photoPreviewUrl);
      this.photoPreviewUrl = null;
    }
  }

  submitVerification(): void {
    this.modalError = '';
    this.photoError = '';

    if (!this.selectedRequest?.id) {
      this.modalError = 'Verification request is missing.';
      return;
    }

    if (this.latitude === null || this.longitude === null) {
      this.currentStep = 1;
      this.locationError =
        'Live GPS location is required before verification can be completed.';
      return;
    }

    if (!this.selectedPhoto) {
      this.photoError = 'Please upload the house photo.';
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append(
      'verification_id',
      String(this.selectedRequest.id)
    );
    formData.append('latitude', String(this.latitude));
    formData.append('longitude', String(this.longitude));

    if (this.accuracy !== null) {
      formData.append('accuracy', String(this.accuracy));
    }

    formData.append(
      'location_place',
      this.selectedRequest.place || ''
    );
    formData.append(
      'location_district',
      this.selectedRequest.district || ''
    );
    formData.append(
      'location_state',
      this.selectedRequest.state || 'Kerala'
    );
    formData.append(
      'verification_notes',
      this.verificationNotes.trim()
    );
    formData.append(
      'house_photo',
      this.selectedPhoto,
      this.selectedPhoto.name
    );

    this.apiService.completeAdminVerification(formData).subscribe({
      next: (response: any) => {
        console.log('Home verification completed:', response);

        this.isSubmitting = false;
        this.successMessage =
          'Home verification completed successfully.';

        this.closeModal();
        this.loadVerificationRequests();

        this.cdr.detectChanges();

        window.setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (error: any) => {
        console.error('Failed to complete verification:', error);

        this.isSubmitting = false;
        this.modalError =
          error?.error?.message ||
          'Unable to complete home verification.';
        this.cdr.detectChanges();
      }
    });
  }

  closeModal(): void {
    this.showVerificationModal = false;
    this.selectedRequest = null;
    this.currentStep = 1;
    this.isGettingLocation = false;
    this.isSubmitting = false;
    this.locationError = '';
    this.photoError = '';
    this.modalError = '';
    this.latitude = null;
    this.longitude = null;
    this.accuracy = null;
    this.selectedPhoto = null;
    this.verificationNotes = '';
    this.clearPhotoPreview();
  }

  resetModalState(): void {
    this.currentStep = 1;
    this.isGettingLocation = false;
    this.isSubmitting = false;
    this.latitude = null;
    this.longitude = null;
    this.accuracy = null;
    this.locationError = '';
    this.photoError = '';
    this.modalError = '';
    this.selectedPhoto = null;
    this.verificationNotes = '';
    this.clearPhotoPreview();
  }

  viewProfile(request: VerificationRequest): void {
    this.router.navigate([
      '/admin/profile-view',
      request.memberId
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
