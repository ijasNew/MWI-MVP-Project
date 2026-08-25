import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expectations',
  imports: [FormsModule],
  templateUrl: './expectations.html',
  styleUrl: './expectations.css'
})
export class Expectations implements OnInit {

  returnTo: string = '/complete-profile';

  expectations = '';

  submitted = false;

  constructor(
    private router: Router
  ) {}


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    const fromMyDetails =
      sessionStorage.getItem(
        'mwi_edit_source'
      );

    if (
      fromMyDetails === 'my-details'
    ) {

      this.returnTo =
        '/my-details';

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


      this.expectations =
        profile.expectations || '';


    } catch (error) {

      console.error(
        'Unable to load expectations',
        error
      );

    }

  }


  // =========================
  // CONTACT INFORMATION CHECK
  // =========================

  containsPrivateContactInfo(
    value: string
  ): boolean {

    if (!value) {
      return false;
    }


    // Email
    const emailPattern =
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;


    // Phone numbers
    const phonePattern =
      /(?:\+?\d[\d\s().-]{7,}\d)/;


    // URLs / websites
    const urlPattern =
      /\b(?:https?:\/\/|www\.)\S+/i;


    return (
      emailPattern.test(value) ||
      phonePattern.test(value) ||
      urlPattern.test(value)
    );

  }


  // =========================
  // TEXT VALIDATION
  // =========================

  isExpectationsInvalid(): boolean {

    const text =
      this.expectations.trim();


    // Empty is allowed
    if (!text) {
      return false;
    }


    // Maximum length
    if (
      text.length > 1000
    ) {

      return true;

    }


    // Private contact details
    if (
      this.containsPrivateContactInfo(
        text
      )
    ) {

      return true;

    }


    return false;

  }


  // =========================
  // SAVE
  // =========================

  saveDetails(): void {

    this.submitted = true;


    if (
      this.isExpectationsInvalid()
    ) {

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


      const cleanedText =
        this.expectations
          .trim()
          .replace(/\s+/g, ' ');


      profile.expectations =
        cleanedText;


      // =========================
      // SECTION STATUS
      // =========================

      profile.expectationsCompleted =
        cleanedText.length > 0;


      sessionStorage.setItem(
        'mwi_registration',
        JSON.stringify(profile)
      );


      this.router.navigate([
        this.returnTo
      ]);


    } catch (error) {

      console.error(
        'Unable to save expectations',
        error
      );

    }

  }


  // =========================
  // BACK
  // =========================

  goBack(): void {

    this.router.navigate([
      this.returnTo
    ]);

  }

}