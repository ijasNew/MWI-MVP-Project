import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

import { ProfileService } from '../../services/profile';
import { ApiService } from '../../services/api';

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
    }

    // -----------------------------------------------------
    // Load current profile from API
    // -----------------------------------------------------

    this.profileService.getCurrentProfileFromApi()
      .subscribe({
        next: (profile) => {

          if (!profile) {
            return;
          }

          this.expectations =
            profile.expectations || '';

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error(
            'Unable to load expectations from API.',
            error
          );
        }
      });
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
        .replace(/\\s+/g, ' ');

    // -----------------------------------------------------
    // Save to backend API
    // -----------------------------------------------------

    this.apiService
      .updateProfileSection(
        'expectations',
        {
          expectations: cleanedText
        }
      )
      .subscribe({
        next: (response) => {

          if (!response?.success) {
            console.error(
              'Unable to update expectations.',
              response
            );
            return;
          }

          // Keep local cache synchronized.
          this.profileService.updateProfile({
            expectations: cleanedText,
            expectationsCompleted:
              cleanedText.length > 0
          });

          // -------------------------------------------------
          // Return to the page that opened the editor
          // -------------------------------------------------

          this.router.navigateByUrl(this.returnTo);
        },

        error: (error) => {
          console.error(
            'Unable to save expectations.',
            error
          );
        }
      });
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