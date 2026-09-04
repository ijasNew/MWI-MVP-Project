import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserMenu } from '../../components/user-menu/user-menu';
import { ApiService } from '../../services/api';

interface ShortlistedProfile {
  memberId: string; name: string; age: number | null; maritalStatus: string; district: string; religion: string; education: string; photoUrl: string | null; verified: boolean; shortlistedAt: string;
}

@Component({
  selector: 'app-shortlisted',
  standalone: true,
  imports: [CommonModule, UserMenu],
  templateUrl: './shortlisted.html',
  styleUrl: './shortlisted.css'
})
export class Shortlisted implements OnInit {
  profiles: ShortlistedProfile[] = [];
  isLoading = false;
  errorMessage = '';
  removingId: string | null = null;

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void { this.loadShortlist(); }

  loadShortlist(): void {
    this.isLoading = true; this.errorMessage = '';
    this.apiService.getShortlist().subscribe({
      next: (response: any) => { this.profiles = response?.data?.profiles ?? []; this.isLoading = false; },
      error: (error: any) => { this.profiles = []; this.isLoading = false; this.errorMessage = error?.error?.message || 'Unable to load shortlisted profiles.'; }
    });
  }

  exploreMatches(): void {
    this.router.navigate(['/matching-profiles']);
  }

  viewProfile(memberId: string): void {
    if (!memberId) return;
    this.router.navigate(['/profile-view', memberId], { state: { returnUrl: '/shortlisted' } });
  }

  removeShortlist(memberId: string): void {
    if (!memberId || this.removingId) return;
    this.removingId = memberId;
    this.apiService.removeShortlist(memberId).subscribe({
      next: () => { this.removingId = null; this.loadShortlist(); },
      error: (error: any) => { this.removingId = null; alert(error?.error?.message || 'Unable to remove shortlist.'); }
    });
  }
}
