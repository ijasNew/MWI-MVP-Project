import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'app-profile-photos',
  imports: [],
  templateUrl: './profile-photos.html',
  styleUrl: './profile-photos.css'
})
export class ProfilePhotos implements OnInit {

  returnTo = '/complete-profile';

  photos: string[] = [];

  isLoadingPhoto = false;


  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    const fromMyDetails =
      sessionStorage.getItem(
        'mwi_edit_source'
      );

    if (
      fromMyDetails === 'my-details'
    ) {

      this.returnTo =
        '/my-details';

    }


    const saved =
      sessionStorage.getItem(
        'mwi_registration'
      );

    if (!saved) {
      return;
    }


    try {

      const profile =
        JSON.parse(saved);

      if (
        Array.isArray(profile.photos)
      ) {

        this.photos =
          [...profile.photos];

      }

    } catch (error) {

      console.error(
        'Unable to load profile photos',
        error
      );

    }

  }


 async onPhotosSelected(event: Event): Promise<void> {

  const input =
    event.target as HTMLInputElement;

  if (
    !input.files ||
    input.files.length === 0
  ) {
    return;
  }

  const remaining =
    4 - this.photos.length;

  if (remaining <= 0) {
    input.value = '';
    return;
  }

  const files =
    Array.from(input.files)
      .filter(file =>
        file.type.startsWith('image/')
      )
      .slice(0, remaining);

  if (files.length === 0) {
    input.value = '';
    return;
  }

  this.isLoadingPhoto = true;

  try {

    const loadedPhotos =
      await Promise.all(
        files.map(file =>
          this.readPhoto(file)
        )
      );

    this.photos.push(
      ...loadedPhotos
    );

  } catch (error) {

    console.error(
      'Unable to load selected photo',
      error
    );

  } finally {

    this.isLoadingPhoto = false;
  this.cdr.detectChanges();
    /*
     * Only add detectChanges if Angular
     * actually fails to refresh the view.
     */
  }

  // Allow selecting the same file again
  input.value = '';

}


private readPhoto(
  file: File
): Promise<string> {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();

      reader.onload = () => {

        if (
          typeof reader.result === 'string'
        ) {

          resolve(
            reader.result
          );

        } else {

          reject(
            new Error(
              'Unable to read image'
            )
          );

        }

      };

      reader.onerror = () => {

        reject(
          new Error(
            'FileReader failed'
          )
        );

      };

      reader.readAsDataURL(file);

    }
  );

}


  removePhoto(
    index: number
  ): void {

    this.photos.splice(
      index,
      1
    );

  }


  savePhotos(): void {

    /*
     * Do not save while the selected
     * photos are still loading.
     */

    if (this.isLoadingPhoto) {

      return;

    }


    const saved =
      sessionStorage.getItem(
        'mwi_registration'
      );

    if (!saved) {

      console.error(
        'Registration data not found'
      );

      return;

    }


    try {

      const profile =
        JSON.parse(saved);


      profile.photoCount =
        this.photos.length;


      profile.photos =
        [...this.photos];


      sessionStorage.setItem(
        'mwi_registration',
        JSON.stringify(profile)
      );


      this.router.navigate([
        this.returnTo
      ]);


    } catch (error) {

      console.error(
        'Unable to save profile photos',
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