import { CommonModule } from '@angular/common';
import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProfileCompletionPopupService } from '../../services/profile-completion-popup';

@Component({
  selector: 'app-profile-completion-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="profile-popup-overlay" (click)="close()">
        <div class="profile-popup" (click)="$event.stopPropagation()">
          <button type="button" class="popup-close" (click)="close()">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="popup-icon">
            <i class="fa-solid fa-user-check"></i>
          </div>

          <span class="popup-label">PROFILE COMPLETION</span>

          <h2>Complete Your Profile</h2>

          <p>
            Your profile is <strong>{{ percentage }}%</strong> complete.
          </p>

          <p>
            Complete your profile to get better and more suitable matches.
          </p>

          <div class="popup-progress">
            <div class="popup-progress-bar" [style.width.%]="percentage"></div>
          </div>

          <button type="button" class="complete-profile-btn" (click)="completeProfile()">
            Complete Profile
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { position: relative; z-index: 99999; }
    .profile-popup-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(15, 23, 42, .52);
      backdrop-filter: blur(3px);
    }
    .profile-popup {
      position: relative;
      width: min(420px, 100%);
      padding: 30px 26px 26px;
      border-radius: 18px;
      background: #fff;
      box-shadow: 0 24px 70px rgba(0,0,0,.18);
      text-align: center;
    }
    .popup-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 34px;
      height: 34px;
      border: 0;
      border-radius: 50%;
      background: #f3f4f6;
      color: #6b7280;
      cursor: pointer;
    }
    .popup-icon {
      width: 58px;
      height: 58px;
      margin: 0 auto 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #f1f5f9;
      color: #111827;
      font-size: 22px;
    }
    .popup-label {
      display: block;
      margin-bottom: 6px;
      color: #8a8f98;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.4px;
    }
    .profile-popup h2 {
      margin: 0 0 10px;
      color: #111827;
      font-size: 25px;
    }
    .profile-popup p {
      margin: 7px 0;
      color: #6b7280;
      font-size: 14px;
      line-height: 1.55;
    }
    .profile-popup p strong { color: #111827; }
    .popup-progress {
      height: 8px;
      margin: 20px 0;
      overflow: hidden;
      border-radius: 99px;
      background: #eceef2;
    }
    .popup-progress-bar {
      height: 100%;
      border-radius: inherit;
      background: #111827;
      transition: width .3s ease;
    }
    .complete-profile-btn {
      width: 100%;
      min-height: 46px;
      border: 0;
      border-radius: 10px;
      background: #111827;
      color: #fff;
      font-weight: 700;
      cursor: pointer;
    }
    .complete-profile-btn i { margin-left: 8px; }
    @media (max-width: 480px) {
      .profile-popup-overlay { padding: 14px; }
      .profile-popup { padding: 28px 20px 20px; }
    }
  `]
})
export class ProfileCompletionPopup implements OnDestroy {
  visible = false;
  percentage = 0;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private popupService: ProfileCompletionPopupService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.popupService.open$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.percentage = Math.max(0, Math.min(100, Number(data?.percentage ?? 0)));
        this.visible = true;
        this.cdr.detectChanges();
      });
  }

  close(): void {
    this.visible = false;
    this.cdr.detectChanges();
  }

  completeProfile(): void {
    this.close();
    this.router.navigate(['/complete-profile']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
