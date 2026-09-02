import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../services/profile';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-additional-preferences',
  imports: [FormsModule],
  templateUrl: './additional-preferences.html',
  styleUrl: './additional-preferences.css'
})
export class AdditionalPreferences implements OnInit {

  returnTo: string = '/complete-profile';

  // =========================
  // REQUIRED PREFERENCES
  // =========================

  preferredFamilyStatus: string[] = [];

  preferredPhysicalStatus: string[] = [];

  // SINGLE SELECT
  preferredLocationRadius = '';


  // =========================
  // OPTIONAL PREFERENCES
  // =========================

  preferredIncome: string[] = [];

  preferredComplexion: string[] = [];


  // =========================
  // HINDU HOROSCOPE
  // =========================

  horoscopeRequired = '';

  preferredStar: string[] = [];


  religion = '';

  submitted = false;


  // =========================
  // VALID VALUES
  // =========================

  readonly validFamilyStatuses = [
    'any',
    'Lower Middle Class',
    'Middle Class',
    'Upper Middle Class',
    'Affluent'
  ];


  readonly validPhysicalStatuses = [
    'any',
    'Normal',
    'Physically Challenged',
    'Other'
  ];


  readonly validLocationRadius = [
    'any',
    'Within 10 km',
    'Within 25 km',
    'Within 50 km',
    'Within 100 km',
    'Anywhere in Kerala'
  ];


  readonly validIncome = [
    'any',
    'Below ₹2 Lakh',
    '₹2 - ₹5 Lakh',
    '₹5 - ₹10 Lakh',
    '₹10 - ₹15 Lakh',
    '₹15 - ₹25 Lakh',
    'Above ₹25 Lakh'
  ];


  readonly validComplexion = [
    'any',
    'Very Fair',
    'Fair',
    'Wheatish',
    'Medium',
    'Dusky',
    'Dark'
  ];


  constructor(
    private router: Router,
    private profileService: ProfileService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    // Return page from query parameter
    this.returnTo =
      this.route.snapshot.queryParamMap.get('returnUrl') ||
      '/complete-profile';

    // Load the latest values from the database through API.
    this.profileService.getCurrentProfileFromApi().subscribe({

      next: (profile) => {

        if (!profile) {
          console.error('Unable to load current profile');
          return;
        }

        // =========================
        // RELIGION
        // =========================

        this.religion =
          profile.religion || '';

        // =========================
        // REQUIRED PREFERENCES
        // =========================

        this.preferredFamilyStatus =
          Array.isArray(profile.preferredFamilyStatus)
            ? [...profile.preferredFamilyStatus]
            : [];

        this.preferredPhysicalStatus =
          Array.isArray(profile.preferredPhysicalStatus)
            ? [...profile.preferredPhysicalStatus]
            : [];

        // =========================
        // LOCATION
        // =========================

        if (
          Array.isArray(
            profile.preferredLocationRadius
          )
        ) {

          this.preferredLocationRadius =
            profile.preferredLocationRadius[0] || '';

        } else {

          this.preferredLocationRadius =
            profile.preferredLocationRadius || '';
        }

        // =========================
        // OPTIONAL PREFERENCES
        // =========================

        this.preferredIncome =
          Array.isArray(profile.preferredIncome)
            ? [...profile.preferredIncome]
            : [];

        this.preferredComplexion =
          Array.isArray(profile.preferredComplexion)
            ? [...profile.preferredComplexion]
            : [];

        // =========================
        // HINDU HOROSCOPE
        // =========================

        this.horoscopeRequired =
          profile.horoscopeRequired || '';

        this.preferredStar =
          Array.isArray(profile.preferredStar)
            ? [...profile.preferredStar]
            : [];

        console.log(
          'ADDITIONAL PREFERENCES LOADED FROM API:',
          {
            religion: this.religion,
            preferredFamilyStatus: this.preferredFamilyStatus,
            preferredPhysicalStatus: this.preferredPhysicalStatus,
            preferredLocationRadius: this.preferredLocationRadius,
            preferredIncome: this.preferredIncome,
            preferredComplexion: this.preferredComplexion,
            horoscopeRequired: this.horoscopeRequired,
            preferredStar: this.preferredStar
          }
        );

        this.cdr.detectChanges();
      },

      error: (error: any) => {

        console.error(
          'Failed to load additional preferences from API:',
          error
        );
      }
    });
  }


  // =========================
  // REQUIRED VALIDATION
  // =========================

  isFamilyStatusInvalid(): boolean {

    if (
      !Array.isArray(
        this.preferredFamilyStatus
      )
    ) {

      return true;

    }


    if (
      this.preferredFamilyStatus.length === 0
    ) {

      return true;

    }


    return this.preferredFamilyStatus.some(
      value =>
        !this.validFamilyStatuses.includes(
          value
        )
    );

  }


  isPhysicalStatusInvalid(): boolean {

    if (
      !Array.isArray(
        this.preferredPhysicalStatus
      )
    ) {

      return true;

    }


    if (
      this.preferredPhysicalStatus.length === 0
    ) {

      return true;

    }


    return this.preferredPhysicalStatus.some(
      value =>
        !this.validPhysicalStatuses.includes(
          value
        )
    );

  }


  isLocationRadiusInvalid(): boolean {

    if (
      !this.preferredLocationRadius
    ) {

      return true;

    }


    return !this.validLocationRadius.includes(
      this.preferredLocationRadius
    );

  }


  // =========================
  // OPTIONAL VALIDATION
  // =========================

  isIncomeInvalid(): boolean {

    if (
      !Array.isArray(
        this.preferredIncome
      )
    ) {

      return true;

    }


    return this.preferredIncome.some(
      value =>
        !this.validIncome.includes(
          value
        )
    );

  }


  isComplexionInvalid(): boolean {

    if (
      !Array.isArray(
        this.preferredComplexion
      )
    ) {

      return true;

    }


    return this.preferredComplexion.some(
      value =>
        !this.validComplexion.includes(
          value
        )
    );

  }


  // =========================
  // TOGGLE MULTI SELECT
  // =========================

  togglePreference(
    list: string[],
    value: string
  ): void {

    if (
      value === 'any'
    ) {

      list.length = 0;

      list.push('any');

      return;

    }


    const anyIndex =
      list.indexOf('any');


    if (
      anyIndex !== -1
    ) {

      list.splice(
        anyIndex,
        1
      );

    }


    const index =
      list.indexOf(value);


    if (
      index === -1
    ) {

      list.push(value);

    } else {

      list.splice(
        index,
        1
      );

    }

  }


  // =========================
  // SAVE
  // =========================

  saveDetails(): void {

    this.submitted = true;


    // =========================
    // REQUIRED VALIDATION
    // =========================

    if (
      this.isFamilyStatusInvalid()
    ) {

      return;

    }


    if (
      this.isPhysicalStatusInvalid()
    ) {

      return;

    }


    if (
      this.isLocationRadiusInvalid()
    ) {

      return;

    }


    // =========================
    // OPTIONAL VALIDATION
    // =========================

    if (
      this.isIncomeInvalid()
    ) {

      return;

    }


    if (
      this.isComplexionInvalid()
    ) {

      return;

    }


    // =========================
    // API PROFILE UPDATE
    // =========================

    const payload: Record<string, unknown> = {

      preferredFamilyStatus:
        [...this.preferredFamilyStatus],

      preferredPhysicalStatus:
        [...this.preferredPhysicalStatus],

      preferredLocationRadius:
        this.preferredLocationRadius
          ? [this.preferredLocationRadius]
          : [],

      preferredIncome:
        [...this.preferredIncome],

      preferredComplexion:
        [...this.preferredComplexion]
    };

    // Horoscope fields are relevant only for Hindu profiles.
    if (this.religion === 'Hindu') {

      payload['horoscopeRequired'] =
        this.horoscopeRequired;

      payload['preferredStar'] =
        [...this.preferredStar];
    }

    this.apiService.updateProfileSection(
      'additional_preferences',
      payload
    ).subscribe({

      next: (response: any) => {

        console.log(
          'ADDITIONAL PREFERENCES UPDATE RESPONSE:',
          response
        );

        if (!response?.success) {

          console.error(
            'Unable to update additional preferences',
            response
          );

          return;
        }

        // Keep the local session cache synchronized.
        this.profileService.updateProfile({

          preferredFamilyStatus:
            [...this.preferredFamilyStatus],

          preferredPhysicalStatus:
            [...this.preferredPhysicalStatus],

          preferredLocationRadius:
            this.preferredLocationRadius
              ? [this.preferredLocationRadius]
              : [],

          preferredIncome:
            [...this.preferredIncome],

          preferredComplexion:
            [...this.preferredComplexion],

          ...(this.religion === 'Hindu'
            ? {
                horoscopeRequired:
                  this.horoscopeRequired,

                preferredStar:
                  [...this.preferredStar]
              }
            : {}),

          additionalPreferencesCompleted:
            true
        });

        // Return to the page that opened this editor.
        this.router.navigateByUrl(
          this.returnTo
        );
      },

      error: (error: any) => {

        console.error(
          'Unable to update additional preferences:',
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

}