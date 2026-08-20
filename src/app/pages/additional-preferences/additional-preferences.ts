import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-additional-preferences',
  imports: [FormsModule],
  templateUrl: './additional-preferences.html',
  styleUrl: './additional-preferences.css'
})
export class AdditionalPreferences implements OnInit {
returnTo: string = '/complete-profile';
  preferredFamilyStatus: string[] = [];
  preferredPhysicalStatus: string[] = [];
  preferredIncome: string[] = [];
  preferredLocationRadius: string[] = [];
  preferredComplexion: string[] = [];

  horoscopeRequired = '';
  preferredStar: string[] = [];

  religion = '';

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

      this.religion =
        profile.religion || '';

      this.preferredFamilyStatus =
        profile.preferredFamilyStatus || [];

      this.preferredPhysicalStatus =
        profile.preferredPhysicalStatus || [];

      this.preferredIncome =
        profile.preferredIncome || [];

      this.preferredLocationRadius =
        profile.preferredLocationRadius || [];

      this.preferredComplexion =
        profile.preferredComplexion || [];

      this.horoscopeRequired =
        profile.horoscopeRequired || '';

      this.preferredStar =
        profile.preferredStar || [];

    } catch (error) {

      console.error(
        'Unable to load additional preferences',
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

      profile.preferredFamilyStatus =
        this.preferredFamilyStatus;

      profile.preferredPhysicalStatus =
        this.preferredPhysicalStatus;

      profile.preferredIncome =
        this.preferredIncome;

      profile.preferredLocationRadius =
        this.preferredLocationRadius;

      profile.preferredComplexion =
        this.preferredComplexion;


      // Hindu horoscope preference

      if (this.religion === 'Hindu') {

        profile.horoscopeRequired =
          this.horoscopeRequired;

        profile.preferredStar =
          this.preferredStar;

      } else {

        delete profile.horoscopeRequired;
        delete profile.preferredStar;

      }


      sessionStorage.setItem(
        'mwi_registration',
        JSON.stringify(profile)
      );

       this.router.navigate([
        this.returnTo
      ]);

    } catch (error) {

      console.error(
        'Unable to save additional preferences',
        error
      );

    }

  }

  togglePreference(
    list: string[],
    value: string
  ): void {

    if (value === 'any') {

      list.length = 0;
      list.push('any');

      return;
    }


    const anyIndex =
      list.indexOf('any');

    if (anyIndex !== -1) {
      list.splice(anyIndex, 1);
    }


    const index =
      list.indexOf(value);

    if (index === -1) {

      list.push(value);

    } else {

      list.splice(index, 1);

    }

  }
  goBack(): void {

     this.router.navigate([
        this.returnTo
      ]);

  }

}