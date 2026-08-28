import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile';

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
    private profileService: ProfileService
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

      const profile =
        this.profileService.getCurrentProfile();

      if (!profile) {
        return;
      }

      this.weight =
        profile.weight ?? null;

      this.bodyType =
        profile.bodyType ?? '';

      this.complexion =
        profile.complexion ?? '';

      this.physicalStatus =
        profile.physicalStatus ?? '';

    } catch (error) {

      console.error(
        'Unable to load physical details',
        error
      );

    }

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

    const updatedProfile =
  this.profileService.updateProfile({
    ...(this.weight !== null
      ? { weight: this.weight }
      : {}),

    bodyType: this.bodyType,
    complexion: this.complexion,
    physicalStatus: this.physicalStatus,
    physicalDetailsCompleted: true
  });

    if (!updatedProfile) {
      console.error(
        'Unable to update profile'
      );
      return;
    }
    this.router.navigate([
      this.returnTo
    ]);



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