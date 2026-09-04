import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { UserMenu } from '../../components/user-menu/user-menu';
import { ProfileService } from '../../services/profile';
import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-my-details',
  imports: [UserMenu],
  templateUrl: './my-details.html',
  styleUrl: './my-details.css'
})


export class MyDetails implements OnInit {

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef
  ) { }

  user: Profile | null = null;
  selectedPhoto: string | null = null;

  isPhotoViewerOpen = false;
  selectedPhotoIndex = 0;
  touchStartX = 0;
  touchEndX = 0;


  ngOnInit(): void {

  console.log('🔥 MY DETAILS → loading profile');

  this.profileService.getCurrentProfileFromApi().subscribe({

    next: (profile: Profile | null) => {

      console.log(
        'MY DETAILS PROFILE API:',
        profile
      );

      this.user = profile;

      console.log(
        'MY DETAILS USER:',
        this.user
      );

      // Force immediate UI update
      this.cdr.detectChanges();

    },

    error: (error: any) => {

      console.error(
        'MY DETAILS PROFILE API ERROR:',
        error
      );

      this.user = null;

      this.cdr.detectChanges();

    }

  });

}


  formatHeight(totalInches: number): string {

    if (!totalInches) {
      return '';
    }

    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;

    return `${feet}'${inches}"`;
  }
  formatProfileFor(value: string): string {

    if (!value) {
      return '-';
    }

    const labels: Record<string, string> = {
      self: 'Self',
      sister: 'Sister',
      brother: 'Brother',
      son: 'Son',
      daughter: 'Daughter',
      friend: 'Friend',
      relative: 'Relative'
    };

    return labels[value] || value;
  }
  formatValue(value: string): string {

    if (!value) {
      return '-';
    }

    const labels: Record<string, string> = {
      yes: 'Yes',
      no: 'No',
      dont_know: "Don't Know",
      with_me: 'Living with me',
      not_with_me: 'Not living with me',
      yes_living: 'Yes, living with them',
      yes_not_living: 'Yes, not living with them'
    };

    return labels[value] || value;
  }

  closePhotoViewer(): void {

    this.selectedPhoto = null;

    this.isPhotoViewerOpen = false;

  }

  openPhotoViewer(
    photo: string,
    index: number
  ): void {

    this.selectedPhoto = photo;

    this.selectedPhotoIndex = index;

    this.isPhotoViewerOpen = true;

  }
  nextPhoto(): void {

    if (!this.user?.photos?.length) {
      return;
    }

    if (
      this.selectedPhotoIndex <
      this.user.photos.length - 1
    ) {

      this.selectedPhotoIndex++;

      this.selectedPhoto =
        this.user.photos[
        this.selectedPhotoIndex
        ];

    }

  }
  previousPhoto(): void {

    if (!this.user?.photos?.length) {
      return;
    }

    if (this.selectedPhotoIndex > 0) {

      this.selectedPhotoIndex--;

      this.selectedPhoto =
        this.user.photos[
        this.selectedPhotoIndex
        ];

    }

  }
  handlePhotoTouchStart(event: TouchEvent): void {

    this.touchStartX =
      event.changedTouches[0].screenX;

  }
  handlePhotoTouchEnd(event: TouchEvent): void {

    this.touchEndX =
      event.changedTouches[0].screenX;

    const swipeDistance =
      this.touchStartX -
      this.touchEndX;

    const minimumSwipeDistance = 50;

    if (
      Math.abs(swipeDistance) <
      minimumSwipeDistance
    ) {
      return;
    }

    if (swipeDistance > 0) {

      // Swipe left → next
      this.nextPhoto();

    } else {

      // Swipe right → previous
      this.previousPhoto();

    }

  }

  openPhysicalDetails(): void {
  this.router.navigate(
    ['/physical-details'],
    {
      queryParams: {
        returnUrl: '/my-details',
        section: 'physical'
      }
    }
  );
}

openContactDetails(): void {
  this.router.navigate(
    ['/contact-details'],
    {
      queryParams: {
        returnUrl: '/my-details',
        section: 'contact'
      }
    }
  );
}

openWorkDetails(): void {
  this.router.navigate(
    ['/work-details'],
    {
      queryParams: {
        returnUrl: '/my-details',
        section: 'work'
      }
    }
  );
}

openFamilyDetails(): void {
  this.router.navigate(
    ['/family-details'],
    {
      queryParams: {
        returnUrl: '/my-details',
        section: 'family'
      }
    }
  );
}

openAdditionalPreferences(): void {
  this.router.navigate(
    ['/additional-preferences'],
    {
      queryParams: {
        returnUrl: '/my-details',
        section: 'additional-preferences'
      }
    }
  );
}

openExpectations(): void {
  this.router.navigate(
    ['/expectations'],
    {
      queryParams: {
        returnUrl: '/my-details',
        section: 'expectations'
      }
    }
  );
}

openProfilePhotos(): void {
  this.router.navigate(
    ['/profile-photos'],
    {
      queryParams: {
        returnUrl: '/my-details',
        section: 'photos'
      }
    }
  );
}
 
  // openProfilePhotos(): void {

  //   sessionStorage.setItem(
  //     'mwi_edit_source',
  //     'my-details'
  //   );

  //   this.router.navigate([
  //     '/profile-photos'
  //   ]);

  // }



  formatWorkLocation(): string {

    if (!this.user?.workLocationType) {
      return '-';
    }


    if (
      this.user.workLocationType ===
      'india_same_state'
    ) {

      return [
        'India',
        this.user.workState,
        this.user.workDistrict
      ]
        .filter(Boolean)
        .join(' – ');

    }


    if (
      this.user.workLocationType ===
      'india_other_state'
    ) {

      return [
        'India',
        this.user.workState,
        this.user.workDistrict
      ]
        .filter(Boolean)
        .join(' – ');

    }


    if (
      this.user.workLocationType ===
      'outside_india'
    ) {

      return [
        this.user.workCountry,
        this.user.workCity
      ]
        .filter(Boolean)
        .join(' – ');

    }


    return '-';

  }


}