import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserMenu } from '../../components/user-menu/user-menu';

@Component({
  selector: 'app-shortlisted',
  imports: [UserMenu],
  templateUrl: './shortlisted.html',
  styleUrl: './shortlisted.css'
})
export class Shortlisted {

  readonly hasShortlistedProfiles = true;

  constructor(
    private router: Router
  ) {}

  viewProfile(memberId: string): void {

    if (!memberId) {
      return;
    }

    this.router.navigate([
      '/profile-view',
      memberId
    ], {
      state: {
        returnUrl: '/shortlisted'
      }
    });
  }


  removeShortlist(memberId: string): void {

    console.log(
      'Remove from shortlist:',
      memberId
    );

  }

}