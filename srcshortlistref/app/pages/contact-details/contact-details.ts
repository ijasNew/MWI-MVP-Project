import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  parsePhoneNumberFromString
} from 'libphonenumber-js';

import { ProfileService } from '../../services/profile';

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
    private profileService: ProfileService
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    // -----------------------------------------------------
    // Return destination
    // -----------------------------------------------------

    const fromMyDetails =
      sessionStorage.getItem('mwi_edit_source');

    if (fromMyDetails === 'my-details') {
      this.returnTo = '/my-details';
    }


    // -----------------------------------------------------
    // Load current profile
    // -----------------------------------------------------

    const profile =
      this.profileService.getCurrentProfile();

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
    // Update current profile
    // -----------------------------------------------------

    const updatedProfile =
      this.profileService.updateProfile({

        phone:
          this.primaryMobile.trim(),

        secondaryMobile:
          this.secondaryMobile.trim(),

        whatsappCountryCode:
          this.whatsappCountryCode,

        // Store normalized E.164 number
        whatsappNumber:
          phone.number,

        email:
          this.email.trim(),

        contactDetailsCompleted:
          true
      });


    // -----------------------------------------------------
    // Update failed
    // -----------------------------------------------------

    if (!updatedProfile) {

      console.error(
        'Unable to update contact details'
      );

      return;
    }


    // -----------------------------------------------------
    // Navigate
    // -----------------------------------------------------

    this.router.navigate([
      this.returnTo
    ]);
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