import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-physical-details',
  imports: [FormsModule],
  templateUrl: './physical-details.html',
  styleUrl: './physical-details.css'
})
export class PhysicalDetails implements OnInit {
  submitted = false;
  weight: number | null = null;
  bodyType = '';
  complexion = '';
  physicalStatus = '';
  returnTo: string = '/complete-profile';
  constructor(
    private router: Router,
    private profileService: ProfileService,
    private apiService: ApiService,
    private route: ActivatedRoute,
     private cdr: ChangeDetectorRef
  ) { }
  ngOnInit(): void {

    // Return page
    this.returnTo =
      this.route.snapshot.queryParamMap.get('returnUrl') ||
      '/complete-profile';


    // Load latest profile directly from database API
    this.profileService.getCurrentProfileFromApi().subscribe({

      next: (profile) => {

        if (!profile) {

          console.error(
            'Unable to load current profile'
          );

          return;
        }


        // =========================
        // PHYSICAL DETAILS
        // =========================

        this.weight =
          profile.weight ?? null;

        this.bodyType =
          profile.bodyType ?? '';

        this.complexion =
          profile.complexion ?? '';

        this.physicalStatus =
          profile.physicalStatus ?? '';


        console.log(
          'PHYSICAL DETAILS LOADED FROM API:',
          {
            weight: this.weight,
            bodyType: this.bodyType,
            complexion: this.complexion,
            physicalStatus: this.physicalStatus
          }
        );
        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'Unable to load physical details from API',
          error
        );

      }

    });

  }
  saveDetails(): void {

    this.submitted = true;

    // =========================
    // PHYSICAL STATUS REQUIRED
    // =========================

    if (!this.physicalStatus) {
      return;
    }


    // =========================
    // VALID PHYSICAL STATUS
    // =========================

    const validPhysicalStatuses = [
      'Normal',
      'Physically Challenged',
      'Other'
    ];

    if (
      !validPhysicalStatuses.includes(
        this.physicalStatus
      )
    ) {
      return;
    }


    // =========================
    // WEIGHT - OPTIONAL
    // =========================

    if (this.weight !== null) {

      if (
        !Number.isFinite(this.weight) ||
        this.weight < 20 ||
        this.weight > 250
      ) {
        return;
      }

    }


    // =========================
    // BODY TYPE - OPTIONAL
    // =========================

    const validBodyTypes = [
      'Slim',
      'Average',
      'Athletic',
      'Heavy'
    ];

    if (
      this.bodyType &&
      !validBodyTypes.includes(
        this.bodyType
      )
    ) {
      return;
    }


    // =========================
    // COMPLEXION - OPTIONAL
    // =========================

    const validComplexions = [
      'Very Fair',
      'Fair',
      'Wheatish',
      'Medium',
      'Dusky',
      'Dark'
    ];

    if (
      this.complexion &&
      !validComplexions.includes(
        this.complexion
      )
    ) {
      return;
    }


    // =========================
    // LOAD PROFILE
    // =========================
    const payload: Record<string, unknown> = {
      bodyType: this.bodyType,
      complexion: this.complexion,
      physicalStatus: this.physicalStatus
    };

    if (this.weight !== null && this.weight !== undefined) {
      payload['weight'] = this.weight;
    }

    this.apiService.updateProfileSection(
      'physical',
      payload
    ).subscribe({

      next: (response: any) => {

        if (!response?.success) {

          console.error(
            'Unable to update physical details',
            response
          );

          return;
        }

        // Update local profile cache
        this.profileService.updateProfile({

          ...(this.weight !== null
            ? { weight: this.weight }
            : {}),

          bodyType: this.bodyType,
          complexion: this.complexion,
          physicalStatus: this.physicalStatus,
          physicalDetailsCompleted: true

        });

        // Return to the page that opened this editor
        this.router.navigateByUrl(
          this.returnTo
        );

      },

      error: (error) => {

        console.error(
          'Unable to update physical details',
          error
        );

      }

    });


  }


  isWeightInvalid(): boolean {

    if (
      this.weight === null ||
      this.weight === undefined
    ) {
      return false;
    }

    return (
      !Number.isFinite(this.weight) ||
      this.weight < 20 ||
      this.weight > 250
    );

  }
  isBodyTypeInvalid(): boolean {

    const validBodyTypes = [
      'Slim',
      'Average',
      'Athletic',
      'Heavy'
    ];

    return !!this.bodyType &&
      !validBodyTypes.includes(
        this.bodyType
      );

  }


  isComplexionInvalid(): boolean {

    const validComplexions = [
      'Very Fair',
      'Fair',
      'Wheatish',
      'Medium',
      'Dusky',
      'Dark'
    ];

    return !!this.complexion &&
      !validComplexions.includes(
        this.complexion
      );

  }
  goBack(): void {

    this.router.navigate([
      this.returnTo
    ]);

  }

}