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

  collegeUniversity = '';
  companyName = '';
  workLocation = '';
  annualIncome = '';

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

      this.collegeUniversity =
        profile.collegeUniversity || '';

      this.companyName =
        profile.companyName || '';

      this.workLocation =
        profile.workLocation || '';

      this.annualIncome =
        profile.annualIncome || '';

    } catch (error) {

      console.error(
        'Unable to load work details',
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

      profile.collegeUniversity =
        this.collegeUniversity.trim();

      profile.companyName =
        this.companyName.trim();

      profile.workLocation =
        this.workLocation.trim();

      profile.annualIncome =
        this.annualIncome;

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


  goBack(): void {
this.router.navigate([
  this.returnTo
]);

  }
  getSavedValue(field: string): string {

    const saved =
      sessionStorage.getItem('mwi_registration');

    if (!saved) {
      return '-';
    }

    try {

      const profile = JSON.parse(saved);

      return profile[field] || '-';

    } catch {

      return '-';

    }

  }
}