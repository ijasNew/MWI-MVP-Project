import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserMenu } from '../../components/user-menu/user-menu';
import { ProfileService } from '../../services/profile';

@Component({
  selector: 'app-interests',
  imports: [UserMenu],
  templateUrl: './interests.html',
  styleUrl: './interests.css'
})
export class Interests implements OnInit {

  constructor(
    private router: Router,
     private profileService: ProfileService
  ) {}

  user: any = null;

  menuOpen = false;

  activeTab = 'received';

ngOnInit(): void {

  const profile =
    this.profileService.getCurrentProfile();

  if (!profile) {
    return;
  }

  this.user = profile;
}
  

  toggleMenu(): void {

    this.menuOpen =
      !this.menuOpen;

  }


  selectTab(tab: string): void {

    this.activeTab = tab;

  }


  getInitials(
    name: string | undefined
  ): string {

    if (!name) {
      return 'U';
    }

    const parts =
      name.trim().split(/\s+/);

    if (parts.length === 1) {

      return parts[0][0]
        .toUpperCase();

    }

    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();

  }
// =========================
// VIEW PROFILE
// =========================

viewProfile(memberId: string): void {

  if (!memberId) {
    return;
  }

  this.router.navigate([
    '/profile-view',
    memberId
  ], {
    state: {
      returnUrl: '/interests'
    }
  });

}


// =========================
// ACCEPT INTEREST
// =========================

acceptInterest(
  interestId: string
): void {

  if (!interestId) {
    return;
  }

  console.log(
    'Accept interest:',
    interestId
  );

}


// =========================
// DECLINE INTEREST
// =========================

declineInterest(
  interestId: string
): void {

  if (!interestId) {
    return;
  }

  console.log(
    'Decline interest:',
    interestId
  );

}


// =========================
// CANCEL INTEREST
// =========================

cancelInterest(
  interestId: string
): void {

  if (!interestId) {
    return;
  }

  console.log(
    'Cancel interest:',
    interestId
  );

}

  logout(): void {

    sessionStorage.removeItem(
      'mwi_registration'
    );

    window.location.href = '/';

  }

}