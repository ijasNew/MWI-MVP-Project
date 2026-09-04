import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserMenu } from '../../components/user-menu/user-menu';
import { ShortlistService, ShortlistedProfile } from '../../services/shortlist';

@Component({
  selector: 'app-shortlisted',
  imports: [CommonModule, UserMenu],
  templateUrl: './shortlisted.html',
  styleUrl: './shortlisted.css'
})
export class Shortlisted implements OnInit {

  profiles: ShortlistedProfile[] = [];

  loading = true;

  // memberIds currently being removed (disables the button while in-flight)
  busyIds = new Set<string>();

  constructor(
    private router: Router,
    private shortlistService: ShortlistService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.loadShortlist();
  }


  get hasShortlistedProfiles(): boolean {
    return this.profiles.length > 0;
  }


  loadShortlist(): void {

    this.loading = true;

    this.shortlistService.getShortlist().subscribe((result) => {

      this.profiles = result.profiles;

      this.loading = false;

      this.cdr.detectChanges();

    });

  }


  goToMatchingProfiles(): void {
    this.router.navigate(['/matching-profiles']);
  }


  viewProfile(memberId: string): void {

    if (!memberId) {
      return;
    }

    this.router.navigate(['/profile-view', memberId], {
      state: { returnUrl: '/shortlisted' }
    });
  }


  removeShortlist(memberId: string): void {

    if (!memberId || this.busyIds.has(memberId)) {
      return;
    }

    this.busyIds.add(memberId);

    this.shortlistService.removeShortlist(memberId).subscribe((result) => {

      this.busyIds.delete(memberId);

      if (!result.success) {
        alert(result.message);
        this.cdr.detectChanges();
        return;
      }

      this.profiles = this.profiles.filter((p) => p.memberId !== memberId);

      this.cdr.detectChanges();

    });

  }

}
