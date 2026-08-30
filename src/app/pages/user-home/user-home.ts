import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { Router } from '@angular/router'; 
import { UserMenu } from '../../components/user-menu/user-menu';

import { ProfileService } from '../../services/profile';
import { ProfileCompletionService } from '../../services/profile-completion';

import { Profile } from '../../models/profile.model'; 
@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [UserMenu],
  templateUrl: './user-home.html',
  styleUrl: './user-home.css'
})
export class UserHome implements OnInit {

  user: Profile | null = null;

  profileCompletion = 0;

  showProfilePopup = false;


  constructor(
    private router: Router,
    private profileService: ProfileService,
    private profileCompletionService: ProfileCompletionService, 
    private cdr: ChangeDetectorRef
  ) { }


  // =====================================================
  // INIT
  // =====================================================
  ngOnInit(): void {

  console.log('🔥 USER HOME → load profile');

  this.profileService.getCurrentProfileFromApi().subscribe({

    next: (profile: Profile | null) => {

      console.log(
        'USER HOME PROFILE API:',
        profile
      );

      if (!profile) {
        this.user = null;
        return;
      }

      this.user = profile;

      this.profileCompletion =
        this.profileCompletionService.calculate(
          profile
        );

      console.log(
        'USER HOME USER:',
        this.user
      );

      console.log(
        'PROFILE COMPLETION:',
        this.profileCompletion
      );

      if (this.profileCompletion < 90) {
        this.showProfilePopup = true;
      }
       this.cdr.detectChanges();

    },

    error: (error: any) => {

      console.error(
        'USER HOME PROFILE API ERROR:',
        error
      );

      this.user = null;

    }

  });

}
 
  

  // =====================================================
  // FORMAT HEIGHT
  // =====================================================

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


  // =====================================================
  // OPEN PROFILE
  // =====================================================

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


  // =====================================================
  // OPEN ALL PROFILES
  // =====================================================

  openAllProfiles(): void {

    this.router.navigate([
      '/matching-profiles'
    ]);
  }


  // =====================================================
  // OPEN VERIFICATION
  // =====================================================

  openVerification(): void {

    this.router.navigate([
      '/upgrade-profile'
    ]);
  }


  // =====================================================
  // CLOSE PROFILE POPUP
  // =====================================================

  closeProfilePopup(): void {

    this.showProfilePopup = false;
  }


  // =====================================================
  // COMPLETE PROFILE
  // =====================================================

  completeProfile(): void {

    this.showProfilePopup = false;

    this.router.navigate([
      '/complete-profile'
    ]);
  }

}