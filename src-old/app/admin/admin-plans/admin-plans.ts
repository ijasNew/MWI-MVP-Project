import {
  CommonModule
} from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  AdminMenu
} from '../admin-menu/admin-menu';

import {
  FormsModule
} from '@angular/forms';

import {
  ApiService
} from '../../services/api';


interface PlanUser {

  id: string;

  user_id: number;

  name: string;

  gender: string;

  place: string;

  phone: string;

  registeredDate: string;

  plan: 'Free' | 'Basic';

  status: 'Active' | 'Pending';

  paymentStatus:
    | 'Not Required'
    | 'Pending'
    | 'Success'
    | 'Failed'
    | 'Refunded';

}


@Component({
  selector: 'app-admin-plans',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    AdminMenu
  ],

  templateUrl: './admin-plans.html',

  styleUrl: './admin-plans.css'
})


export class AdminPlans implements OnInit {


  searchTerm = '';

  selectedPlan = 'All';


  showPlanPopup = false;

  selectedUser: PlanUser | null = null;


  selectedPlanValue:
    'Free' | 'Basic' = 'Free';


  selectedPaymentStatus:
    | 'pending'
    | 'success'
    | 'failed'
    | 'refunded' = 'success';


  users: PlanUser[] = [];


  isLoading = false;

  isSaving = false;


  errorMessage = '';

  successMessage = '';


  constructor(
    private router: Router,

    private apiService: ApiService,

    private cdr: ChangeDetectorRef
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadUsers();

  }


  // =========================================================
  // LOAD USERS
  // =========================================================

  loadUsers(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.successMessage = '';


    this.apiService
      .getAdminPlanUsers()
      .subscribe({

        next: (response: any) => {

          this.users =
            response?.data?.users ?? [];


          this.isLoading = false;


          this.cdr.detectChanges();

        },


        error: (error: any) => {

          console.error(
            'Failed to load admin plan users:',
            error
          );


          this.users = [];


          this.errorMessage =
            error?.error?.message ||
            'Unable to load users. Please try again.';


          this.isLoading = false;


          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // FILTERED USERS
  // =========================================================

  get filteredUsers(): PlanUser[] {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    return this.users.filter(user => {


      const matchesSearch =
        !search ||

        user.id
          .toLowerCase()
          .includes(search) ||

        user.name
          .toLowerCase()
          .includes(search) ||

        user.place
          .toLowerCase()
          .includes(search) ||

        user.phone
          .includes(search);


      const matchesPlan =
        this.selectedPlan === 'All' ||

        user.plan === this.selectedPlan;


      return (
        matchesSearch &&
        matchesPlan
      );

    });

  }


  // =========================================================
  // SUMMARY
  // =========================================================

  get totalUsers(): number {

    return this.users.length;

  }


  get freeUsers(): number {

    return this.users.filter(
      user => user.plan === 'Free'
    ).length;

  }


  get basicUsers(): number {

    return this.users.filter(
      user => user.plan === 'Basic'
    ).length;

  }


  // =========================================================
  // VIEW PROFILE
  // =========================================================

  viewProfile(
    memberId: string
  ): void {

    this.router.navigate([
      '/admin/profile-view',
      memberId
    ]);

  }


  // =========================================================
  // OPEN PLAN POPUP
  // =========================================================

  openPlanPopup(
    user: PlanUser
  ): void {

    this.selectedUser = user;


    this.selectedPlanValue =
      user.plan;


    /*
     * When current plan is Free,
     * default payment status to Success.
     *
     * For Basic, use latest payment status
     * when possible.
     */

    if (user.plan === 'Free') {

      this.selectedPaymentStatus =
        'success';

    } else {

      switch (user.paymentStatus) {

        case 'Pending':

          this.selectedPaymentStatus =
            'pending';

          break;


        case 'Failed':

          this.selectedPaymentStatus =
            'failed';

          break;


        case 'Refunded':

          this.selectedPaymentStatus =
            'refunded';

          break;


        default:

          this.selectedPaymentStatus =
            'success';

      }

    }


    this.errorMessage = '';

    this.successMessage = '';


    this.showPlanPopup = true;


    this.cdr.detectChanges();

  }


  // =========================================================
  // CLOSE PLAN POPUP
  // =========================================================

  closePlanPopup(): void {

    if (this.isSaving) {
      return;
    }


    this.showPlanPopup = false;

    this.selectedUser = null;


    this.cdr.detectChanges();

  }


  // =========================================================
  // CONFIRM PLAN CHANGE
  // =========================================================

  confirmPlanChange(): void {

    if (!this.selectedUser) {

      return;

    }


    /*
     * Nothing changed
     */

    if (
      this.selectedPlanValue ===
        this.selectedUser.plan
      &&
      (
        this.selectedPlanValue === 'Free'
        ||
        this.selectedPaymentStatus ===
          this.getPaymentStatusValue(
            this.selectedUser.paymentStatus
          )
      )
    ) {

      this.closePlanPopup();

      return;

    }


    this.isSaving = true;

    this.errorMessage = '';

    this.successMessage = '';


    /*
     * Free plan does not need a real payment.
     * Backend also forces Free -> success internally.
     */

    const paymentStatus =
      this.selectedPlanValue === 'Free'
        ? 'success'
        : this.selectedPaymentStatus;


    this.apiService
      .changeAdminUserPlan({

        member_id:
          this.selectedUser.id,

        plan:
          this.selectedPlanValue,

        payment_status:
          paymentStatus

      })
      .subscribe({

        next: (response: any) => {

          console.log(
            'Plan change successful:',
            response
          );


          this.isSaving = false;


          this.showPlanPopup = false;

          this.selectedUser = null;


          this.successMessage =
            response?.message ||
            'User plan updated successfully.';


          /*
           * Reload from database.
           *
           * This ensures the screen shows the
           * actual backend state, not local data.
           */

          this.loadUsers();


          this.cdr.detectChanges();

        },


        error: (error: any) => {

          console.error(
            'Failed to change user plan:',
            error
          );


          this.isSaving = false;


          this.errorMessage =
            error?.error?.message ||
            'Unable to update user plan. Please try again.';


          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // PAYMENT STATUS VALUE
  // =========================================================

  private getPaymentStatusValue(
    status:
      | 'Not Required'
      | 'Pending'
      | 'Success'
      | 'Failed'
      | 'Refunded'
  ):
    | 'pending'
    | 'success'
    | 'failed'
    | 'refunded'
  {

    switch (status) {

      case 'Pending':
        return 'pending';

      case 'Failed':
        return 'failed';

      case 'Refunded':
        return 'refunded';

      default:
        return 'success';

    }

  }


  // =========================================================
  // PAYMENT STATUS CLASS
  // =========================================================

  getPaymentStatusClass(
    status: string
  ): string {

    return status
      .toLowerCase()
      .replace(/\s+/g, '-');

  }


  // =========================================================
  // PLAN CLASS
  // =========================================================

  getPlanClass(
    plan: string
  ): string {

    return plan
      .toLowerCase()
      .replace(/\s+/g, '-');

  }


  // =========================================================
  // STATUS CLASS
  // =========================================================

  getStatusClass(
    status: string
  ): string {

    return status
      .toLowerCase()
      .replace(/\s+/g, '-');

  }


  // =========================================================
  // DASHBOARD
  // =========================================================

  openDashboard(): void {

    this.router.navigate([
      '/admin/dashboard'
    ]);

  }

}