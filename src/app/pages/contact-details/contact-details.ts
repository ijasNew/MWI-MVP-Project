import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  parsePhoneNumberFromString
} from 'libphonenumber-js';

@Component({
  selector: 'app-contact-details',
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

  countryCodes = [
    { name: 'India', code: '+91', iso: 'IN' },
    { name: 'UAE', code: '+971', iso: 'AE' },
    { name: 'Saudi Arabia', code: '+966', iso: 'SA' },
    { name: 'Qatar', code: '+974', iso: 'QA' },
    { name: 'Kuwait', code: '+965', iso: 'KW' },
    { name: 'Oman', code: '+968', iso: 'OM' },
    { name: 'Bahrain', code: '+973', iso: 'BH' },
    { name: 'USA', code: '+1', iso: 'US' },
    { name: 'Canada', code: '+1', iso: 'CA' },
    { name: 'UK', code: '+44', iso: 'GB' },
    { name: 'Australia', code: '+61', iso: 'AU' }
  ];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    const fromMyDetails =
      sessionStorage.getItem('mwi_edit_source');

    if (fromMyDetails === 'my-details') {
      this.returnTo = '/my-details';
    }

    const saved =
      sessionStorage.getItem('mwi_registration');

    if (!saved) {
      return;
    }

    try {

      const profile = JSON.parse(saved);

      this.primaryMobile =
        profile.phone || '';

      this.secondaryMobile =
        profile.secondaryMobile || '';

      this.whatsappCountryCode =
        profile.whatsappCountryCode || '+91';

      this.email =
        profile.email || '';

    } catch (error) {

      console.error(
        'Unable to load contact details',
        error
      );

    }

  }

 
  saveDetails(): void {

  this.submitted = true;

  const whatsapp =
    this.whatsappNumber.trim();

  // WhatsApp is required
  if (!whatsapp) {
    return;
  }

  const country =
    this.countryCodes.find(
      item =>
        item.code === this.whatsappCountryCode
    );

  if (!country) {
    return;
  }

  // Parse using selected country
  const phone =
    parsePhoneNumberFromString(
      whatsapp,
      country.iso as any
    );

  if (!phone || !phone.isValid()) {
    return;
  }

  const saved =
    sessionStorage.getItem(
      'mwi_registration'
    );

  if (!saved) {
    return;
  }

  try {

    const profile =
      JSON.parse(saved);

    profile.secondaryMobile =
      this.secondaryMobile.trim();

    profile.whatsappCountryCode =
      this.whatsappCountryCode;

    // Normalized E.164 number
    profile.whatsappNumber =
      phone.number;

    profile.email =
      this.email.trim();

    profile.contactDetailsCompleted =
      true;

    sessionStorage.setItem(
      'mwi_registration',
      JSON.stringify(profile)
    );

    this.router.navigate([
      this.returnTo
    ]);

  } catch (error) {

    console.error(
      'Unable to save contact details',
      error
    );

  }

}
isWhatsAppValid(): boolean {

  const country =
    this.countryCodes.find(
      item =>
        item.code === this.whatsappCountryCode
    );

  if (!country) {
    return false;
  }

  const phone =
    parsePhoneNumberFromString(
      this.whatsappNumber.trim(),
      country.iso as any
    );

  return !!phone && phone.isValid();

}

  goBack(): void {

    this.router.navigate([
      this.returnTo
    ]);

  }
}