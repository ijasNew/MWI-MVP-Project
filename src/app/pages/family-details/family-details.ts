import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-family-details',
  imports: [FormsModule],
  templateUrl: './family-details.html',
  styleUrl: './family-details.css'
})
export class FamilyDetails implements OnInit {

  returnTo: string = '/complete-profile';

  // =========================
  // FATHER
  // =========================

  fatherName = '';
  fatherOccupation = '';
  fatherStatus = '';

  // =========================
  // MOTHER
  // =========================

  motherName = '';
  motherOccupation = '';
  motherStatus = '';

  // =========================
  // SIBLINGS
  // =========================

  brothers: number | null = null;
  sisters: number | null = null;

  marriedBrothers: number | null = null;
  marriedSisters: number | null = null;

  // =========================
  // FAMILY
  // =========================

  familyStatus = '';
  homeType = '';

  // =========================
  // VALIDATION
  // =========================

  submitted = false;

  readonly validFatherStatuses = [
    'living',
    'passed_away'
  ];

  readonly validMotherStatuses = [
    'living',
    'passed_away'
  ];

  readonly validFamilyStatuses = [
    'Lower Middle Class',
    'Middle Class',
    'Upper Middle Class',
    'Affluent'
  ];

  readonly validHomeTypes = [
    'Own House',
    'Rented House',
    'Family House',
    'Other'
  ];


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


      this.fatherName =
        profile.fatherName || '';

      this.fatherOccupation =
        profile.fatherOccupation || '';

      this.fatherStatus =
        profile.fatherStatus || '';


      this.motherName =
        profile.motherName || '';

      this.motherOccupation =
        profile.motherOccupation || '';

      this.motherStatus =
        profile.motherStatus || '';


      this.brothers =
        profile.brothers ?? null;

      this.sisters =
        profile.sisters ?? null;

      this.marriedBrothers =
        profile.marriedBrothers ?? null;

      this.marriedSisters =
        profile.marriedSisters ?? null;


      this.familyStatus =
        profile.familyStatus || '';

      this.homeType =
        profile.homeType || '';


    } catch (error) {

      console.error(
        'Unable to load family details',
        error
      );

    }

  }


  // =========================
  // NAME VALIDATION
  // =========================

  isNameInvalid(
    value: string
  ): boolean {

    if (!value) {
      return false;
    }


    const text =
      value.trim();


    if (
      text.length === 0 ||
      text.length > 100
    ) {

      return true;

    }


    const pattern =
      /^[A-Za-zÀ-ÿ.'-]+(?:\s+[A-Za-zÀ-ÿ.'-]+)*$/;


    return !pattern.test(text);

  }


  // =========================
  // TEXT VALIDATION
  // =========================

  isTextInvalid(
    value: string,
    maxLength = 100
  ): boolean {

    if (!value) {
      return false;
    }


    const text =
      value.trim();


    if (
      text.length === 0 ||
      text.length > maxLength
    ) {

      return true;

    }


    const pattern =
      /^[A-Za-zÀ-ÿ0-9₹&.,'()\/\-]+(?:\s+[A-Za-zÀ-ÿ0-9₹&.,'()\/\-]+)*$/;


    return !pattern.test(text);

  }


  // =========================
  // SIBLING COUNT VALIDATION
  // =========================

  isSiblingCountInvalid(
    value: number | null
  ): boolean {

    if (
      value === null ||
      value === undefined
    ) {

      return false;

    }


    return (
      !Number.isInteger(value) ||
      value < 0 ||
      value > 20
    );

  }


  // =========================
  // MARRIED SIBLING LOGIC
  // =========================

  isMarriedSiblingInvalid(): boolean {

    // Married brothers cannot exceed
    // total brothers

    if (
      this.marriedBrothers !== null &&
      this.brothers !== null &&
      this.marriedBrothers >
        this.brothers
    ) {

      return true;

    }


    // Married sisters cannot exceed
    // total sisters

    if (
      this.marriedSisters !== null &&
      this.sisters !== null &&
      this.marriedSisters >
        this.sisters
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


    // =========================
    // NAME
    // =========================

    if (
      this.isNameInvalid(
        this.fatherName
      ) ||
      this.isNameInvalid(
        this.motherName
      )
    ) {

      return;

    }


    // =========================
    // OCCUPATION
    // =========================

    if (
      this.isTextInvalid(
        this.fatherOccupation
      ) ||
      this.isTextInvalid(
        this.motherOccupation
      )
    ) {

      return;

    }


    // =========================
    // FATHER STATUS
    // =========================

    if (
      this.fatherStatus &&
      !this.validFatherStatuses.includes(
        this.fatherStatus
      )
    ) {

      return;

    }


    // =========================
    // MOTHER STATUS
    // =========================

    if (
      this.motherStatus &&
      !this.validMotherStatuses.includes(
        this.motherStatus
      )
    ) {

      return;

    }


    // =========================
    // SIBLING COUNTS
    // =========================

    if (
      this.isSiblingCountInvalid(
        this.brothers
      ) ||
      this.isSiblingCountInvalid(
        this.sisters
      ) ||
      this.isSiblingCountInvalid(
        this.marriedBrothers
      ) ||
      this.isSiblingCountInvalid(
        this.marriedSisters
      )
    ) {

      return;

    }


    // =========================
    // MARRIED SIBLING LOGIC
    // =========================

    if (
      this.isMarriedSiblingInvalid()
    ) {

      return;

    }


    // =========================
    // FAMILY STATUS
    // =========================

    if (
  !this.familyStatus ||
  !this.validFamilyStatuses.includes(
    this.familyStatus
  )
) {

  return;

}


    // =========================
    // HOME TYPE
    // =========================

    if (
      this.homeType &&
      !this.validHomeTypes.includes(
        this.homeType
      )
    ) {

      return;

    }


    // =========================
    // LOAD PROFILE
    // =========================

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


      profile.fatherName =
        this.fatherName.trim();

      profile.fatherOccupation =
        this.fatherOccupation.trim();

      profile.fatherStatus =
        this.fatherStatus;


      profile.motherName =
        this.motherName.trim();

      profile.motherOccupation =
        this.motherOccupation.trim();

      profile.motherStatus =
        this.motherStatus;


      profile.brothers =
        this.brothers;

      profile.sisters =
        this.sisters;

      profile.marriedBrothers =
        this.marriedBrothers;

      profile.marriedSisters =
        this.marriedSisters;


      profile.familyStatus =
        this.familyStatus;

      profile.homeType =
        this.homeType;


      // =========================
      // SECTION COMPLETED
      // =========================

      profile.familyDetailsCompleted =
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
        'Unable to save family details',
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