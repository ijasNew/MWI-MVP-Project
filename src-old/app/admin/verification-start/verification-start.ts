import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminMenu } from '../admin-menu/admin-menu';

@Component({
  selector: 'app-verification-start',
  standalone: true,
  imports: [CommonModule, AdminMenu],
  templateUrl: './verification-start.html',
  styleUrl: './verification-start.css'
})
export class VerificationStart implements OnInit {

  memberId = '';

  profileName = 'Ayesha Fathima';
  profilePlace = 'Kozhikode, Kerala';

  currentStep = 1;

  locationLoading = false;
  locationCaptured = false;
  locationError = '';
  imagePreviewLoading = false;
  latitude: number | null = null;
  longitude: number | null = null;
  accuracy: number | null = null;
  imageLoading = false;
  selectedImage: string | null = null;
  imageError = '';
  locationName = '';
locationPlace = '';
locationDistrict = '';
locationState = '';
locationResolving = false;

  isCompleting = false;
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.memberId =
      this.route.snapshot.paramMap.get('memberId') || 'F1024';

  }

useCurrentLocation(): void {

  this.locationError = '';
  this.locationName = '';
  this.locationPlace = '';
  this.locationDistrict = '';
  this.locationState = '';
  this.locationCaptured = false;

  if (!navigator.geolocation) {

    this.locationError =
      'Location services are not supported by this browser.';

    this.cdr.detectChanges();

    return;
  }

  this.locationLoading = true;

  this.cdr.detectChanges();

  navigator.geolocation.getCurrentPosition(

    async (position) => {

      this.latitude =
        position.coords.latitude;

      this.longitude =
        position.coords.longitude;

      this.accuracy =
        position.coords.accuracy;

      /*
       * Keep GPS coordinates internally.
       * We will save these to backend later.
       */

      await this.resolveLocationName();

    },

    (error) => {

      this.locationLoading = false;
      this.locationCaptured = false;

      switch (error.code) {

        case error.PERMISSION_DENIED:

          this.locationError =
            'Location permission was denied. Please allow location access and try again.';

          break;

        case error.POSITION_UNAVAILABLE:

          this.locationError =
            'Current location could not be determined. Please try again.';

          break;

        case error.TIMEOUT:

          this.locationError =
            'Location request timed out. Please try again.';

          break;

        default:

          this.locationError =
            'Unable to get your current location. Please try again.';

      }

      this.cdr.detectChanges();

    },

    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }

  );

}


private async resolveLocationName(): Promise<void> {

  if (
    this.latitude === null ||
    this.longitude === null
  ) {

    this.locationLoading = false;

    this.locationError =
      'Location coordinates are unavailable. Please try again.';

    this.cdr.detectChanges();

    return;
  }

  this.locationResolving = true;

  this.cdr.detectChanges();

  try {

    const url =
      `https://api.bigdatacloud.net/data/reverse-geocode-client` +
      `?latitude=${this.latitude}` +
      `&longitude=${this.longitude}` +
      `&localityLanguage=en`;

    const response =
      await fetch(url);

    if (!response.ok) {

      throw new Error(
        `Reverse geocoding failed: ${response.status}`
      );

    }

    const data = await response.json();

    /*
     * Prefer locality because we want the actual
     * local place/town/village rather than only the city.
     */

    this.locationPlace =
      data.locality ||
      data.city ||
      '';

    this.locationDistrict =
      this.findDistrict(data);

    this.locationState =
      data.principalSubdivision ||
      '';

    const parts = [
      this.locationPlace,
      this.locationDistrict,
      this.locationState
    ].filter(Boolean);

    this.locationName =
      parts.join(', ');

    if (!this.locationName) {

      throw new Error(
        'Location name could not be determined.'
      );

    }

    this.locationCaptured = true;

    this.locationResolving = false;
    this.locationLoading = false;

    this.cdr.detectChanges();

  } catch (error) {

    console.error(
      'Unable to resolve current location:',
      error
    );

    this.locationResolving = false;
    this.locationLoading = false;
    this.locationCaptured = false;

    this.locationError =
      'We could not determine the place name from your current location. Please try again.';

    this.cdr.detectChanges();

  }

}
private findDistrict(data: any): string {

  if (data?.localityInfo?.administrative) {

    const administrative =
      data.localityInfo.administrative;

    const district =
      administrative.find(
        (item: any) =>
          item.adminLevel === 6 ||
          item.description?.toLowerCase().includes('district')
      );

    if (district?.name) {

      return district.name;

    }
  }

  return '';
}
  continueToPhoto(): void {

    if (!this.locationCaptured) {

      this.locationError =
        'Current location is required before continuing.';

      return;
    }

    this.currentStep = 2;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }
  onImageSelected(event: Event): void {

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.imageError = '';
    this.selectedImage = null;
    this.imageLoading = false;
    this.imagePreviewLoading = false;

    if (!file) {
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {

      this.imageError =
        'Please upload a JPG, PNG or WebP image.';

      input.value = '';

      return;
    }

    if (file.size > 5 * 1024 * 1024) {

      this.imageError =
        'Image size must be 5 MB or less.';

      input.value = '';

      return;
    }

    this.imageLoading = true;

    this.cdr.detectChanges();

    const reader = new FileReader();

    reader.onload = () => {

      this.selectedImage =
        reader.result as string;

      this.imageLoading = false;

      // Image element still needs to decode/render
      this.imagePreviewLoading = true;

      this.cdr.detectChanges();

    };

    reader.onerror = () => {

      this.imageLoading = false;
      this.imagePreviewLoading = false;

      this.imageError =
        'Unable to load the selected image. Please try again.';

      this.cdr.detectChanges();

    };

    reader.readAsDataURL(file);

  }

  onImagePreviewLoaded(): void {

    this.imagePreviewLoading = false;

    this.cdr.detectChanges();

  }
  onImagePreviewError(): void {

    this.imagePreviewLoading = false;

    this.imageError =
      'Unable to display the image preview. Please try another image.';

    this.cdr.detectChanges();

  }
  removeImage(): void {

    this.selectedImage = null;
    this.imageLoading = false;
    this.imagePreviewLoading = false;
    this.imageError = '';

    this.cdr.detectChanges();

  }


  completeVerification(): void {

  if (!this.locationCaptured) {

    this.currentStep = 1;

    this.locationError =
      'Current location is required.';

    this.cdr.detectChanges();

    return;
  }

  if (!this.selectedImage) {

    this.imageError =
      'Please upload a home image.';

    this.cdr.detectChanges();

    return;
  }

  this.isCompleting = true;
  this.successMessage = '';

  this.cdr.detectChanges();

  /*
   * TEMPORARY FRONTEND DEMO
   *
   * Backend will later:
   * - validate GPS location
   * - save verification coordinates
   * - save place/district/state
   * - upload home image
   * - update profile verification status
   */

  setTimeout(() => {

    this.isCompleting = false;

    this.successMessage =
      'Verification completed successfully.';

    this.cdr.detectChanges();

    // Give the user a short moment to see success message
    setTimeout(() => {

      this.router.navigate([
        '/admin/verification'
      ]);

    }, 800);

  }, 700);

}

  backToList(): void {

    this.router.navigate([
      '/admin/verification'
    ]);

  }

  backToProfile(): void {

    this.router.navigate([
      '/admin/profile-view',
      this.memberId
    ]);

  }

  

}