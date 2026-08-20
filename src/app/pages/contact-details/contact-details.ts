import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-details',
  imports: [FormsModule],
  templateUrl: './contact-details.html',
  styleUrl: './contact-details.css'
})
export class ContactDetails implements OnInit {
  returnTo: string = '/complete-profile';

  primaryMobile = '';

  secondaryMobile = '';
  whatsappNumber = '';
  email = '';

  constructor(
    private router: Router
  ) {}

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

      this.primaryMobile =
        profile.phone || '';

      this.secondaryMobile =
        profile.secondaryMobile || '';

      this.whatsappNumber =
        profile.whatsappNumber || '';

      this.email =
        profile.email || '';

    } catch (error) {

      console.error(
        'Unable to load contact details',
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

      profile.secondaryMobile =
        this.secondaryMobile.trim();

      profile.whatsappNumber =
        this.whatsappNumber.trim();

      profile.email =
        this.email.trim();

      sessionStorage.setItem(
        'mwi_registration',
        JSON.stringify(profile)
      );

      this.router.navigate([
  this.returnTo
]);

    } catch (error) {

      console.error(
        'Unable to save contact details',
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