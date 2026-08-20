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

  fatherName = '';
  fatherOccupation = '';
  fatherStatus = '';

  motherName = '';
  motherOccupation = '';
  motherStatus = '';

  brothers: number | null = null;
  sisters: number | null = null;

  marriedBrothers: number | null = null;
  marriedSisters: number | null = null;

  familyStatus = '';
  homeType = '';

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


  saveDetails(): void {

    const saved =
      sessionStorage.getItem('mwi_registration');

    if (!saved) {
      return;
    }

    try {

      const profile = JSON.parse(saved);

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


  goBack(): void {

   this.router.navigate([
  this.returnTo
]);

  }

}