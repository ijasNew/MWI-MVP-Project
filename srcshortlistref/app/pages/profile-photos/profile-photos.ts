import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile';


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

  photoError = '';

  readonly maxPhotos = 4;

  readonly maxFileSize =
    5 * 1024 * 1024; // 5 MB


  readonly allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];


  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
     private profileService: ProfileService
  ) {}


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

  const fromMyDetails =
    sessionStorage.getItem('mwi_edit_source');

  if (fromMyDetails === 'my-details') {
    this.returnTo = '/my-details';
  }


  const profile =
    this.profileService.getCurrentProfile();

  if (!profile) {
    return;
  }


  if (Array.isArray(profile.photos)) {

    this.photos =
      profile.photos
        .filter(
          (photo: unknown) =>
            typeof photo === 'string' &&
            photo.startsWith('data:image/')
        )
        .slice(0, this.maxPhotos);
  }
}

  // =========================
  // FILE SELECTION
  // =========================

  async onPhotosSelected(
    event: Event
  ): Promise<void> {

    this.photoError = '';

    

    const input =
      event.target as HTMLInputElement;


    if (
      !input.files ||
      input.files.length === 0
    ) {

      return;

    }


    const remaining =
      this.maxPhotos -
      this.photos.length;


    if (
      remaining <= 0
    ) {

      this.photoError =
        'You can upload a maximum of 4 photos.';

      input.value = '';

      return;

    }


    const selectedFiles =
      Array.from(
        input.files
      ).slice(
        0,
        remaining
      );


    const validFiles: File[] = [];


    for (
      const file of selectedFiles
    ) {

      // =========================
      // FILE TYPE
      // =========================

      if (
        !this.allowedTypes.includes(
          file.type
        )
      ) {

        this.photoError =
          'Only JPG, PNG and WebP images are allowed.';

        continue;

      }


      // =========================
      // FILE SIZE
      // =========================

      if (
        file.size >
        this.maxFileSize
      ) {

        this.photoError =
          'Each photo must be 5 MB or smaller.';

        continue;

      }


      // =========================
      // EMPTY FILE
      // =========================

      if (
        file.size === 0
      ) {

        this.photoError =
          'The selected photo is empty or invalid.';

        continue;

      }


      validFiles.push(file);

    }


    if (
      validFiles.length === 0
    ) {

      input.value = '';

      return;

    }


    this.isLoadingPhoto = true;


    try {

      const loadedPhotos =
        await Promise.all(
          validFiles.map(
            file =>
              this.readPhoto(file)
          )
        );


      for (
        const photo of loadedPhotos
      ) {

        if (
          this.photos.length >=
          this.maxPhotos
        ) {

          break;

        }


        // Prevent exact duplicate
        if (
          !this.photos.includes(
            photo
          )
        ) {

          this.photos.push(
            photo
          );

        }

      }


    } catch (error) {

      console.error(
        'Unable to load selected photo',
        error
      );


      this.photoError =
        'Unable to load one or more photos. Please try again.';

    } finally {

      this.isLoadingPhoto =
        false;


      this.cdr.detectChanges();

    }


    // Allow selecting same file again

    input.value = '';

  }


  // =========================
  // READ IMAGE
  // =========================

  private readPhoto(
    file: File
  ): Promise<string> {

    return new Promise(
      (
        resolve,
        reject
      ) => {

        const reader =
          new FileReader();


        reader.onload = () => {

          if (
            typeof reader.result !==
            'string'
          ) {

            reject(
              new Error(
                'Unable to read image'
              )
            );

            return;

          }


          // Verify actual image
          const image =
            new Image();


          image.onload = () => {

            if (
              image.naturalWidth <= 0 ||
              image.naturalHeight <= 0
            ) {

              reject(
                new Error(
                  'Invalid image dimensions'
                )
              );

              return;

            }


            resolve(
              reader.result as string
            );

          };


          image.onerror = () => {

            reject(
              new Error(
                'Invalid or corrupted image'
              )
            );

          };


          image.src =
            reader.result;

        };


        reader.onerror = () => {

          reject(
            new Error(
              'FileReader failed'
            )
          );

        };


        reader.readAsDataURL(
          file
        );

      }
    );

  }


  // =========================
  // REMOVE PHOTO
  // =========================

  removePhoto(
    index: number
  ): void {

    if (
      index < 0 ||
      index >= this.photos.length
    ) {

      return;

    }


    this.photos.splice(
      index,
      1
    );


    this.photoError = '';

  }


  // =========================
  // SAVE
  // =========================

  savePhotos(): void {

    this.photoError = '';


    // Cannot save while loading

    if (
      this.isLoadingPhoto
    ) {

      return;

    }


    // =========================
    // MINIMUM PHOTO
    // =========================

    if (
      this.photos.length === 0
    ) {

      this.photoError =
        'Please add at least one profile photo.';

      return;

    }


    // =========================
    // MAXIMUM PHOTO
    // =========================

    if (
      this.photos.length >
      this.maxPhotos
    ) {

      this.photoError =
        'You can upload a maximum of 4 photos.';

      return;

    }


    const updatedProfile =
  this.profileService.updateProfile({

    photoCount:
      this.photos.length,

    photos:
      [...this.photos],

    profilePhotosCompleted:
      this.photos.length > 0
  });


if (!updatedProfile) {

  console.error(
    'Unable to save profile photos'
  );

  this.photoError =
    'Unable to save photos. Please try again.';

  return;
}


this.router.navigate([
  this.returnTo
]);

  }


  // =========================
  // BACK
  // =========================

  goBack(): void {

    this.router.navigate([
      this.returnTo
    ]);

  }

}