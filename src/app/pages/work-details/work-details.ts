import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-work-details',
  imports: [FormsModule],
  templateUrl: './work-details.html',
  styleUrl: './work-details.css'
})
export class WorkDetails implements OnInit {

  returnTo: string = '/complete-profile';

  submitted = false;
  registeredState = '';
  collegeUniversity = '';
  companyName = '';

  // =========================
  // WORK LOCATION
  // =========================

  workLocationType = '';

  workState = '';
  workDistrict = '';

  workCountry = '';
  workCity = '';

  annualIncome = '';


  // =========================
  // LOCATION OPTIONS
  // =========================

  readonly workLocationTypes = [
    {
      value: 'india_same_state',
      label: 'India – Same State'
    },
    {
      value: 'india_other_state',
      label: 'India – Other State'
    },
    {
      value: 'outside_india',
      label: 'Outside India'
    }
  ];


  readonly indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal'
  ];


  readonly countries = [
    'UAE',
    'Saudi Arabia',
    'Qatar',
    'Kuwait',
    'Oman',
    'Bahrain',
    'USA',
    'Canada',
    'United Kingdom',
    'Australia',
    'New Zealand',
    'Germany',
    'Singapore',
    'Malaysia',
    'Other'
  ];


  readonly validIncomeOptions = [
    '',
    'Below ₹2 Lakh',
    '₹2 - ₹5 Lakh',
    '₹5 - ₹10 Lakh',
    '₹10 - ₹15 Lakh',
    '₹15 - ₹25 Lakh',
    'Above ₹25 Lakh'
  ];


  constructor(
    private router: Router
  ) { }


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


      this.collegeUniversity =
        profile.collegeUniversity || '';

      this.companyName =
        profile.companyName || '';


      this.workLocationType =
        profile.workLocationType || '';


      this.workState =
        profile.workState || '';

      this.workDistrict =
        profile.workDistrict || '';


      this.workCountry =
        profile.workCountry || '';

      this.workCity =
        profile.workCity || '';


      this.annualIncome =
        profile.annualIncome || '';

      this.registeredState =
        profile.state || '';


    } catch (error) {

      console.error(
        'Unable to load work details',
        error
      );

    }

  }


  // =========================
  // TEXT VALIDATION
  // =========================

  isTextFieldInvalid(
    value: string,
    maxLength = 100
  ): boolean {

    if (!value) {
      return false;
    }


    const trimmed =
      value.trim();


    if (
      trimmed.length === 0 ||
      trimmed.length > maxLength
    ) {

      return true;

    }


    const validPattern =
      /^[A-Za-z0-9À-ÿ₹&.,'()\/\-]+(?:\s+[A-Za-z0-9À-ÿ₹&.,'()\/\-]+)*$/;


    return !validPattern.test(
      trimmed
    );

  }


  // =========================
  // WORK LOCATION VALIDATION
  // =========================

  isWorkLocationInvalid(): boolean {

    // Work location is optional

    if (!this.workLocationType) {
      return false;
    }


    // Must be a valid location type

    const validType =
      this.workLocationTypes.some(
        item =>
          item.value ===
          this.workLocationType
      );

    if (!validType) {
      return true;
    }


    // =========================
    // INDIA
    // =========================

    if (
      this.workLocationType ===
      'india_same_state' ||
      this.workLocationType ===
      'india_other_state'
    ) {

      if (!this.workState) {
        return true;
      }

      if (
        !this.indianStates.includes(
          this.workState
        )
      ) {
        return true;
      }


      // Same state must match
      // registered profile state

      if (
        this.workLocationType ===
        'india_same_state' &&
        this.workState !==
        this.registeredState
      ) {
        return true;
      }


      if (
        !this.workDistrict.trim()
      ) {
        return true;
      }

      if (
        this.isTextFieldInvalid(
          this.workDistrict,
          100
        )
      ) {
        return true;
      }

    }

    // =========================
    // OUTSIDE INDIA
    // =========================

    if (
      this.workLocationType ===
      'outside_india'
    ) {

      if (!this.workCountry) {
        return true;
      }


      if (
        !this.countries.includes(
          this.workCountry
        )
      ) {

        return true;

      }


      if (
        !this.workCity.trim()
      ) {

        return true;

      }


      if (
        this.isTextFieldInvalid(
          this.workCity,
          100
        )
      ) {

        return true;

      }

    }


    return false;

  }


  // =========================
  // INCOME VALIDATION
  // =========================

  isAnnualIncomeInvalid(): boolean {

    return !this.validIncomeOptions.includes(
      this.annualIncome
    );

  }


  // =========================
  // LOCATION TYPE CHANGE
  // =========================

  onWorkLocationTypeChange(): void {

    this.workState = '';
    this.workDistrict = '';

    this.workCountry = '';
    this.workCity = '';

  }


  // =========================
  // SAVE
  // =========================

  saveDetails(): void {

    this.submitted = true;


    // =========================
    // TEXT FIELDS
    // =========================

    if (
      this.isTextFieldInvalid(
        this.collegeUniversity
      ) ||
      this.isTextFieldInvalid(
        this.companyName
      )
    ) {

      return;

    }


    // =========================
    // WORK LOCATION
    // =========================

    if (
      this.isWorkLocationInvalid()
    ) {

      return;

    }


    // =========================
    // INCOME
    // =========================

    if (
      this.isAnnualIncomeInvalid()
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


      profile.collegeUniversity =
        this.collegeUniversity.trim();


      profile.companyName =
        this.companyName.trim();


      profile.workLocationType =
        this.workLocationType;


      profile.workState =
        this.workState;


      profile.workDistrict =
        this.workDistrict.trim();


      profile.workCountry =
        this.workCountry;


      profile.workCity =
        this.workCity.trim();


      profile.annualIncome =
        this.annualIncome;


      profile.workDetailsCompleted =
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
        'Unable to save work details',
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


  // =========================
  // SAVED VALUE
  // =========================

  getSavedValue(
    field: string
  ): string {

    const saved =
      sessionStorage.getItem(
        'mwi_registration'
      );

    if (!saved) {
      return '-';
    }


    try {

      const profile =
        JSON.parse(saved);

      return (
        profile[field] || '-'
      );

    } catch {

      return '-';

    }

  }

}
