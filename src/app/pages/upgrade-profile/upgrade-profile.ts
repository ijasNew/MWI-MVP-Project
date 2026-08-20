import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserMenu } from '../../components/user-menu/user-menu';

@Component({
  selector: 'app-upgrade-profile',
  imports: [UserMenu],
  templateUrl: './upgrade-profile.html',
  styleUrl: './upgrade-profile.css'
})
export class UpgradeProfile {

  constructor(
    private router: Router
  ) {}

  continueVerification(): void {

    // Payment / verification flow will be connected later.

    console.log(
      'Continue Home Verification'
    );

  }

  openWhatsAppSupport(): void {

    // WhatsApp support will be connected later.

    console.log(
      'WhatsApp support'
    );

  }

}