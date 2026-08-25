import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserMenu } from '../../components/user-menu/user-menu';
import { ProfileCompletionService } from '../../services/profile-completion';

@Component({
  selector: 'app-user-home',
  imports: [UserMenu],
  templateUrl: './user-home.html',
  styleUrl: './user-home.css'
})

export class UserHome implements OnInit {

  constructor(
    private router: Router,
    private profileCompletionService: ProfileCompletionService
  ) { }


  user: any = null;
  profileCompletion = 0;

  showProfilePopup = false;


  ngOnInit(): void {

    const savedData =
      sessionStorage.getItem(
        'mwi_registration'
      );

    if (!savedData) {
      return;
    }

    try {

      this.user =
        JSON.parse(savedData);

      console.log(
        'Registration data:',
        this.user
      );

      this.profileCompletion =
        this.profileCompletionService.calculate(
          this.user
        );


      if (this.profileCompletion < 90) {

        this.showProfilePopup = true;

      }
      // Calculate profile completion

       

       

    } catch (error) {

      console.error(
        'Invalid registration data',
        error
      );

      this.user = null;

    }

  }
 

  formatHeight(
    totalInches: number
  ): string {

    if (!totalInches) {
      return '';
    }

    const feet =
      Math.floor(
        totalInches / 12
      );

    const inches =
      totalInches % 12;

    return `${feet}'${inches}"`;

  }


  openProfile(
    memberId: string
  ): void {

    this.router.navigate([
      '/profile-view',
      memberId
    ], {
      state: {
        returnUrl: '/user-home'
      }
    });

  }


  openAllProfiles(): void {

    this.router.navigate([
      '/matching-profiles'
    ]);

  }


  openVerification(): void {

    this.router.navigate([
      '/upgrade-profile'
    ]);

  }
  closeProfilePopup(): void {

    this.showProfilePopup = false;

  }


  completeProfile(): void {

    this.showProfilePopup = false;

    this.router.navigate([
      '/complete-profile'
    ]);

  }
}
