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

  constructor(private router: Router) {}

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

      this.expectations =
        profile.expectations || '';

    } catch (error) {

      console.error(
        'Unable to load expectations',
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

      profile.expectations =
        this.expectations.trim();

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

  goBack(): void {

      this.router.navigate([
        this.returnTo
      ]);

  }

}