import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../services/profile';
import { ApiService } from '../../services/api';

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

  // Latest profile loaded from API
  private currentProfile: any = null;


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
    private router: Router,
    private profileService: ProfileService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    // Return page from query parameter
    this.returnTo =
      this.route.snapshot.queryParamMap.get('returnUrl') ||
      '/complete-profile';

    // Load latest profile directly from API / database
    this.profileService.getCurrentProfileFromApi().subscribe({

      next: (profile) => {

        if (!profile) {
          console.error('Unable to load current profile');
          return;
        }

        this.currentProfile = profile;

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

        console.log(
          'WORK DETAILS LOADED FROM API:',
          {
            collegeUniversity: this.collegeUniversity,
            companyName: this.companyName,
            workLocationType: this.workLocationType,
            workState: this.workState,
            workDistrict: this.workDistrict,
            workCountry: this.workCountry,
            workCity: this.workCity,
            annualIncome: this.annualIncome
          }
        );

        // Ensure Angular updates the form after API response
        this.cdr.detectChanges();
      },

      error: (error: any) => {

        console.error(
          'Failed to load work details from API:',
          error
        );
      }
    });
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

    return !validPattern.test(trimmed);
  }


  // =========================
  // WORK LOCATION VALIDATION
  // =========================

  isWorkLocationInvalid(): boolean {

    // Work location is optional
    if (!this.workLocationType) {
      return false;
    }


    // Validate location type
    const validType =
      this.workLocationTypes.some(
        item =>
          item.value === this.workLocationType
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


    // =========================
    // API PROFILE UPDATE
    // =========================

    const payload: Record<string, unknown> = {

      collegeUniversity:
        this.collegeUniversity.trim(),

      companyName:
        this.companyName.trim(),

      workLocationType:
        this.workLocationType,

      workState:
        this.workState,

      workDistrict:
        this.workDistrict.trim(),

      workCountry:
        this.workCountry,

      workCity:
        this.workCity.trim(),

      annualIncome:
        this.annualIncome
    };

    this.apiService.updateProfileSection(
      'work',
      payload
    ).subscribe({

      next: (response: any) => {

        console.log(
          'WORK DETAILS UPDATE RESPONSE:',
          response
        );

        if (!response?.success) {

          console.error(
            'Unable to update work details',
            response
          );

          return;
        }

        // Keep local cache in sync for the current session.
        this.profileService.updateProfile({

          collegeUniversity:
            this.collegeUniversity.trim(),

          companyName:
            this.companyName.trim(),

          workLocationType:
            this.workLocationType,

          workState:
            this.workState,

          workDistrict:
            this.workDistrict.trim(),

          workCountry:
            this.workCountry,

          workCity:
            this.workCity.trim(),

          annualIncome:
            this.annualIncome,

          workDetailsCompleted:
            true
        });

        // Return to the page that opened this editor.
        this.router.navigateByUrl(
          this.returnTo
        );
      },

      error: (error: any) => {

        console.error(
          'Unable to update work details:',
          error
        );
      }
    });
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

    if (!this.currentProfile) {
      return '-';
    }

    const value = this.currentProfile[field];

    if (
      value === null ||
      value === undefined ||
      String(value).trim() === ''
    ) {
      return '-';
    }

    return String(value);
  }

}