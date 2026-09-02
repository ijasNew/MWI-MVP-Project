import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ProfileService } from '../../services/profile';

@Component({
  selector: 'app-expectations',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './expectations.html',
  styleUrl: './expectations.css'
})
export class Expectations implements OnInit {

  returnTo: string = '/complete-profile';

  expectations = '';

  submitted = false;

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


    this.expectations =
      profile.expectations || '';
  }


  // =====================================================
  // CONTACT INFORMATION CHECK
  // =====================================================

  containsPrivateContactInfo(
    value: string
  ): boolean {

    if (!value) {
      return false;
    }


    // -----------------------------------------------------
    // Email
    // -----------------------------------------------------

    const emailPattern =
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;


    // -----------------------------------------------------
    // Phone number
    // -----------------------------------------------------

    const phonePattern =
      /(?:\+?\d[\d\s().-]{7,}\d)/;


    // -----------------------------------------------------
    // URL / Website
    // -----------------------------------------------------

    const urlPattern =
      /\b(?:https?:\/\/|www\.)\S+/i;


    return (
      emailPattern.test(value) ||
      phonePattern.test(value) ||
      urlPattern.test(value)
    );
  }


  // =====================================================
  // VALIDATION
  // =====================================================

  isExpectationsInvalid(): boolean {

    const text =
      this.expectations.trim();


    // Empty is allowed
    if (!text) {
      return false;
    }


    // Maximum length
    if (text.length > 1000) {
      return true;
    }


    // Private contact information
    if (
      this.containsPrivateContactInfo(text)
    ) {
      return true;
    }


    return false;
  }


  // =====================================================
  // SAVE
  // =====================================================

  saveDetails(): void {

    this.submitted = true;


    // -----------------------------------------------------
    // Validate
    // -----------------------------------------------------

    if (this.isExpectationsInvalid()) {
      return;
    }


    // -----------------------------------------------------
    // Clean text
    // -----------------------------------------------------

    const cleanedText =
      this.expectations
        .trim()
        .replace(/\s+/g, '');


    // -----------------------------------------------------
    // Update current profile
    // -----------------------------------------------------

    const updatedProfile =
      this.profileService.updateProfile({

        expectations:
          cleanedText,

        expectationsCompleted:
          cleanedText.length > 0

      });


    // -----------------------------------------------------
    // Update failed
    // -----------------------------------------------------

    if (!updatedProfile) {

      console.error(
        'Unable to update expectations'
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
  // BACK
  // =====================================================

  goBack(): void {

    this.router.navigate([
      this.returnTo
    ]);
  }

}