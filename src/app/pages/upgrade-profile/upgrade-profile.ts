import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserMenu } from '../../components/user-menu/user-menu';
import { ProfileService } from '../../services/profile';

@Component({
  selector: 'app-upgrade-profile',
  imports: [UserMenu],
  templateUrl: './upgrade-profile.html',
  styleUrl: './upgrade-profile.css'
})
export class UpgradeProfile {

  showServiceUnavailable = false;
  isCheckingLocation = false;

  constructor(
    private router: Router,
    private profileService: ProfileService
  ) {}

  continueVerification(): void {

    if (this.isCheckingLocation) {
      return;
    }

    // Reset previous popup
    this.showServiceUnavailable = false;

    // Start loading
    this.isCheckingLocation = true;

    this.profileService.getCurrentProfileFromApi().subscribe({

      next: (profile) => {

        console.log('PROFILE:', profile);
        console.log('DISTRICT:', profile?.district);

        this.isCheckingLocation = false;

        const district = String(profile?.district || '')
          .trim()
          .toLowerCase();

        const allowedDistricts = [
          'malappuram',
          'kozhikode'
        ];

        if (allowedDistricts.includes(district)) {
           console.log(
            'Home Verification available:',
            district
          );
          
          alert(
            'Your district is eligible for verification. Proceeding to verification page.'
          );
         

          // Payment gateway will be added later.

          return;
        }

        // Service not available
        this.showServiceUnavailable = true;
      },

      error: (error) => {

        console.error(
          'Failed to check user location:',
          error
        );

        this.isCheckingLocation = false;
        this.showServiceUnavailable = true;
      }

    });
  }

  closeServiceUnavailable(): void {
    this.showServiceUnavailable = false;
  }

  openWhatsAppSupport(): void {

    // WhatsApp support will be connected later.

    console.log(
      'WhatsApp support'
    );

  }

}