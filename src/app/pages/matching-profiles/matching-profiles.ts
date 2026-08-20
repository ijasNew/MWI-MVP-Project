import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserMenu } from '../../components/user-menu/user-menu';

@Component({
  selector: 'app-matching-profiles',
  imports: [
    UserMenu
  ],
  templateUrl: './matching-profiles.html',
  styleUrl: './matching-profiles.css'
})
export class MatchingProfiles {

  constructor(
    private router: Router
  ) {}


  openProfile(memberId: string): void {

    this.router.navigate([
      '/profile-view',
      memberId
    ]);

  }


  sendInterest(
    event: Event,
    memberId: string
  ): void {

    event.stopPropagation();

    console.log(
      'Interest sent to:',
      memberId
    );

    alert(
      'Interest sent successfully.'
    );

  }


  toggleShortlist(
    event: Event,
    memberId: string
  ): void {

    event.stopPropagation();

    console.log(
      'Shortlisted:',
      memberId
    );

  }

}