import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { ProfileService } from '../../services/profile';
import { ApiService } from '../../services/api';
import { environment } from '../../../environments/environment';

interface PhotoItem {
  id: number | null;
  url: string;
  file: File | null;
}

@Component({
  selector: 'app-profile-photos',
  imports: [],
  templateUrl: './profile-photos.html',
  styleUrl: './profile-photos.css'
})
export class ProfilePhotos implements OnInit {

  returnTo = '/complete-profile';

  photos: string[] = [];

  private photoItems: PhotoItem[] = [];

  isLoadingPhoto = false;

  isLoadingPhotos = false;

  photoError = '';

  readonly maxPhotos = 4;

  readonly maxFileSize = 5 * 1024 * 1024;

  readonly allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private profileService: ProfileService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {
    const returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl');

    if (returnUrl) {
      this.returnTo = this.safeReturnUrl(returnUrl);
    } else {
      const fromMyDetails =
        sessionStorage.getItem('mwi_edit_source');

      if (fromMyDetails === 'my-details') {
        this.returnTo = '/my-details';
      }
    }

    this.loadPhotos();
  }

  // =========================
  // LOAD FROM API
  // =========================

  loadPhotos(): void {
    this.isLoadingPhotos = true;
    this.photoError = '';

    this.apiService.getProfilePhotos().subscribe({
      next: (response: any) => {
        const data = response?.data ?? response ?? {};
        const apiPhotos = Array.isArray(data?.photos)
          ? data.photos
          : [];

        this.photoItems = apiPhotos
          .filter((photo: any) =>
            photo &&
            Number.isInteger(Number(photo.id)) &&
            typeof photo.url === 'string' &&
            photo.url.trim() !== ''
          )
          .slice(0, this.maxPhotos)
          .map((photo: any) => ({
            id: Number(photo.id),
            url: this.toAbsolutePhotoUrl(photo.url),
            file: null
          }));

        this.syncPhotosForTemplate();
        this.isLoadingPhotos = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Unable to load profile photos', error);
        this.isLoadingPhotos = false;
        this.photoError =
          error?.error?.message ||
          'Unable to load profile photos. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  // =========================
  // FILE SELECTION
  // =========================

  async onPhotosSelected(event: Event): Promise<void> {
    this.photoError = '';

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const remaining =
      this.maxPhotos - this.photoItems.length;

    if (remaining <= 0) {
      this.photoError =
        'You can upload a maximum of 4 photos.';
      input.value = '';
      return;
    }

    const selectedFiles = Array.from(input.files)
      .slice(0, remaining);

    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      if (!this.allowedTypes.includes(file.type)) {
        this.photoError =
          'Only JPG, PNG and WebP images are allowed.';
        continue;
      }

      if (file.size > this.maxFileSize) {
        this.photoError =
          'Each photo must be 5 MB or smaller.';
        continue;
      }

      if (file.size === 0) {
        this.photoError =
          'The selected photo is empty or invalid.';
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      input.value = '';
      return;
    }

    this.isLoadingPhoto = true;

    try {
      const loadedPhotos = await Promise.all(
        validFiles.map(file => this.readPhoto(file))
      );

      for (let i = 0; i < loadedPhotos.length; i++) {
        if (this.photoItems.length >= this.maxPhotos) {
          break;
        }

        const photo = loadedPhotos[i];
        const file = validFiles[i];

        // New files are identified by their File object.
        const duplicate = this.photoItems.some(
          item =>
            item.file?.name === file.name &&
            item.file?.size === file.size &&
            item.file?.lastModified === file.lastModified
        );

        if (!duplicate) {
          this.photoItems.push({
            id: null,
            url: photo,
            file
          });
        }
      }

      this.syncPhotosForTemplate();
    } catch (error) {
      console.error(
        'Unable to load selected photo',
        error
      );

      this.photoError =
        'Unable to load one or more photos. Please try again.';
    } finally {
      this.isLoadingPhoto = false;
      this.cdr.detectChanges();
    }

    input.value = '';
  }

  // =========================
  // READ IMAGE
  // =========================

  private readPhoto(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result !== 'string') {
          reject(new Error('Unable to read image'));
          return;
        }

        const image = new Image();

        image.onload = () => {
          if (
            image.naturalWidth <= 0 ||
            image.naturalHeight <= 0
          ) {
            reject(new Error('Invalid image dimensions'));
            return;
          }

          resolve(reader.result as string);
        };

        image.onerror = () => {
          reject(new Error('Invalid or corrupted image'));
        };

        image.src = reader.result;
      };

      reader.onerror = () => {
        reject(new Error('FileReader failed'));
      };

      reader.readAsDataURL(file);
    });
  }

  // =========================
  // REMOVE PHOTO
  // =========================

  removePhoto(index: number): void {
    if (
      index < 0 ||
      index >= this.photoItems.length ||
      this.isLoadingPhoto ||
      this.isLoadingPhotos
    ) {
      return;
    }

    this.photoItems.splice(index, 1);
    this.syncPhotosForTemplate();
    this.photoError = '';
    this.cdr.detectChanges();
  }

  // =========================
  // SAVE
  // =========================

  savePhotos(): void {
    this.photoError = '';

    if (this.isLoadingPhoto || this.isLoadingPhotos) {
      return;
    }

    if (this.photoItems.length === 0) {
      this.photoError =
        'Please add at least one profile photo.';
      return;
    }

    if (this.photoItems.length > this.maxPhotos) {
      this.photoError =
        'You can upload a maximum of 4 photos.';
      return;
    }

    const retainedIds = this.photoItems
      .filter(item => item.id !== null)
      .map(item => item.id as number);

    const newFiles = this.photoItems
      .filter(item => item.id === null && item.file instanceof File)
      .map(item => item.file as File);

    // A newly added item must always have its File object.
    if (
      retainedIds.length + newFiles.length !==
      this.photoItems.length
    ) {
      this.photoError =
        'One or more selected photos are invalid. Please select them again.';
      return;
    }

    this.isLoadingPhoto = true;
    this.cdr.detectChanges();

    this.apiService
      .saveProfilePhotos(retainedIds, newFiles)
      .subscribe({
        next: (response: any) => {
          const data = response?.data ?? response ?? {};
          const apiPhotos = Array.isArray(data?.photos)
            ? data.photos
            : [];

          this.photoItems = apiPhotos
            .filter((photo: any) =>
              photo &&
              Number.isInteger(Number(photo.id)) &&
              typeof photo.url === 'string' &&
              photo.url.trim() !== ''
            )
            .slice(0, this.maxPhotos)
            .map((photo: any) => ({
              id: Number(photo.id),
              url: this.toAbsolutePhotoUrl(photo.url),
              file: null
            }));

          this.syncPhotosForTemplate();

          // Keep the existing local cache in sync for screens that
          // still read ProfileService before their next API refresh.
          this.profileService.updateProfile({
            photoCount: this.photos.length,
            photos: [...this.photos],
            profilePhotosCompleted: this.photos.length > 0
          });

          this.isLoadingPhoto = false;
          this.cdr.detectChanges();

          this.router.navigateByUrl(this.returnTo);
        },
        error: (error: any) => {
          console.error('Unable to save profile photos', error);
          this.isLoadingPhoto = false;
          this.photoError =
            error?.error?.message ||
            'Unable to save photos. Please try again.';
          this.cdr.detectChanges();
        }
      });
  }

  // =========================
  // BACK
  // =========================

  goBack(): void {
    if (this.isLoadingPhoto) {
      return;
    }

    this.router.navigateByUrl(this.returnTo);
  }

  // =========================
  // HELPERS
  // =========================

  private syncPhotosForTemplate(): void {
    this.photos = this.photoItems.map(item => item.url);
  }

  private toAbsolutePhotoUrl(url: string): string {
    const cleanUrl = url.trim();

    if (/^https?:\/\//i.test(cleanUrl)) {
      return cleanUrl;
    }

    return `${environment.apiUrl.replace(/\/$/, '')}/${cleanUrl.replace(/^\//, '')}`;
  }

  private safeReturnUrl(value: string): string {
    const trimmed = value.trim();

    // Only allow internal Angular routes.
    if (
      !trimmed.startsWith('/') ||
      trimmed.startsWith('//') ||
      /^https?:\/\//i.test(trimmed)
    ) {
      return '/complete-profile';
    }

    return trimmed;
  }
}
