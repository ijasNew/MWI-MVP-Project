import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserMenu } from '../../components/user-menu/user-menu';
import { AuthService } from '../../services/auth';
import { InterestService, InterestProfile } from '../../services/interest';

@Component({
  selector: 'app-interests',
  imports: [CommonModule, UserMenu],
  templateUrl: './interests.html',
  styleUrl: './interests.css'
})
export class Interests implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private interestService: InterestService,
    private cdr: ChangeDetectorRef
  ) {}

  activeTab: 'received' | 'sent' = 'received';

  received: InterestProfile[] = [];
  sent: InterestProfile[] = [];

  loading = true;
  errorMessage = '';

  // interestIds currently being processed (disables buttons while in-flight)
  busyIds = new Set<string>();


  ngOnInit(): void {
    this.loadInterests();
  }


  // =========================
  // LOAD BOTH LISTS
  // =========================

  loadInterests(): void {

    this.loading = true;
    this.errorMessage = '';

    this.interestService.getReceivedInterests().subscribe((received) => {

      this.received = received;

      this.interestService.getSentInterests().subscribe((sent) => {

        this.sent = sent;

        this.loading = false;

        this.cdr.detectChanges();

      });

    });

  }


  selectTab(tab: 'received' | 'sent'): void {
    this.activeTab = tab;
  }


  getInitials(name: string | undefined): string {

    if (!name) {
      return 'U';
    }

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }


  // =========================
  // VIEW PROFILE
  // =========================

  viewProfile(memberId: string): void {

    if (!memberId) {
      return;
    }

    this.router.navigate(['/profile-view', memberId], {
      state: { returnUrl: '/interests' }
    });

  }


  // =========================
  // ACCEPT INTEREST
  // =========================

  acceptInterest(interestId: string): void {

    if (!interestId || this.busyIds.has(interestId)) {
      return;
    }

    this.busyIds.add(interestId);

    this.interestService.acceptInterest(interestId).subscribe((result) => {

      this.busyIds.delete(interestId);

      if (!result.success) {
        alert(result.message);
        this.cdr.detectChanges();
        return;
      }

      // Update the item in place instead of a full reload.
      const item = this.received.find((i) => i.interestId === interestId);

      if (item) {
        item.status = 'accepted';
      }

      this.cdr.detectChanges();

    });

  }


  // =========================
  // DECLINE INTEREST
  // =========================

  declineInterest(interestId: string): void {

    if (!interestId || this.busyIds.has(interestId)) {
      return;
    }

    this.busyIds.add(interestId);

    this.interestService.declineInterest(interestId).subscribe((result) => {

      this.busyIds.delete(interestId);

      if (!result.success) {
        alert(result.message);
        this.cdr.detectChanges();
        return;
      }

      const item = this.received.find((i) => i.interestId === interestId);

      if (item) {
        item.status = 'declined';
      }

      this.cdr.detectChanges();

    });

  }


  // =========================
  // CANCEL INTEREST
  // =========================

  cancelInterest(interestId: string): void {

    if (!interestId || this.busyIds.has(interestId)) {
      return;
    }

    this.busyIds.add(interestId);

    this.interestService.cancelInterest(interestId).subscribe((result) => {

      this.busyIds.delete(interestId);

      if (!result.success) {
        alert(result.message);
        this.cdr.detectChanges();
        return;
      }

      // Cancelled interests should disappear from the "sent" list.
      this.sent = this.sent.filter((i) => i.interestId !== interestId);

      this.cdr.detectChanges();

    });

  }


  logout(): void {
    this.authService.logoutUser();
  }

}
