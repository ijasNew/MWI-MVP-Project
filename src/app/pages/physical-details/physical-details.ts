import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-physical-details',
  imports: [FormsModule],
  templateUrl: './physical-details.html',
  styleUrl: './physical-details.css'
})
export class PhysicalDetails implements OnInit {

  weight: number | null = null;
  bodyType = '';
  complexion = '';
  physicalStatus = '';
  returnTo: string = '/complete-profile';
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

      // Load already saved values

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

    const saved =
      sessionStorage.getItem('mwi_registration');

    if (!saved) {
      return;
    }

    try {

      const profile = JSON.parse(saved);

      profile.weight = this.weight;
      profile.bodyType = this.bodyType;
      profile.complexion = this.complexion;
      profile.physicalStatus = this.physicalStatus;

      sessionStorage.setItem(
        'mwi_registration',
        JSON.stringify(profile)
      );

      this.router.navigate([
        this.returnTo
      ]);

    } catch (error) {

      console.error(
        'Unable to save physical details',
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