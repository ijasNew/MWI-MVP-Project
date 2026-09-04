import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserMenu } from '../../components/user-menu/user-menu';
import { InterestService } from '../../services/interest';
import { AuthService } from '../../services/auth';

interface InterestItem {
  interestId: string;
  memberId: string;
  name: string;
  age: number | null;
  maritalStatus: string;
  district: string;
  religion: string;
  education: string;
  photoUrl: string | null;
  verified: boolean;
  status: string;
  createdAt: string;
}

@Component({
  selector: 'app-interests',
  standalone: true,
  imports: [CommonModule, UserMenu],
  templateUrl: './interests.html',
  styleUrl: './interests.css'
})
export class Interests implements OnInit {
  activeTab: 'received' | 'sent' = 'received';
  received: InterestItem[] = [];
  sent: InterestItem[] = [];
  isLoading = false;
  errorMessage = '';
  actionLoadingId: string | null = null;

  constructor(
    private router: Router,
    private interestService: InterestService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadInterests();
  }

  loadInterests(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.interestService.getReceivedInterests().subscribe({
      next: (response: any) => {
        this.received = response?.data?.interests ?? [];
        this.interestService.getSentInterests().subscribe({
          next: (sentResponse: any) => {
            this.sent = sentResponse?.data?.interests ?? [];
            this.isLoading = false;
          },
          error: (error: any) => {
            this.isLoading = false;
            this.errorMessage = error?.error?.message || 'Unable to load sent interests.';
          }
        });
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Unable to load interests.';
      }
    });
  }

  selectTab(tab: 'received' | 'sent'): void {
    this.activeTab = tab;
  }

  viewProfile(memberId: string): void {
    if (!memberId) return;
    this.router.navigate(['/profile-view', memberId], { state: { returnUrl: '/interests' } });
  }

  acceptInterest(item: InterestItem): void {
    this.respond(item, 'accept');
  }

  declineInterest(item: InterestItem): void {
    this.respond(item, 'decline');
  }

  private respond(item: InterestItem, action: 'accept' | 'decline'): void {
    if (!item.interestId || this.actionLoadingId) return;
    this.actionLoadingId = item.interestId;
    const request = action === 'accept'
      ? this.interestService.acceptInterest(item.interestId)
      : this.interestService.declineInterest(item.interestId);
    request.subscribe({
      next: () => {
        this.actionLoadingId = null;
        this.loadInterests();
      },
      error: (error: any) => {
        this.actionLoadingId = null;
        alert(error?.error?.message || 'Unable to update interest.');
      }
    });
  }

  cancelInterest(item: InterestItem): void {
    if (!item.interestId || this.actionLoadingId) return;
    this.actionLoadingId = item.interestId;
    this.interestService.cancelInterest(item.interestId).subscribe({
      next: () => {
        this.actionLoadingId = null;
        this.loadInterests();
      },
      error: (error: any) => {
        this.actionLoadingId = null;
        alert(error?.error?.message || 'Unable to cancel interest.');
      }
    });
  }

  logout(): void {
    this.authService.logoutUser();
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ');
  }
}
