import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

import {
  parsePhoneNumberFromString
} from 'libphonenumber-js';

import { ProfileService } from '../../services/profile';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-details.html',
  styleUrl: './contact-details.css'
})
export class ContactDetails implements OnInit {

  returnTo: string = '/complete-profile';

  primaryMobile = '';

  submitted = false;

  secondaryMobile = '';

  whatsappNumber = '';

  email = '';

  whatsappCountryCode = '+91';


  // =====================================================
  // COUNTRY CODES
  // =====================================================

  countryCodes = [
    {
      name: 'India',
      code: '+91',
      iso: 'IN'
    },
    {
      name: 'UAE',
      code: '+971',
      iso: 'AE'
    },
    {
      name: 'Saudi Arabia',
      code: '+966',
      iso: 'SA'
    },
    {
      name: 'Qatar',
      code: '+974',
      iso: 'QA'
    },
    {
      name: 'Kuwait',
      code: '+965',
      iso: 'KW'
    },
    {
      name: 'Oman',
      code: '+968',
      iso: 'OM'
    },
    {
      name: 'Bahrain',
      code: '+973',
      iso: 'BH'
    },
    {
      name: 'USA',
      code: '+1',
      iso: 'US'
    },
    {
      name: 'Canada',
      code: '+1',
      iso: 'CA'
    },
    {
      name: 'UK',
      code: '+44',
      iso: 'GB'
    },
    {
      name: 'Australia',
      code: '+61',
      iso: 'AU'
    }
  ];


  constructor(
    private router: Router,
    private profileService: ProfileService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    // -----------------------------------------------------
    // Return destination
    // -----------------------------------------------------

    const returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl');

    if (returnUrl) {
      this.returnTo = returnUrl;
    } else {
      const fromMyDetails =
        sessionStorage.getItem('mwi_edit_source');

      if (fromMyDetails === 'my-details') {
        this.returnTo = '/my-details';
      }
    }


    // -----------------------------------------------------
    // Load current profile from backend
    // -----------------------------------------------------

    this.profileService.getCurrentProfileFromApi().subscribe({
      next: (profile) => {

        if (!profile) {
          return;
        }

        this.primaryMobile =
          profile.phone || '';

        this.secondaryMobile =
          profile.secondaryMobile || '';

        this.whatsappNumber =
          profile.whatsappNumber || '';

        this.whatsappCountryCode =
          profile.whatsappCountryCode || '+91';

        this.email =
          profile.email || '';

        // Needed for projects using zoneless/change-detection
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(
          'Unable to load contact details',
          error
        );
      }
    });
  }

  // =====================================================
  // SAVE
  // =====================================================

  saveDetails(): void {

    this.submitted = true;


    // -----------------------------------------------------
    // WhatsApp is required
    // -----------------------------------------------------

    const whatsapp =
      this.whatsappNumber.trim();

    if (!whatsapp) {
      return;
    }


    // -----------------------------------------------------
    // Find selected country
    // -----------------------------------------------------

    const country =
      this.countryCodes.find(
        item =>
          item.code ===
          this.whatsappCountryCode
      );

    if (!country) {
      return;
    }


    // -----------------------------------------------------
    // Validate WhatsApp number
    // -----------------------------------------------------

    const phone =
      parsePhoneNumberFromString(
        whatsapp,
        country.iso as any
      );

    if (
      !phone ||
      !phone.isValid()
    ) {
      return;
    }


    // -----------------------------------------------------
    // Update backend
    // -----------------------------------------------------
    // Primary phone is intentionally NOT sent here.
    // It is the verified registration number and is
    // controlled by the backend.

    const payload = {
      secondaryMobile:
        this.secondaryMobile.trim(),

      whatsappCountryCode:
        this.whatsappCountryCode,

      // Store normalized E.164 number
      whatsappNumber:
        phone.number,

      email:
        this.email.trim()
    };

    this.apiService
      .updateProfileSection('contact', payload)
      .subscribe({
        next: (response) => {

          if (!response?.success) {
            console.error(
              'Unable to update contact details',
              response
            );
            return;
          }

          // Keep local cache in sync for the rest of the
          // frontend until the next backend refresh.
          this.profileService.updateProfile({
            secondaryMobile:
              payload.secondaryMobile,

            whatsappCountryCode:
              payload.whatsappCountryCode,

            whatsappNumber:
              payload.whatsappNumber,

            email:
              payload.email,

            contactDetailsCompleted:
              true
          });

          this.router.navigateByUrl(
            this.returnTo
          );
        },

        error: (error) => {
          console.error(
            'Unable to update contact details',
            error
          );
        }
      });
  }

  // =====================================================
  // WHATSAPP VALIDATION
  // =====================================================

  isWhatsAppValid(): boolean {

    const country =
      this.countryCodes.find(
        item =>
          item.code ===
          this.whatsappCountryCode
      );

    if (!country) {
      return false;
    }


    const phone =
      parsePhoneNumberFromString(
        this.whatsappNumber.trim(),
        country.iso as any
      );


    return !!phone &&
      phone.isValid();
  }


  // =====================================================
  // BACK
  // =====================================================

  goBack(): void {

    this.router.navigate([
      this.returnTo
    ]);
  }

}